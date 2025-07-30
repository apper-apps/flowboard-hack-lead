import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { userService } from "@/services/api/userService";
import { taskService } from "@/services/api/taskService";
import ApperIcon from "@/components/ApperIcon";
import TaskCard from "@/components/organisms/TaskCard";
import Button from "@/components/atoms/Button";

const KanbanBoard = ({ projectId, onTaskClick, onNewTask, onTaskStatusChange }) => {
  const [tasks, setTasks] = useState([])
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [draggedTask, setDraggedTask] = useState(null)
  const [dragOverColumn, setDragOverColumn] = useState(null)

  const columns = [
    { id: "To Do", title: "To Do", color: "gray" },
    { id: "In Progress", title: "In Progress", color: "blue" },
    { id: "Review", title: "Review", color: "yellow" },
    { id: "Done", title: "Done", color: "green" }
  ]

  useEffect(() => {
    loadData()
  }, [projectId])

const loadData = async () => {
    try {
      setLoading(true)
      setError("")
      const usersData = await userService.getAll()
      
      if (projectId) {
        const tasksData = await taskService.getByProject(projectId)
        setTasks(tasksData)
      }
      
      setUsers(usersData)
    } catch (err) {
      setError(err.message)
      toast.error("Failed to load tasks")
    } finally {
      setLoading(false)
    }
  }

const handleStatusChange = async (taskId, newStatus) => {
    try {
      await taskService.updateStatus(taskId, newStatus)
      const updatedTasks = tasks.map(task => 
        task.Id === taskId ? { ...task, status: newStatus } : task
      )
      setTasks(updatedTasks)
      
      // Notify parent component of the status change
      if (onTaskStatusChange) {
        const updatedTask = updatedTasks.find(task => task.Id === taskId)
        onTaskStatusChange(updatedTask)
      }
      
      toast.success("Task status updated")
    } catch (err) {
      toast.error("Failed to update task status")
    }
  }

  const handleDragStart = (e, task) => {
    setDraggedTask(task)
    e.dataTransfer.effectAllowed = "move"
  }

  const handleDragOver = (e, columnId) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
    setDragOverColumn(columnId)
  }

  const handleDragLeave = () => {
    setDragOverColumn(null)
  }

  const handleDrop = (e, columnId) => {
    e.preventDefault()
    setDragOverColumn(null)
    
    if (draggedTask && draggedTask.status !== columnId) {
      handleStatusChange(draggedTask.Id, columnId)
    }
    setDraggedTask(null)
  }

  const getTasksByStatus = (status) => {
    return tasks.filter(task => task.status === status)
  }

  const getUserById = (userId) => {
    return users.find(user => user.Id === parseInt(userId))
  }

  if (loading) {
    return (
      <div className="flex gap-6 h-[600px]">
        {columns.map((column) => (
          <div key={column.id} className="flex-1 bg-gray-50 rounded-lg p-4 animate-pulse">
            <div className="h-6 bg-gray-200 rounded mb-4"></div>
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <ApperIcon name="AlertCircle" className="h-12 w-12 text-error mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Failed to load tasks</h3>
        <p className="text-gray-500 mb-4">{error}</p>
        <Button onClick={loadData}>
          <ApperIcon name="RefreshCw" className="h-4 w-4 mr-2" />
          Try Again
        </Button>
      </div>
    )
  }

  return (
    <div className="flex gap-6 h-[calc(100vh-200px)] overflow-hidden">
      {columns.map((column) => {
        const columnTasks = getTasksByStatus(column.id)
        const isDropTarget = dragOverColumn === column.id

        return (
          <div
            key={column.id}
            className={`flex-1 bg-gray-50 rounded-xl p-4 transition-all duration-200 ${
              isDropTarget ? 'bg-primary/5 border-primary/30 border-dashed border-2' : ''
            }`}
            onDragOver={(e) => handleDragOver(e, column.id)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, column.id)}
          >
            {/* Column Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-gray-900">{column.title}</h3>
                <span className="text-sm text-gray-500 bg-white px-2 py-0.5 rounded-full">
                  {columnTasks.length}
                </span>
              </div>
              
              {column.id === "To Do" && (
                <Button
                  variant="ghost"
                  size="small"
                  onClick={onNewTask}
                >
                  <ApperIcon name="Plus" className="h-4 w-4" />
                </Button>
              )}
            </div>

            {/* Tasks */}
            <div className="space-y-3 overflow-y-auto max-h-full custom-scrollbar">
              {columnTasks.map((task) => (
                <div
                  key={task.Id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, task)}
                  className={draggedTask?.Id === task.Id ? 'opacity-50' : ''}
                >
                  <TaskCard
                    task={task}
                    assignee={getUserById(task.assigneeId)}
                    onStatusChange={handleStatusChange}
                    onClick={onTaskClick}
                    isDragging={draggedTask?.Id === task.Id}
                  />
                </div>
              ))}
              
              {columnTasks.length === 0 && (
                <div className="text-center py-8 text-gray-400">
                  <ApperIcon name="Plus" className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">
                    {column.id === "To Do" ? "Add your first task" : `No ${column.title.toLowerCase()} tasks`}
                  </p>
                </div>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default KanbanBoard