import usersData from "@/services/mockData/users.json"

let users = [...usersData]

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

export const userService = {
  async getAll() {
    await delay(200)
    return [...users]
  },

  async getById(id) {
    await delay(150)
    const user = users.find(u => u.Id === parseInt(id))
    if (!user) {
      throw new Error("User not found")
    }
    return { ...user }
  },

  async getCurrentUser() {
    await delay(100)
    // Return first user as current user for demo
    return { ...users[0] }
  },

  async create(userData) {
    await delay(300)
    const newUser = {
      Id: Math.max(...users.map(u => u.Id)) + 1,
      ...userData
    }
    users.push(newUser)
    return { ...newUser }
  },

  async update(id, userData) {
    await delay(250)
    const index = users.findIndex(u => u.Id === parseInt(id))
    if (index === -1) {
      throw new Error("User not found")
    }
    users[index] = {
      ...users[index],
      ...userData
    }
    return { ...users[index] }
  },

  async delete(id) {
    await delay(200)
    const index = users.findIndex(u => u.Id === parseInt(id))
    if (index === -1) {
      throw new Error("User not found")
    }
    users.splice(index, 1)
    return true
  }
}