import React, { useState, useEffect } from "react"
import { format } from "date-fns"
import { toast } from "react-toastify"
import Button from "@/components/atoms/Button"
import Input from "@/components/atoms/Input"
import FormField from "@/components/molecules/FormField"
import StatusBadge from "@/components/molecules/StatusBadge"
import PriorityBadge from "@/components/molecules/PriorityBadge"
import Avatar from "@/components/atoms/Avatar"
import ApperIcon from "@/components/ApperIcon"
import { taskService } from "@/services/api/taskService"
import { commentService } from "@/services/api/commentService"
import { userService } from "@/services/api/userService"

const TaskModal = ({ task, isOpen, onClose, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({})
  const [comments, setComments] = useState([])
  const [newComment, setNewComment] = useState("")
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(false)
  const [currentUser] = useState({ Id: 1, name: "Alex Johnson" }) // Mock current user

  useEffect(() => {
    if (task && isOpen) {
      setFormData(task)
      loadComments()
      loadUsers()
    }
  }, [task, isOpen])

  const loadComments = async () => {
    try {
      const commentsData = await commentService.getByTask(task.Id)
      setComments(commentsData)
    } catch (err) {
      console.error("Failed to load comments:", err)
    }
  }

  const loadUsers = async () => {
    try {
      const usersData = await userService.getAll()
      setUsers(usersData)
    } catch (err) {
      console.error("Failed to load users:", err)
    }
  }

  const getUserById = (userId) => {
    return users.find(user => user.Id === parseInt(userId))
  }

  const handleSave = async () => {
    try {
      setLoading(true)
      const updatedTask = await taskService.update(task.Id, formData)
      onUpdate?.(updatedTask)
      setIsEditing(false)
      toast.success("Task updated successfully")
    } catch (err) {
      toast.error("Failed to update task")
    } finally {
      setLoading(false)
    }
  }

  const handleAddComment = async (e) => {
    e.preventDefault()
    if (!newComment.trim()) return

    try {
      const comment = await commentService.create({
        taskId: task.Id,
        userId: currentUser.Id.toString(),
        content: newComment.trim()
      })
      setComments(prev => [...prev, comment])
      setNewComment("")
      toast.success("Comment added")
    } catch (err) {
      toast.error("Failed to add comment")
    }
  }

  const handleStatusChange = async (newStatus) => {
    try {
      const updatedTask = await taskService.updateStatus(task.Id, newStatus)
      onUpdate?.(updatedTask)
      setFormData(prev => ({ ...prev, status: newStatus }))
      toast.success("Status updated")
    } catch (err) {
      toast.error("Failed to update status")
    }
  }

  if (!isOpen || !task) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden animate-scale-in">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-semibold text-gray-900">Task Details</h2>
              <StatusBadge status={formData.status} />
              <PriorityBadge priority={formData.priority} />
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="small"
                onClick={() => setIsEditing(!isEditing)}
              >
                <ApperIcon name="Edit" className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="small"
                onClick={onClose}
              >
                <ApperIcon name="X" className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-120px)] custom-scrollbar">
          <div className="p-6 space-y-6">
            {/* Task Info */}
            <div className="space-y-4">
              {isEditing ? (
                <>
                  <FormField label="Title" required>
                    <Input
                      value={formData.title || ""}
                      onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    />
                  </FormField>
                  
                  <FormField label="Description">
                    <textarea
                      value={formData.description || ""}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 bg-white"
                      rows={4}
                    />
                  </FormField>

                  <div className="grid grid-cols-2 gap-4">
                    <FormField label="Status">
                      <select
                        value={formData.status || ""}
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
                        value={formData.priority || ""}
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

                  <div className="grid grid-cols-2 gap-4">
                    <FormField label="Due Date">
                      <Input
                        type="date"
                        value={formData.dueDate ? formData.dueDate.split('T')[0] : ""}
                        onChange={(e) => setFormData(prev => ({ 
                          ...prev, 
                          dueDate: e.target.value ? new Date(e.target.value).toISOString() : null 
                        }))}
                      />
                    </FormField>

                    <FormField label="Assignee">
                      <select
                        value={formData.assigneeId || ""}
                        onChange={(e) => setFormData(prev => ({ ...prev, assigneeId: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 bg-white"
                      >
                        <option value="">Unassigned</option>
                        {users.map(user => (
                          <option key={user.Id} value={user.Id}>{user.name}</option>
                        ))}
                      </select>
                    </FormField>
                  </div>

                  <FormField label="Tags">
                    <Input
                      value={formData.tags?.join(", ") || ""}
                      onChange={(e) => setFormData(prev => ({ 
                        ...prev, 
                        tags: e.target.value.split(",").map(tag => tag.trim()).filter(Boolean)
                      }))}
                      placeholder="Enter tags separated by commas"
                    />
                  </FormField>
                </>
              ) : (
                <>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">{task.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{task.description}</p>
                  </div>

                  <div className="flex flex-wrap gap-4">
                    <div className="flex items-center gap-2">
                      <ApperIcon name="Calendar" className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-600">
                        {task.dueDate ? format(new Date(task.dueDate), "MMM dd, yyyy") : "No due date"}
                      </span>
                    </div>
                    
                    {task.assigneeId && (
                      <div className="flex items-center gap-2">
                        <ApperIcon name="User" className="h-4 w-4 text-gray-400" />
                        <Avatar
                          src={getUserById(task.assigneeId)?.avatar}
                          name={getUserById(task.assigneeId)?.name}
                          size="small"
                        />
                        <span className="text-sm text-gray-600">
                          {getUserById(task.assigneeId)?.name}
                        </span>
                      </div>
                    )}
                  </div>

                  {task.tags && task.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {task.tags.map(tag => (
                        <span
                          key={tag}
                          className="inline-block px-3 py-1 text-xs bg-primary/10 text-primary rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Quick Status Actions */}
                  <div className="flex gap-2 pt-2">
                    {["To Do", "In Progress", "Review", "Done"].map(status => (
                      <Button
                        key={status}
                        variant={formData.status === status ? "primary" : "ghost"}
                        size="small"
                        onClick={() => handleStatusChange(status)}
                        disabled={formData.status === status}
                      >
                        {status}
                      </Button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Comments Section */}
            <div className="border-t border-gray-200 pt-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">
                Comments ({comments.length})
              </h4>

              {/* Add Comment */}
              <form onSubmit={handleAddComment} className="mb-6">
                <div className="flex gap-3">
                  <Avatar
                    name={currentUser.name}
                    size="small"
                  />
                  <div className="flex-1">
                    <Input
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Add a comment..."
                      className="mb-2"
                    />
                    <Button type="submit" size="small" disabled={!newComment.trim()}>
                      <ApperIcon name="Send" className="h-4 w-4 mr-2" />
                      Comment
                    </Button>
                  </div>
                </div>
              </form>

              {/* Comments List */}
              <div className="space-y-4">
                {comments.map(comment => {
                  const author = getUserById(comment.userId)
                  return (
                    <div key={comment.Id} className="flex gap-3">
                      <Avatar
                        src={author?.avatar}
                        name={author?.name}
                        size="small"
                      />
                      <div className="flex-1">
                        <div className="bg-gray-50 rounded-lg p-3">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-sm text-gray-900">
                              {author?.name || "Unknown User"}
                            </span>
                            <span className="text-xs text-gray-500">
                              {format(new Date(comment.createdAt), "MMM dd, h:mm a")}
                            </span>
                          </div>
                          <p className="text-sm text-gray-700">{comment.content}</p>
                        </div>
                      </div>
                    </div>
                  )
                })}
                
                {comments.length === 0 && (
                  <div className="text-center py-8 text-gray-400">
                    <ApperIcon name="MessageCircle" className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No comments yet. Start the conversation!</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        {isEditing && (
          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-end gap-3">
            <Button
              variant="secondary"
              onClick={() => {
                setIsEditing(false)
                setFormData(task)
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={loading}
            >
              {loading && <ApperIcon name="Loader2" className="h-4 w-4 mr-2 animate-spin" />}
              Save Changes
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

export default TaskModal