const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: true,
    },
    source: {
      type: String,
    },
    embedding: {
      type: [Number], // Storing vectors as an array of numbers
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Document', documentSchema);
