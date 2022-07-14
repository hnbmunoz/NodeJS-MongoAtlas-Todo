const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require("lodash");

//Models declarations
const todo = require("./models/todoSchema");
//Models declarations

const date = require("./utilies/dayToday");

const app = express();

mongoose.connect(
  "mongodb+srv://hnbmunoz:g3tP455W0rd@todocluster.fwznaw9.mongodb.net/todoListDb?retryWrites=true&w=majority"
);
//https://www.topcoder.com/thrive/articles/using-ejs-template-engine-with-express-js
//reference for ejs related
// app.use("view-engine", "ejs");

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

const newTodos = [];
var workItems = [];

const defaultTodo1 = new todo.todoModel({
  taskName: "task1",
  completed: false,
});

const defaultTodo2 = new todo.todoModel({
  taskName: "task2",
  completed: false,
});

const defaultTodo3 = new todo.todoModel({
  taskName: "task3",
  completed: false,
});

const defaultTodos = [defaultTodo1, defaultTodo2, defaultTodo3];

app.get("/", (req, res) => {
  const todoList = todo.todoModel.find({}, (err, foundTasks) => {
    if (foundTasks.length === 0) {
      todo.todoModel.insertMany(defaultTodos, (err) => {
        if (err) {
          console.log(err);
        } else {
          console.log("Successfully saved default List ");
        }
      });
      res.redirect("/");
    }
    res.render("list", {
      listTitle: date.dayToday(),
      newTodoItems: foundTasks,
      router: "/",
    });
  });
});
 
app.post("/", (req, res) => {
  const customList = req.body.btnNewTodo;

  const newTask = new todo.todoModel({
    taskName: req.body.newTodo,
    completed: false,
  });

  if (customList === date.dayToday()) {
    newTask.save(); 
    res.redirect("/");
  } else {
    console.log(customList);
    todo.listModel.findOne({ listName: customList.trim()}, (err, result) => {
      const newCustomTask = new todo.todoModel({
        taskName: req.body.newTodo,
        completed: false,
      });
      result.todo.push(newCustomTask);
      result.save();
      res.redirect("/" + _.capitalize(customList).trim());
    });
  }
});

//CHeck box remove function
app.post("/taskDone", (req, res) => {
  if (req.body.listTitle === date.dayToday()) {
    todo.todoModel.findByIdAndRemove(req.body.todoStatus, (err) => {
      if (err) {
        console.log(err);
      } else {
        console.log("Task Done");
      }
    });
    res.redirect("/");
  } else {
    todo.listModel.findOneAndUpdate(
      { listName: req.body.listTitle },
      { $pull: { todo: { _id: req.body.todoStatus }}},
      (err, result) => {       
        if (!err) {
          res.redirect("/" + req.body.listTitle);
        }

      }
    );
  }
});

app.get("/work", (req, res) => {
  res.render("list", {
    listTitle: " List",
    newTodoItems: workItems,
    dayIdx: "",
    router: "/work",
  });
});

app.post("/work", (req, res) => {
  let newWork = req.body.newTodo;
  workItems.push(newWork);
  res.redirect("/work");
});

app.get("/:customListRouter", (req, res) => {
  const customList = _.capitalize(req.params.customListRouter);
  todo.listModel.findOne({ listName: customList }, (err, results) => {
    if (err) {
      console.log(err);
    } else {
      if (!results) {
        const list = new todo.listModel({
          listName: customList,
          todo: defaultTodos,
        });
        list.save();
        res.redirect("/" + customList);
      } else {
        res.render("list", {
          listTitle: results.listName,
          newTodoItems: results.todo,
          router: "/" + customList,
        });
      }
    }
  });
});

app.listen(process.env.PORT || 3000, () => {
  console.log("Server Started");
});
