// server/Document.js
const { Schema, model } = require("mongoose");

const DocumentSchema = new Schema(
  {
    _id: String, // The unique room UUID from the URL
    data: Object, // The Quill Delta JSON object
  },
  {
    timestamps: true, // Mongoose will automatically add 'createdAt' and 'updatedAt' fields
  },
);

module.exports = model("Document", DocumentSchema);
