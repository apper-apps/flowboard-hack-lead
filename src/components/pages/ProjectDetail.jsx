import React, { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { format } from "date-fns"
import { toast } from "react-toastify"
import Button from "@/components/atoms/Button"
import Card from "@/components/atoms/Card"
import StatusBadge from "@/components/molecules/StatusBadge"
import PriorityBadge from "@/components/molecules/PriorityBadge"
import ProgressRing from "@/components/molecules/ProgressRing"
import KanbanBoard from "@/components/organisms/KanbanBoard"
import TaskModal from "@/components/organisms/TaskModal"
import TaskFormModal from "@/components/organisms/TaskFormModal"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"
import ApperIcon from "@/components/ApperIcon"
import { projectService } from "@/services/api/projectService"
import { taskService } from "@/services/api/taskService"

// Task List View Component
const TaskListView = ({ tasks, onTaskClick, onTaskStatusChange }) => {
  const [sortBy, setSortBy] = useState('dueDate')
  const [sortOrder, setSortOrder] = useState('asc')
  const [filterStatus, setFilterStatus] = useState('all')

  const sortedTasks = [...tasks].sort((a, b) => {
    let aValue = a[sortBy]
    let bValue = b[sortBy]
    
    if (sortBy === 'dueDate') {
      aValue = new Date(aValue || '9999-12-31')
      bValue = new Date(bValue || '9999-12-31')
    }
    
    if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1
    if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1
    return 0
  })

  const filteredTasks = filterStatus === 'all' 
    ? sortedTasks 
    : sortedTasks.filter(task => task.status === filterStatus)

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(field)
      setSortOrder('asc')
    }
  }

  const handleStatusChange = async (task, newStatus) => {
    try {
      const updatedTask = await taskService.update(task.Id, { ...task, status: newStatus })
      onTaskStatusChange(updatedTask)
      toast.success('Task status updated successfully')
    } catch (error) {
      toast.error('Failed to update task status')
    }
  }

  return (
    <Card className="p-6">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Task List</h3>
        <div className="flex flex-col sm:flex-row gap-3">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            <option value="all">All Status</option>
            <option value="To Do">To Do</option>
            <option value="In Progress">In Progress</option>
            <option value="Review">Review</option>
            <option value="Done">Done</option>
          </select>
        </div>
      </div>

      {filteredTasks.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <ApperIcon name="List" className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>No tasks found</p>
          <p className="text-sm mt-1">
            {filterStatus === 'all' ? 'Create your first task' : `No tasks with status "${filterStatus}"`}
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th 
                  className="text-left py-3 px-2 font-medium text-gray-600 cursor-pointer hover:text-gray-900"
                  onClick={() => handleSort('title')}
                >
                  <div className="flex items-center gap-1">
                    Task Name
                    {sortBy === 'title' && (
                      <ApperIcon 
                        name={sortOrder === 'asc' ? 'ChevronUp' : 'ChevronDown'} 
                        className="h-4 w-4" 
                      />
                    )}
                  </div>
                </th>
                <th 
                  className="text-left py-3 px-2 font-medium text-gray-600 cursor-pointer hover:text-gray-900"
                  onClick={() => handleSort('status')}
                >
                  <div className="flex items-center gap-1">
                    Status
                    {sortBy === 'status' && (
                      <ApperIcon 
                        name={sortOrder === 'asc' ? 'ChevronUp' : 'ChevronDown'} 
                        className="h-4 w-4" 
                      />
                    )}
                  </div>
                </th>
                <th 
                  className="text-left py-3 px-2 font-medium text-gray-600 cursor-pointer hover:text-gray-900"
                  onClick={() => handleSort('priority')}
                >
                  <div className="flex items-center gap-1">
                    Priority
                    {sortBy === 'priority' && (
                      <ApperIcon 
                        name={sortOrder === 'asc' ? 'ChevronUp' : 'ChevronDown'} 
                        className="h-4 w-4" 
                      />
                    )}
                  </div>
                </th>
                <th 
                  className="text-left py-3 px-2 font-medium text-gray-600 cursor-pointer hover:text-gray-900"
                  onClick={() => handleSort('dueDate')}
                >
                  <div className="flex items-center gap-1">
                    Due Date
                    {sortBy === 'dueDate' && (
                      <ApperIcon 
                        name={sortOrder === 'asc' ? 'ChevronUp' : 'ChevronDown'} 
                        className="h-4 w-4" 
                      />
                    )}
                  </div>
                </th>
                <th className="text-left py-3 px-2 font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTasks.map((task) => (
                <tr 
                  key={task.Id} 
                  className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
                  onClick={() => onTaskClick(task)}
                >
                  <td className="py-4 px-2">
                    <div>
                      <p className="font-medium text-gray-900">{task.title}</p>
                      {task.description && (
                        <p className="text-sm text-gray-500 truncate max-w-xs">
                          {task.description}
                        </p>
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-2">
                    <select
                      value={task.status}
                      onChange={(e) => {
                        e.stopPropagation()
                        handleStatusChange(task, e.target.value)
                      }}
                      className="px-2 py-1 text-sm border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-primary/20"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <option value="To Do">To Do</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Review">Review</option>
                      <option value="Done">Done</option>
                    </select>
                  </td>
                  <td className="py-4 px-2">
                    {task.priority && <PriorityBadge priority={task.priority} />}
                  </td>
                  <td className="py-4 px-2">
                    {task.dueDate ? (
                      <span className={`text-sm ${
                        new Date(task.dueDate) < new Date() && task.status !== 'Done'
                          ? 'text-error font-medium'
                          : 'text-gray-600'
                      }`}>
                        {format(new Date(task.dueDate), 'MMM dd, yyyy')}
                      </span>
                    ) : (
                      <span className="text-sm text-gray-400">No due date</span>
                    )}
                  </td>
                  <td className="py-4 px-2">
                    <Button
                      variant="ghost"
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation()
                        onTaskClick(task)
                      }}
                    >
                      <ApperIcon name="Eye" className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  )
}

