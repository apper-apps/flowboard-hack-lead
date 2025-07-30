import projectsData from "@/services/mockData/projects.json";

let projects = [...projectsData]

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

export const projectService = {
  async getAll() {
    await delay(300)
    return [...projects]
  },

  async getById(id) {
    await delay(200)
    const project = projects.find(p => p.Id === parseInt(id))
    if (!project) {
      throw new Error("Project not found")
    }
    return { ...project }
  },

async create(projectData) {
    await delay(400)
    const newProject = {
      Id: Math.max(...projects.map(p => p.Id)) + 1,
      ...projectData,
      attachments: projectData.attachments || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      completionPercentage: 0
    }
    projects.push(newProject)
    return { ...newProject }
  },
  async update(id, projectData) {
    await delay(300)
const index = projects.findIndex(p => p.Id === parseInt(id))
    if (index === -1) {
      throw new Error("Project not found")
    }
    projects[index] = {
      ...projects[index],
      ...projectData,
      attachments: projectData.attachments || projects[index].attachments || [],
      updatedAt: new Date().toISOString()
    }
    return { ...projects[index] }
  },

  async delete(id) {
    await delay(250)
    const index = projects.findIndex(p => p.Id === parseInt(id))
    if (index === -1) {
      throw new Error("Project not found")
    }
    projects.splice(index, 1)
    return true
  },

async updateProgress(id, percentage) {
    await delay(200)
    const index = projects.findIndex(p => p.Id === parseInt(id))
    if (index === -1) {
      throw new Error("Project not found")
    }
    projects[index] = {
      ...projects[index],
      completionPercentage: percentage,
      updatedAt: new Date().toISOString()
    }
    return { ...projects[index] }
  },

  async getByDateRange(startDate, endDate) {
    await delay(250)
    const start = new Date(startDate)
    const end = new Date(endDate)
    return projects.filter(project => {
      const deadline = new Date(project.deadline)
      return deadline >= start && deadline <= end
    })
}
}