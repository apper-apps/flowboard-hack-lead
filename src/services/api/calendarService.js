import { taskService } from '@/services/api/taskService'
import { projectService } from '@/services/api/projectService'
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, isSameDay, isSameMonth } from 'date-fns'

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

export const calendarService = {
  async getCalendarEvents(startDate, endDate) {
    await delay(200)
    try {
      const [tasks, projects] = await Promise.all([
        taskService.getByDateRange(startDate, endDate),
        projectService.getByDateRange(startDate, endDate)
      ])

      const events = []

      // Add task events
      tasks.forEach(task => {
        if (task.dueDate) {
          events.push({
            id: `task-${task.Id}`,
            title: task.title,
            date: task.dueDate,
            type: 'task',
            priority: task.priority,
            status: task.status,
            data: task
          })
        }
      })

      // Add project deadline events
      projects.forEach(project => {
        events.push({
          id: `project-${project.Id}`,
          title: project.title,
          date: project.deadline,
          type: 'project',
          status: project.status,
          completion: project.completionPercentage,
          data: project
        })
      })

      return events.sort((a, b) => new Date(a.date) - new Date(b.date))
    } catch (error) {
      throw new Error('Failed to load calendar events')
    }
  },

  async createTaskFromCalendar(date, taskData) {
    await delay(300)
    const newTask = {
      ...taskData,
      dueDate: format(new Date(date), 'yyyy-MM-dd'),
      status: 'To Do',
      priority: taskData.priority || 'Medium'
    }
    return await taskService.create(newTask)
  },

  async moveTaskToDate(taskId, newDate) {
    await delay(200)
    return await taskService.updateDueDate(taskId, format(new Date(newDate), 'yyyy-MM-dd'))
  },

  generateCalendarDays(currentDate, view = 'month') {
    let start, end

    switch (view) {
      case 'week':
        start = startOfWeek(currentDate, { weekStartsOn: 0 })
        end = endOfWeek(currentDate, { weekStartsOn: 0 })
        break
      case 'day':
        start = currentDate
        end = currentDate
        break
      default: // month
        start = startOfWeek(startOfMonth(currentDate), { weekStartsOn: 0 })
        end = endOfWeek(endOfMonth(currentDate), { weekStartsOn: 0 })
    }

    const days = []
    let day = start

    while (day <= end) {
      days.push({
        date: new Date(day),
        isCurrentMonth: view === 'day' ? true : isSameMonth(day, currentDate),
        isToday: isSameDay(day, new Date()),
        dateString: format(day, 'yyyy-MM-dd')
      })
      day = addDays(day, 1)
    }

    return days
  },

  getEventColor(event) {
    if (event.type === 'task') {
      switch (event.priority) {
        case 'High': return 'bg-error text-white'
        case 'Medium': return 'bg-warning text-white'
        case 'Low': return 'bg-info text-white'
        default: return 'bg-gray-500 text-white'
      }
    } else if (event.type === 'project') {
      switch (event.status) {
        case 'Completed': return 'bg-success text-white'
        case 'In Progress': return 'bg-primary text-white'
        case 'Planning': return 'bg-secondary text-white'
        default: return 'bg-gray-500 text-white'
      }
    }
    return 'bg-gray-500 text-white'
  }
}