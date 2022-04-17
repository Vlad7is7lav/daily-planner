import "./js/addition.js"
import "./js/View.js"
import "./js/Controller.js"
import "./assets/css/style.css"
import "./assets/scss/main.scss"

import "../node_modules/bootstrap/dist/css/bootstrap.min.css"

import Model from "./js/Model.js"
import View from "./js/View.js"
import Controller from "./js/Controller.js"

//start conditiion
const data = [
  {
    id: "01.02.2021",
    name: "Fruit",
    tasks: [
      { item: "1", completed: false },
      { item: "2", completed: false },
      { item: "3", completed: true },
      { item: "4", completed: true },
    ],
  },

  {
    id: "28.02.2021",
    name: "Travel",
    tasks: [
      { item: "1", completed: true },
      { item: "2", completed: true },
      { item: "3", completed: true },
      { item: "4", completed: true },
    ],
  },

  {
    id: "12.02.2021",
    name: "Fruit3",
    tasks: [
      { item: "5", completed: true },
      { item: "6", completed: false },
      { item: "7", completed: false },
      { item: "8", completed: false },
    ],
  },

  {
    id: "12.02.2021",
    name: "Fruit",
    tasks: [
      { item: "9", completed: false },
      { item: "10", completed: false },
      { item: "11", completed: true },
      { item: "12", completed: false },
    ],
  },
]

const model = new Model(data)
const view = new View()
const controller = new Controller(model, view)
