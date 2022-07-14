const mongoose = require("mongoose");

const todoSchema = new mongoose.Schema({
  taskName: {
    type: String
  },
  completed: {
    type: Boolean
  }
});

const todoModel = mongoose.model('TodoTask', todoSchema);

const listSchema = new mongoose.Schema({
  listName: {
    type: String
  },
  todo: [todoSchema]
});

const listModel = mongoose.model('TaskList', listSchema);

module.exports = {
  todoModel,
  listModel
}
 