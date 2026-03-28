const { pipeline } = require('@xenova/transformers');
const Document = require('../models/Document');

let extractor;

/**
 * Initialize the Xenova transformers pipeline locally for embedding generation.
 */
const initExtractor = async () => {
  if (!extractor) {
    // Uses the exact same underlying model as ChromaDB default
    extractor = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2', {
      quantized: false, // Use full precision to match 384 dimensions perfectly
    });
  }
  return extractor;
};

/**
 * Generate a 384-dimensional vector embedding for the given text.
 * @param {string} text - The input text
 * @returns {Promise<number[]>} - The vector embedding array
 */
const generateEmbedding = async (text) => {
  const ext = await initExtractor();
  const result = await ext(text, { pooling: 'mean', normalize: true });
  // result.data is a Float32Array; convert to normal Array of Numbers for MongoDB
  return Array.from(result.data);
};

/**
 * Add a document to the knowledge base (MongoDB).
 * @param {string} text - The legal text to add
 * @param {Object} metadata - Optional metadata (e.g., source info)
 */
const addDocument = async (text, metadata = {}) => {
  try {
    const embedding = await generateEmbedding(text);
    await Document.create({
      text: text,
      source: metadata.source || 'Unknown',
      embedding: embedding
    });
  } catch (error) {
    console.error('Error adding document to MongoDB:', error);
  }
};

/**
 * Query documents from MongoDB based on user input using $vectorSearch.
 * @param {string} query - The user's question
 * @param {number} nResults - Number of results to return (default 3)
 * @returns {Promise<Array>} - List of relevant strings
 */
const queryDocuments = async (query, nResults = 3) => {
  try {
    const queryEmbedding = await generateEmbedding(query);

    // MongoDB Atlas $vectorSearch pipeline
    // Requires a Vector Search Index configured in the UI with path "embedding"
    const results = await Document.aggregate([
      {
        $vectorSearch: {
          index: "vector_index",
          path: "embedding",
          queryVector: queryEmbedding,
          numCandidates: 10,
          limit: nResults
        }
      },
      {
        $project: {
          text: 1,
          source: 1,
          score: { $meta: "vectorSearchScore" }
        }
      }
    ]);

    if (results && results.length > 0) {
      return results.map(doc => doc.text); // Extract the strings just like Chroma did
    }
    return [];
  } catch (error) {
    console.error('Error querying documents in MongoDB. Have you configured the Vector Search Index?', error);
    return [];
  }
};

/**
 * Seed mock legal documents if the collection is empty.
 */
const seedMockData = async () => {
  try {
    const count = await Document.countDocuments();
    
    if (count === 0) {
      console.log('Knowledge base is empty. Downloading embedding model and seeding mock legal documents... (This may take a minute)');
      const mockDocs = [
  ...
  { 
    text: 'Land administration in Ghana is governed by both customary practices and enacted legislation, resulting in two primary types of land ownership: public (state) and private lands.', 
    source: 'National Land Policy 1999' 
  },
  { 
    text: 'In Ghana, "allodial" title represents the absolute or permanent title to land, from which all other lesser interests, such as leaseholds or usufruct rights, are derived.', 
    source: 'National Land Policy 1999' 
  },
  { 
    text: 'Public lands in Ghana are those compulsorily acquired by the government, vested in the President, and held in trust by the State for the people of Ghana.', 
    source: 'National Land Policy 1999' 
  },
  { 
    text: 'Private lands in many parts of Ghana are held in communal ownership by a "stool" or "skin" (symbols of traditional authority) or by a family in trust for the community.', 
    source: 'National Land Policy 1999' 
  },
  { 
    text: 'Under standard real estate sales terms in Ghana, a buyer may be required to pay a non-refundable deposit (e.g., $500) to reserve a residential property for a limited period, such as two weeks.', 
    source: 'GHS Sales Agreement Terms' 
  },
  { 
    text: 'Residential property acquisitions in planned estate schemes in Ghana, such as Korleman City, often involve the issuance of a sublease rather than a freehold interest.', 
    source: 'GHS Sales Agreement Terms' 
  },
  { 
    text: 'According to Section 95 of the Land Revenue Act in certain jurisdictions (such as Karnataka), agricultural land must be officially converted for non-agricultural use before it can be legally conveyed for other purposes.', 
    source: 'Land Revenue Act (via Land Certificate)' 
  },
  { 
    text: 'A "Sale Deed" is the primary legal instrument used to certify the transfer of land ownership from a seller to a purchaser upon completion of a transaction.', 
    source: 'Land Certificate / Sale Deed' 
  },
  { 
    text: 'Stool or skin lands are a predominant feature of land ownership among Akan traditional groups in Southern Ghana and various groups in Northern Ghana.', 
    source: 'National Land Policy 1999' 
  },
  { 
    text: 'Vested lands in Ghana represent a form of "split ownership" where the legal title is held by the State in trust, while the beneficial interest remains with the traditional owners.', 
    source: 'National Land Policy 1999' 
  }
];
      
      for (const doc of mockDocs) {
        await addDocument(doc.text, { source: doc.source });
      }
      console.log('Seeded mock legal data successfully.');
    } else {
      console.log(`Knowledge base already contains ${count} documents. No mock seeding needed.`);
    }
  } catch (error) {
    console.error('Error seeding mock data:', error);
  }
};

module.exports = {
  addDocument,
  queryDocuments,
  seedMockData
};
