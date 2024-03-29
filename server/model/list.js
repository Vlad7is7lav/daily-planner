const mongoose = require("mongoose")

const listScheme = mongoose.Schema({
  date: {
    type: String,
    required: true,
    trim: true,
  },

  listName: {
    type: String,
    required: true,
    maxLength: 20,
  },

  todos: {
    type: Array,
    required: true,
    minLength: 1,
  },

  ownID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: false,
  },
})

const List = mongoose.model("List", listScheme)

module.exports = { List }
