import tasksData from "@/services/mockData/tasks.json"

let tasks = [...tasksData]

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

export const taskService = {
  async getAll() {
    await delay(300)
    return [...tasks]
  },

  async getById(id) {
    await delay(200)
    const task = tasks.find(t => t.Id === parseInt(id))
    if (!task) {
      throw new Error("Task not found")
    }
    return { ...task }
  },

  async getByProject(projectId) {
    await delay(250)
    return tasks.filter(t => t.projectId === parseInt(projectId))
  },

  async getByAssignee(assigneeId) {
    await delay(250)
    return tasks.filter(t => t.assigneeId === assigneeId)
  },

  async create(taskData) {
    await delay(400)
    const newTask = {
      Id: Math.max(...tasks.map(t => t.Id)) + 1,
      ...taskData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    tasks.push(newTask)
    return { ...newTask }
  },

  async update(id, taskData) {
    await delay(300)
    const index = tasks.findIndex(t => t.Id === parseInt(id))
    if (index === -1) {
      throw new Error("Task not found")
    }
    tasks[index] = {
      ...tasks[index],
      ...taskData,
      updatedAt: new Date().toISOString()
    }
    return { ...tasks[index] }
  },

  async updateStatus(id, status) {
    await delay(200)
    const index = tasks.findIndex(t => t.Id === parseInt(id))
    if (index === -1) {
      throw new Error("Task not found")
    }
    tasks[index] = {
      ...tasks[index],
      status,
      updatedAt: new Date().toISOString()
    }
    return { ...tasks[index] }
  },

  async delete(id) {
    await delay(250)
    const index = tasks.findIndex(t => t.Id === parseInt(id))
    if (index === -1) {
      throw new Error("Task not found")
    }
    tasks.splice(index, 1)
    return true
  },

async search(query) {
    await delay(300)
    const lowercaseQuery = query.toLowerCase()
    return tasks.filter(task => 
      task.title.toLowerCase().includes(lowercaseQuery) ||
      task.description.toLowerCase().includes(lowercaseQuery) ||
      task.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
    )
  },

  async getByDateRange(startDate, endDate) {
    await delay(250)
    const start = new Date(startDate)
    const end = new Date(endDate)
    return tasks.filter(task => {
      if (!task.dueDate) return false
      const taskDate = new Date(task.dueDate)
      return taskDate >= start && taskDate <= end
    })
  },

  async updateDueDate(id, dueDate) {
    await delay(200)
    const index = tasks.findIndex(t => t.Id === parseInt(id))
    if (index === -1) {
      throw new Error("Task not found")
    }
    tasks[index] = {
      ...tasks[index],
      dueDate: dueDate,
      updatedAt: new Date().toISOString()
    }
    return { ...tasks[index] }
  }
}