// Task Calendar View Component
const TaskCalendarView = ({ tasks, onTaskClick }) => {
  const [currentDate, setCurrentDate] = useState(new Date())
  
  const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)
  const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0)
  const startOfCalendar = new Date(startOfMonth)
  startOfCalendar.setDate(startOfCalendar.getDate() - startOfMonth.getDay())
  
  const calendarDays = []
  const currentCalendarDate = new Date(startOfCalendar)
  
  for (let i = 0; i < 42; i++) {
    calendarDays.push(new Date(currentCalendarDate))
    currentCalendarDate.setDate(currentCalendarDate.getDate() + 1)
  }

  const getTasksForDate = (date) => {
    return tasks.filter(task => {
      if (!task.dueDate) return false
      const taskDate = new Date(task.dueDate)
      return taskDate.toDateString() === date.toDateString()
    })
  }

  const navigateMonth = (direction) => {
    const newDate = new Date(currentDate)
    newDate.setMonth(newDate.getMonth() + direction)
    setCurrentDate(newDate)
  }

  const isToday = (date) => {
    return date.toDateString() === new Date().toDateString()
  }

  const isCurrentMonth = (date) => {
    return date.getMonth() === currentDate.getMonth()
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Task Calendar</h3>
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="small"
            onClick={() => navigateMonth(-1)}
          >
            <ApperIcon name="ChevronLeft" className="h-4 w-4" />
          </Button>
          <h2 className="text-xl font-semibold text-gray-900 min-w-[200px] text-center">
            {format(currentDate, 'MMMM yyyy')}
          </h2>
          <Button
            variant="ghost"
            size="small"
            onClick={() => navigateMonth(1)}
          >
            <ApperIcon name="ChevronRight" className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="p-2 text-center text-sm font-medium text-gray-500">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {calendarDays.map((date, index) => {
          const dayTasks = getTasksForDate(date)
          const isCurrentMonthDay = isCurrentMonth(date)
          const isTodayDate = isToday(date)
          
          return (
            <div
              key={index}
              className={`min-h-[120px] p-2 border border-gray-100 rounded-lg ${
                isCurrentMonthDay ? 'bg-white' : 'bg-gray-50'
              } ${isTodayDate ? 'ring-2 ring-primary/20 bg-primary/5' : ''}`}
            >
              <div className={`text-sm font-medium mb-2 ${
                isCurrentMonthDay ? 'text-gray-900' : 'text-gray-400'
              } ${isTodayDate ? 'text-primary font-semibold' : ''}`}>
                {date.getDate()}
              </div>
              
              <div className="space-y-1">
                {dayTasks.slice(0, 3).map((task) => (
                  <div
                    key={task.Id}
                    onClick={() => onTaskClick(task)}
                    className={`text-xs p-1 rounded cursor-pointer hover:shadow-sm transition-all ${
                      task.status === 'Done' 
                        ? 'bg-success/10 text-success border border-success/20' 
                        : task.status === 'In Progress'
                        ? 'bg-info/10 text-info border border-info/20'
                        : task.status === 'Review'
                        ? 'bg-warning/10 text-warning border border-warning/20'
                        : 'bg-gray/10 text-gray-600 border border-gray-200'
                    }`}
                  >
                    <div className="truncate font-medium">{task.title}</div>
                    {task.priority && (
                      <div className="text-xs opacity-75 mt-1">
                        {task.priority}
                      </div>
                    )}
                  </div>
                ))}
                {dayTasks.length > 3 && (
                  <div className="text-xs text-gray-500 text-center py-1">
                    +{dayTasks.length - 3} more
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      <div className="mt-6 flex items-center gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-gray/10 border border-gray-200 rounded"></div>
          <span className="text-gray-600">To Do</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-info/10 border border-info/20 rounded"></div>
          <span className="text-gray-600">In Progress</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-warning/10 border border-warning/20 rounded"></div>
          <span className="text-gray-600">Review</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-success/10 border border-success/20 rounded"></div>
          <span className="text-gray-600">Done</span>
        </div>
      </div>
    </Card>
  )
}

const ProjectDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [project, setProject] = useState(null)
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [activeView, setActiveView] = useState("kanban")
  const [selectedTask, setSelectedTask] = useState(null)
  const [showTaskModal, setShowTaskModal] = useState(false)
  const [showTaskForm, setShowTaskForm] = useState(false)

  useEffect(() => {
    loadProjectData()
  }, [id])

  const loadProjectData = async () => {
    try {
      setLoading(true)
      setError("")
      const [projectData, tasksData] = await Promise.all([
        projectService.getById(id),
        taskService.getByProject(id)
      ])
      setProject(projectData)
      setTasks(tasksData)
      
      // Update project completion based on tasks
      updateProjectCompletion(projectData, tasksData)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const updateProjectCompletion = async (projectData, tasksData) => {
    if (tasksData.length === 0) return

    const completedTasks = tasksData.filter(task => task.status === "Done").length
    const completion = Math.round((completedTasks / tasksData.length) * 100)

    if (completion !== projectData.completionPercentage) {
      try {
        const updatedProject = await projectService.updateProgress(id, completion)
        setProject(updatedProject)
      } catch (err) {
        console.error("Failed to update project completion:", err)
      }
    }
  }

  const handleTaskClick = (task) => {
    setSelectedTask(task)
    setShowTaskModal(true)
  }

  const handleTaskUpdate = (updatedTask) => {
    setTasks(prev => prev.map(task => 
      task.Id === updatedTask.Id ? updatedTask : task
    ))
    setSelectedTask(updatedTask)
    
    // Recalculate project completion
    const updatedTasks = tasks.map(task => 
      task.Id === updatedTask.Id ? updatedTask : task
    )
    updateProjectCompletion(project, updatedTasks)
  }

  const handleNewTask = () => {
    setShowTaskForm(true)
  }
const handleTaskStatusChange = (updatedTask) => {
    setTasks(prev => prev.map(task => 
      task.Id === updatedTask.Id ? updatedTask : task
    ))
  }

  const handleTaskSave = (savedTask) => {
    setTasks(prev => [...prev, savedTask])
    updateProjectCompletion(project, [...tasks, savedTask])
  }

  if (loading) {
    return <Loading />
  }

  if (error) {
    return <Error message={error} onRetry={loadProjectData} />
  }

  if (!project) {
    return <Error title="Project not found" message="The project you're looking for doesn't exist." />
  }

  const completedTasks = tasks.filter(task => task.status === "Done").length
  const inProgressTasks = tasks.filter(task => task.status === "In Progress").length
  const pendingTasks = tasks.filter(task => task.status === "To Do").length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="small"
            onClick={() => navigate("/projects")}
          >
            <ApperIcon name="ArrowLeft" className="h-4 w-4 mr-2" />
            Back to Projects
          </Button>
        </div>
        <Button onClick={handleNewTask}>
          <ApperIcon name="Plus" className="h-4 w-4 mr-2" />
          New Task
        </Button>
      </div>

      {/* Project Info */}
      <Card className="p-6">
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-4">
              <h1 className="text-3xl font-bold text-gray-900">{project.title}</h1>
              <StatusBadge status={project.status} type="project" />
            </div>
            <p className="text-gray-600 mb-6 leading-relaxed">{project.description}</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Deadline</p>
                <p className="text-lg font-semibold text-gray-900">
                  {format(new Date(project.deadline), "MMM dd, yyyy")}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Created</p>
                <p className="text-lg font-semibold text-gray-900">
                  {format(new Date(project.createdAt), "MMM dd, yyyy")}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Last Updated</p>
                <p className="text-lg font-semibold text-gray-900">
                  {format(new Date(project.updatedAt), "MMM dd, yyyy")}
                </p>
              </div>
            </div>
          </div>

          <div className="lg:w-64">
            <div className="text-center mb-6">
              <ProgressRing 
                percentage={project.completionPercentage} 
                size={120} 
                strokeWidth={8}
                className="mx-auto mb-4"
              />
              <p className="text-2xl font-bold text-primary mb-1">
                {project.completionPercentage}%
              </p>
              <p className="text-gray-500">Complete</p>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center">
              <div>
                <p className="text-lg font-bold text-gray-900">{pendingTasks}</p>
                <p className="text-xs text-gray-500">To Do</p>
              </div>
              <div>
                <p className="text-lg font-bold text-info">{inProgressTasks}</p>
                <p className="text-xs text-gray-500">In Progress</p>
              </div>
              <div>
                <p className="text-lg font-bold text-success">{completedTasks}</p>
                <p className="text-xs text-gray-500">Done</p>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* View Switcher */}
      <div className="flex items-center gap-2">
        <Button
          variant={activeView === "kanban" ? "primary" : "ghost"}
          size="small"
          onClick={() => setActiveView("kanban")}
        >
          <ApperIcon name="Kanban" className="h-4 w-4 mr-2" />
          Kanban
        </Button>
        <Button
          variant={activeView === "list" ? "primary" : "ghost"}
          size="small"
          onClick={() => setActiveView("list")}
        >
          <ApperIcon name="List" className="h-4 w-4 mr-2" />
          List
        </Button>
        <Button
          variant={activeView === "calendar" ? "primary" : "ghost"}
          size="small"
          onClick={() => setActiveView("calendar")}
        >
          <ApperIcon name="Calendar" className="h-4 w-4 mr-2" />
          Calendar
        </Button>
      </div>

      {/* Content */}
      <div className="min-h-[600px]">
{activeView === "kanban" && (
<KanbanBoard
            projectId={id}
            tasks={tasks}
            onTaskClick={handleTaskClick}
            onNewTask={handleNewTask}
            onTaskStatusChange={handleTaskStatusChange}
          />
        )}
        
{activeView === "list" && (
          <TaskListView 
            tasks={tasks}
            onTaskClick={handleTaskClick}
            onTaskStatusChange={handleTaskStatusChange}
          />
        )}
        
        {activeView === "calendar" && (
          <TaskCalendarView 
            tasks={tasks}
            onTaskClick={handleTaskClick}
          />
        )}
      </div>

      {/* Task Modal */}
      <TaskModal
        task={selectedTask}
        isOpen={showTaskModal}
        onClose={() => setShowTaskModal(false)}
        onUpdate={handleTaskUpdate}
      />

      {/* Task Form Modal */}
      <TaskFormModal
        projectId={id}
        isOpen={showTaskForm}
        onClose={() => setShowTaskForm(false)}
        onSave={handleTaskSave}
      />
    </div>
  )
}

export default ProjectDetail