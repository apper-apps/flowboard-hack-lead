import commentsData from "@/services/mockData/comments.json"

let comments = [...commentsData]

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

export const commentService = {
  async getAll() {
    await delay(200)
    return [...comments]
  },

  async getByTask(taskId) {
    await delay(250)
    return comments.filter(c => c.taskId === parseInt(taskId))
  },

  async create(commentData) {
    await delay(300)
    const newComment = {
      Id: Math.max(...comments.map(c => c.Id)) + 1,
      ...commentData,
      createdAt: new Date().toISOString()
    }
    comments.push(newComment)
    return { ...newComment }
  },

  async update(id, commentData) {
    await delay(250)
    const index = comments.findIndex(c => c.Id === parseInt(id))
    if (index === -1) {
      throw new Error("Comment not found")
    }
    comments[index] = {
      ...comments[index],
      ...commentData
    }
    return { ...comments[index] }
  },

  async delete(id) {
    await delay(200)
    const index = comments.findIndex(c => c.Id === parseInt(id))
    if (index === -1) {
      throw new Error("Comment not found")
    }
    comments.splice(index, 1)
    return true
  }
}