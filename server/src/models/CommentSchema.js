// Comments Schema
const mongoose = require('mongoose')

const CommentSchema = new mongoose.Schema({
  task_id: {
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Task'
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    required: true
  },
  is_active: {
    type: Boolean,
    default: true
  }
},
  {
    timestamps: true
  })

const Comment = mongoose.model('Comment', CommentSchema)

module.exports = Comment