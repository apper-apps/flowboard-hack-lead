import React, { useState, useEffect } from "react"
import { toast } from "react-toastify"
import Button from "@/components/atoms/Button"
import Input from "@/components/atoms/Input"
import FormField from "@/components/molecules/FormField"
import ApperIcon from "@/components/ApperIcon"
import { taskService } from "@/services/api/taskService"
import { userService } from "@/services/api/userService"

const TaskFormModal = ({ projectId, task, isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "To Do",
    priority: "Medium",
    dueDate: "",
    assigneeId: "",
    tags: []
  })
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (isOpen) {
      loadUsers()
      if (task) {
        setFormData({
          title: task.title || "",
          description: task.description || "",
          status: task.status || "To Do",
          priority: task.priority || "Medium",
          dueDate: task.dueDate ? task.dueDate.split('T')[0] : "",
          assigneeId: task.assigneeId || "",
          tags: task.tags || []
        })
      } else {
        setFormData({
          title: "",
          description: "",
          status: "To Do",
          priority: "Medium",
          dueDate: "",
          assigneeId: "",
          tags: []
        })
      }
      setErrors({})
    }
  }, [task, isOpen])

  const loadUsers = async () => {
    try {
      const usersData = await userService.getAll()
      setUsers(usersData)
    } catch (err) {
      console.error("Failed to load users:", err)
    }
  }

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.title.trim()) {
      newErrors.title = "Title is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    try {
      setLoading(true)
      
      const taskData = {
        ...formData,
        projectId: parseInt(projectId),
        dueDate: formData.dueDate ? new Date(formData.dueDate).toISOString() : null
      }

      let savedTask
      if (task) {
        savedTask = await taskService.update(task.Id, taskData)
        toast.success("Task updated successfully")
      } else {
        savedTask = await taskService.create(taskData)
        toast.success("Task created successfully")
      }

      onSave?.(savedTask)
      onClose()
    } catch (err) {
      toast.error(task ? "Failed to update task" : "Failed to create task")
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-hidden animate-scale-in">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">
              {task ? "Edit Task" : "Create New Task"}
            </h2>
            <Button
              variant="ghost"
              size="small"
              onClick={onClose}
            >
              <ApperIcon name="X" className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Form */}
        <div className="overflow-y-auto max-h-[calc(90vh-120px)] custom-scrollbar">
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <FormField
              label="Task Title"
              required
              error={errors.title}
            >
              <Input
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Enter task title"
                error={errors.title}
              />
            </FormField>

            <FormField label="Description">
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe the task"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 bg-white"
                rows={3}
              />
            </FormField>

            <div className="grid grid-cols-2 gap-4">
              <FormField label="Status">
                <select
                  value={formData.status}
                  onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 bg-white"
                >
                  <option value="To Do">To Do</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Review">Review</option>
                  <option value="Done">Done</option>
                </select>
              </FormField>

              <FormField label="Priority">
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 bg-white"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                  <option value="Critical">Critical</option>
                </select>
              </FormField>
            </div>

            <FormField label="Due Date">
              <Input
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData(prev => ({ ...prev, dueDate: e.target.value }))}
              />
            </FormField>

            <FormField label="Assignee">
              <select
                value={formData.assigneeId}
                onChange={(e) => setFormData(prev => ({ ...prev, assigneeId: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 bg-white"
              >
                <option value="">Unassigned</option>
                {users.map(user => (
                  <option key={user.Id} value={user.Id}>{user.name}</option>
                ))}
              </select>
            </FormField>

            <FormField label="Tags">
              <Input
                value={formData.tags.join(", ")}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  tags: e.target.value.split(",").map(tag => tag.trim()).filter(Boolean)
                }))}
                placeholder="Enter tags separated by commas"
              />
            </FormField>

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="secondary"
                onClick={onClose}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading}
              >
                {loading && <ApperIcon name="Loader2" className="h-4 w-4 mr-2 animate-spin" />}
                {task ? "Update Task" : "Create Task"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default TaskFormModal