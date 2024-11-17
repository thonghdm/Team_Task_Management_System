const mongoose = require('mongoose')

// Starred Schema
const StarredSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      required: true
    },
    isStarred: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
)

// Tạo model
const Starred = mongoose.model('Starred', StarredSchema)

module.exports = Starred
