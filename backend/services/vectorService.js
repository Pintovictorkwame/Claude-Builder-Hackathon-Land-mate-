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
        { text: 'According to the Land Act, 2020 (Act 1036) of Ghana, all land in Ghana belongs to the people. An individual can acquire a leasehold interest up to a maximum of 99 years.', source: 'Land Act 2020' },
        { text: 'The Intestate Succession Law, 1985 (PNDCL 111) states that where the deceased is survived by a spouse and children, the remainder of the estate shall be distributed in specific fractions.', source: 'Intestate Succession Law 1985' },
        { text: 'Under the Constitution of Ghana (1992), any citizen who is 18 years of age or older and of sound mind has the right to vote in public elections.', source: 'Constitution 1992' },
        { text: 'To incorporate a limited liability company in Ghana, promoters must submit the required documents to the Registrar of Companies and pay the statutory stamp duty.', source: 'Companies Act 2019' },
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
