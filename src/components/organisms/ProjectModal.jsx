import React, { useState, useEffect } from "react"
import { toast } from "react-toastify"
import Button from "@/components/atoms/Button"
import Input from "@/components/atoms/Input"
import FormField from "@/components/molecules/FormField"
import ApperIcon from "@/components/ApperIcon"
import FileUpload from "@/components/atoms/FileUpload"
import { projectService } from "@/services/api/projectService"
const ProjectModal = ({ project, isOpen, onClose, onSave }) => {
const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "Planning",
    deadline: ""
  })
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const [attachments, setAttachments] = useState([])
useEffect(() => {
    if (project) {
      setFormData({
        title: project.title || "",
        description: project.description || "",
        status: project.status || "Planning",
        deadline: project.deadline ? project.deadline.split('T')[0] : ""
      })
      setAttachments(project.attachments || [])
    } else {
      setFormData({
        title: "",
        description: "",
        status: "Planning",
        deadline: ""
      })
      setAttachments([])
    }
    setErrors({})
  }, [project, isOpen])
  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.title.trim()) {
      newErrors.title = "Title is required"
    }
    
    if (!formData.description.trim()) {
      newErrors.description = "Description is required"
    }
    
    if (!formData.deadline) {
      newErrors.deadline = "Deadline is required"
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
      
      const projectData = {
        ...formData,
        deadline: new Date(formData.deadline).toISOString(),
        attachments: attachments
      }

      let savedProject
      if (project) {
        savedProject = await projectService.update(project.Id, projectData)
        toast.success("Project updated successfully")
      } else {
        savedProject = await projectService.create(projectData)
        toast.success("Project created successfully")
      }

      onSave?.(savedProject)
      onClose()
    } catch (err) {
      toast.error(project ? "Failed to update project" : "Failed to create project")
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] flex flex-col animate-scale-in">
        {/* Header */}
        <div className="flex-shrink-0 px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white rounded-t-2xl">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">
              {project ? "Edit Project" : "Create New Project"}
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

        {/* Form Content - Scrollable */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          <form id="project-form" onSubmit={handleSubmit}>
            <div className="p-6 space-y-4">
              <FormField
                label="Project Title"
                required
                error={errors.title}
              >
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Enter project title"
                  error={errors.title}
                />
              </FormField>

              <FormField
                label="Description"
                required
                error={errors.description}
              >
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe your project"
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-1 transition-all duration-200 bg-white resize-none ${
                    errors.description 
                      ? "border-error focus:ring-error/20 focus:border-error" 
                      : "border-gray-200 focus:ring-primary/20 focus:border-primary"
                  }`}
                  rows={4}
                />
              </FormField>

              <FormField
                label="Status"
              >
                <select
                  value={formData.status}
                  onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 bg-white"
                >
                  <option value="Planning">Planning</option>
                  <option value="Active">Active</option>
                  <option value="On Hold">On Hold</option>
                  <option value="Completed">Completed</option>
                </select>
              </FormField>

              <FormField
                label="Deadline"
                required
                error={errors.deadline}
              >
                <Input
                  type="date"
                  value={formData.deadline}
                  onChange={(e) => setFormData(prev => ({ ...prev, deadline: e.target.value }))}
                  error={errors.deadline}
                />
              </FormField>

              {/* File Attachments */}
              <FormField
                label="Project Files"
                error={errors.attachments}
                className="col-span-2"
              >
                <FileUpload
                  files={attachments}
                  onFilesChange={setAttachments}
                  maxFiles={15}
                  maxSize={50 * 1024 * 1024} // 50MB for projects
                  acceptedTypes={['.pdf', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx', '.txt', '.jpg', '.jpeg', '.png', '.gif', '.zip', '.rar', '.7z']}
                />
              </FormField>
            </div>
          </form>
        </div>

        {/* Actions - Fixed at bottom */}
        <div className="flex-shrink-0 px-6 py-4 border-t border-gray-200 bg-gradient-to-r from-gray-50 to-white rounded-b-2xl">
          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
              className="min-w-[80px]"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              form="project-form"
              disabled={loading}
              className="min-w-[120px]"
            >
              {loading && <ApperIcon name="Loader2" className="h-4 w-4 mr-2 animate-spin" />}
              {project ? "Update Project" : "Create Project"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProjectModal