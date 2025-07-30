import React, { useState, useEffect } from "react"
import { useSearchParams } from "react-router-dom"
import { format, isAfter } from "date-fns"
import { toast } from "react-toastify"
import Button from "@/components/atoms/Button"
import Card from "@/components/atoms/Card"
import Avatar from "@/components/atoms/Avatar"
import SearchBar from "@/components/molecules/SearchBar"
import StatusBadge from "@/components/molecules/StatusBadge"
import PriorityBadge from "@/components/molecules/PriorityBadge"
import TaskModal from "@/components/organisms/TaskModal"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"
import Empty from "@/components/ui/Empty"
import ApperIcon from "@/components/ApperIcon"
import { taskService } from "@/services/api/taskService"
import { projectService } from "@/services/api/projectService"
import { userService } from "@/services/api/userService"

const MyTasks = () => {
  const [searchParams] = useSearchParams()
  const [tasks, setTasks] = useState([])
  const [projects, setProjects] = useState([])
  const [users, setUsers] = useState([])
  const [filteredTasks, setFilteredTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [selectedTask, setSelectedTask] = useState(null)
  const [showTaskModal, setShowTaskModal] = useState(false)
  const [currentUser] = useState({ Id: 1, name: "Alex Johnson" }) // Mock current user
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [priorityFilter, setPriorityFilter] = useState("")
  const [overdueFilter, setOverdueFilter] = useState(searchParams.get("filter") === "overdue")

  const filters = [
    {
      key: "status",
      label: "Status",
      value: statusFilter,
      options: [
        { value: "To Do", label: "To Do" },
        { value: "In Progress", label: "In Progress" },
        { value: "Review", label: "Review" },
        { value: "Done", label: "Done" }
      ]
    },
    {
      key: "priority",
      label: "Priority",
      value: priorityFilter,
      options: [
        { value: "Low", label: "Low" },
        { value: "Medium", label: "Medium" },
        { value: "High", label: "High" },
        { value: "Critical", label: "Critical" }
      ]
    }
  ]

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    filterTasks()
  }, [tasks, searchQuery, statusFilter, priorityFilter, overdueFilter])

  const loadData = async () => {
    try {
      setLoading(true)
      setError("")
      const [tasksData, projectsData, usersData] = await Promise.all([
        taskService.getByAssignee(currentUser.Id.toString()),
        projectService.getAll(),
        userService.getAll()
      ])
      setTasks(tasksData)
      setProjects(projectsData)
      setUsers(usersData)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const filterTasks = () => {
    let filtered = [...tasks]

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(task =>
        task.title.toLowerCase().includes(query) ||
        task.description.toLowerCase().includes(query) ||
        task.tags?.some(tag => tag.toLowerCase().includes(query))
      )
    }

    if (statusFilter) {
      filtered = filtered.filter(task => task.status === statusFilter)
    }

    if (priorityFilter) {
      filtered = filtered.filter(task => task.priority === priorityFilter)
    }

    if (overdueFilter) {
      filtered = filtered.filter(task => 
        task.dueDate && 
        isAfter(new Date(), new Date(task.dueDate)) && 
        task.status !== "Done"
      )
    }

    setFilteredTasks(filtered)
  }

  const handleSearch = (query) => {
    setSearchQuery(query)
  }

  const handleFilterChange = (key, value) => {
    switch (key) {
      case "status":
        setStatusFilter(value)
        break
      case "priority":
        setPriorityFilter(value)
        break
      default:
        break
    }
  }

  const handleTaskClick = (task) => {
    setSelectedTask(task)
    setShowTaskModal(true)
  }

const handleTaskUpdate = async (updatedTask) => {
    // Update local state immediately for responsive UI
    setTasks(prev => prev.map(task => 
      task.Id === updatedTask.Id ? updatedTask : task
    ))
    setSelectedTask(updatedTask)
    
    // Reload all data to ensure newly created tasks are visible
    // This is especially important for tasks that might not be assigned to current user
    await loadData()
  }

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      const updatedTask = await taskService.updateStatus(taskId, newStatus)
      setTasks(prev => prev.map(task => 
        task.Id === taskId ? updatedTask : task
      ))
      toast.success("Task status updated")
    } catch (err) {
      toast.error("Failed to update task status")
    }
  }

  const getProjectById = (projectId) => {
    return projects.find(project => project.Id === parseInt(projectId))
  }

  const getUserById = (userId) => {
    return users.find(user => user.Id === parseInt(userId))
  }

  const groupTasksByStatus = (tasks) => {
    return tasks.reduce((groups, task) => {
      const status = task.status
      if (!groups[status]) {
        groups[status] = []
      }
      groups[status].push(task)
      return groups
    }, {})
  }

  if (loading) {
    return <Loading type="skeleton" />
  }

  if (error) {
    return <Error message={error} onRetry={loadData} />
  }

  const overdueTasks = tasks.filter(task => 
    task.dueDate && 
    isAfter(new Date(), new Date(task.dueDate)) && 
    task.status !== "Done"
  )

  const groupedTasks = groupTasksByStatus(filteredTasks)
  const statusOrder = ["To Do", "In Progress", "Review", "Done"]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Tasks</h1>
          <p className="text-gray-600">
            Track and manage all your assigned tasks
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant={overdueFilter ? "primary" : "ghost"}
            size="small"
            onClick={() => setOverdueFilter(!overdueFilter)}
          >
            <ApperIcon name="AlertTriangle" className="h-4 w-4 mr-2" />
            Overdue ({overdueTasks.length})
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <SearchBar
        onSearch={handleSearch}
        placeholder="Search tasks..."
        showFilters={true}
        filters={filters}
        onFilterChange={handleFilterChange}
      />

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="text-2xl font-bold text-gray-600">
            {tasks.filter(t => t.status === "To Do").length}
          </div>
          <div className="text-sm text-gray-500">To Do</div>
        </Card>
        <Card className="p-4">
          <div className="text-2xl font-bold text-info">
            {tasks.filter(t => t.status === "In Progress").length}
          </div>
          <div className="text-sm text-gray-500">In Progress</div>
        </Card>
        <Card className="p-4">
          <div className="text-2xl font-bold text-warning">
            {tasks.filter(t => t.status === "Review").length}
          </div>
          <div className="text-sm text-gray-500">Review</div>
        </Card>
        <Card className="p-4">
          <div className="text-2xl font-bold text-success">
            {tasks.filter(t => t.status === "Done").length}
          </div>
          <div className="text-sm text-gray-500">Done</div>
        </Card>
      </div>

      {/* Overdue Alert */}
      {overdueTasks.length > 0 && !overdueFilter && (
        <Card className="p-4 border-l-4 border-l-error bg-gradient-to-r from-error/5 to-transparent">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <ApperIcon name="AlertTriangle" className="h-5 w-5 text-error" />
              <div>
                <p className="font-medium text-gray-900">
                  You have {overdueTasks.length} overdue task{overdueTasks.length > 1 ? "s" : ""}
                </p>
                <p className="text-sm text-gray-600">These tasks need immediate attention</p>
              </div>
            </div>
            <Button
              variant="outline"
              size="small"
              onClick={() => setOverdueFilter(true)}
            >
              View Overdue
            </Button>
          </div>
        </Card>
      )}

      {/* Tasks */}
      {filteredTasks.length > 0 ? (
        <div className="space-y-8">
          {statusOrder.map(status => {
            const statusTasks = groupedTasks[status] || []
            if (statusTasks.length === 0) return null

            return (
              <div key={status}>
                <div className="flex items-center gap-3 mb-4">
                  <h2 className="text-lg font-semibold text-gray-900">{status}</h2>
                  <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                    {statusTasks.length}
                  </span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {statusTasks.map(task => {
                    const project = getProjectById(task.projectId)
                    const assignee = getUserById(task.assigneeId)
                    const isOverdue = task.dueDate && 
                      isAfter(new Date(), new Date(task.dueDate)) && 
                      task.status !== "Done"

                    return (
                      <Card
                        key={task.Id}
                        className="p-4 cursor-pointer hover:shadow-lg transition-all duration-200"
                        onClick={() => handleTaskClick(task)}
                      >
                        <div className="space-y-3">
                          <div className="flex items-start justify-between">
                            <h3 className="font-medium text-gray-900 line-clamp-2">
                              {task.title}
                            </h3>
                            <Button
                              variant="ghost"
                              size="small"
                              onClick={(e) => {
                                e.stopPropagation()
                                const statusFlow = {
                                  "To Do": "In Progress",
                                  "In Progress": "Review", 
                                  "Review": "Done",
                                  "Done": "To Do"
                                }
                                handleStatusChange(task.Id, statusFlow[task.status] || "To Do")
                              }}
                              className="opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <ApperIcon name="ArrowRight" className="h-4 w-4" />
                            </Button>
                          </div>

                          {task.description && (
                            <p className="text-sm text-gray-600 line-clamp-2">
                              {task.description}
                            </p>
                          )}

                          <div className="flex items-center gap-2">
                            <StatusBadge status={task.status} />
                            <PriorityBadge priority={task.priority} />
                          </div>

                          <div className="flex items-center justify-between text-sm text-gray-500">
                            <div className="flex items-center gap-2">
                              <ApperIcon name="FolderOpen" className="h-4 w-4" />
                              <span>{project?.title || "Unknown Project"}</span>
                            </div>
                            
                            {task.dueDate && (
                              <div className={`flex items-center gap-1 ${isOverdue ? 'text-error font-medium' : ''}`}>
                                <ApperIcon name="Calendar" className="h-4 w-4" />
                                <span>
                                  {format(new Date(task.dueDate), "MMM dd")}
                                </span>
                                {isOverdue && (
                                  <ApperIcon name="AlertCircle" className="h-3 w-3" />
                                )}
                              </div>
                            )}
                          </div>

                          {task.tags && task.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {task.tags.slice(0, 3).map(tag => (
                                <span
                                  key={tag}
                                  className="inline-block px-2 py-0.5 text-xs bg-gray-100 text-gray-600 rounded-full"
                                >
                                  {tag}
                                </span>
                              ))}
                              {task.tags.length > 3 && (
                                <span className="inline-block px-2 py-0.5 text-xs bg-gray-100 text-gray-600 rounded-full">
                                  +{task.tags.length - 3}
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      </Card>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <Empty
          title={searchQuery || statusFilter || priorityFilter || overdueFilter ? "No tasks found" : "No tasks assigned"}
          message={
            searchQuery || statusFilter || priorityFilter || overdueFilter
              ? "Try adjusting your search criteria or filters."
              : "You don't have any tasks assigned yet."
          }
          iconName="CheckSquare"
        />
      )}

      {/* Task Modal */}
      <TaskModal
        task={selectedTask}
        isOpen={showTaskModal}
        onClose={() => setShowTaskModal(false)}
        onUpdate={handleTaskUpdate}
      />
    </div>
  )
}

export default MyTasks