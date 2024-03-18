import axios from "axios"

axios.defaults.baseURL = 'http://localhost:3003'

class Model {
  constructor(state = []) {
    this.state = state
    this.db = null
  }

  getTaskList(id, name, n) {
    if (n === 0 && !name) return this.state.find((item) => item.id == id)
    if (n === 0 && name) {
      let findList = this.state.find((item) => item.name == name)
      return findList
    }

    let filterArray = []

    if (n === 1) {
      let newData
      this.state.forEach((item) => {
        if (item.id == id && item.name == name) {
          newData = {
            item: item.id,
            name: item.name,
            tasks: item.tasks,
          }
        }
      })
      return newData
    }

    this.state.forEach((item) => {
      if (item.id == id) {
        filterArray.push({ item: item.id, name: item.name })
      }
    })

    return filterArray
  }

  async addTaskList(taskList) {
    if (taskList._id === null) {
      var response = await this.addList(taskList)
      return response
    }

    if (isObj === undefined) {
      this.state.push(taskList)
    } else {
      isObj.tasks.push(taskList.tasks[0])
    }
    return taskList
  }

  updateComp(item) {
    let isObj = this.getTaskList(item.id, item.name, 0)
    let isObjComplete = isObj.tasks[item.index]
    isObjComplete["completed"] = item.completed
    return this.state
  }

  datesFromState() {
    let dates = Array.from(this.state, ({ id }) => id)
    return dates
  }

  async getAllData() {
    const request = await axios
      .get("/lists/all_lists")
      .then((respone) => respone.data)
    let { auth, data } = request
    return { auth, data }
  }

  async getList(list) {
    const request = await axios
      .get(`/lists/list?id=${list._id}`)
      .then((respone) => respone.data)
    return request
  }

  async addList(taskList) {
    const request = await axios
      .post("/lists/list", taskList)
      .then((respone) => respone.data)
    return request
  }

  async deleteList(list) {
    const request = await axios.delete(`/lists/list?id=${list._id}`)
    return request
  }

  async addTask(taskList) {
    const request = await axios
      .post("/lists//list/add_task", taskList)
      .then((respone) => respone.data)
    return request
  }

  async updateItem(task) {
    const request = await axios
      .patch("/lists/list/update_task", task)
      .then((respone) => respone.data)
    return request
  }

  async deleteItem(item) {
    const request = await axios
      .patch("/lists/list/del_task", item)
      .then((respone) => respone.data)
    return request
  }

  async registerUser(data) {
    const request = await axios
      .post("/user/register", data)
      .then((response) => response.data)
    return request
  }

  async loginUser(data) {
    const request = await axios
      .post("/user/login", data)
      .then((response) => response.data) //auth, message, userData
    let { auth, message, userData } = request

    return { auth, message, userData }
  }

  async logoutUser() {
    const request = await axios
      .get("/user/logout")
      .then((respone) => respone.data)
    let { auth, logout } = request
    return { auth, logout }
  }

  //check token
  async userAuth(inner) {
    const request = await axios
      .get("/user/auth")
      .then((response) => response.data)
      .catch((err) => {
        console.log("Please, login first", err)
        return false
      })
    return request
  }
}

export default Model
