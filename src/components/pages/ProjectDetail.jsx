import React, { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { format } from "date-fns"
import { toast } from "react-toastify"
import Button from "@/components/atoms/Button"
import Card from "@/components/atoms/Card"
import StatusBadge from "@/components/molecules/StatusBadge"
import ProgressRing from "@/components/molecules/ProgressRing"
import KanbanBoard from "@/components/organisms/KanbanBoard"
import TaskModal from "@/components/organisms/TaskModal"
import TaskFormModal from "@/components/organisms/TaskFormModal"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"
import ApperIcon from "@/components/ApperIcon"
import { projectService } from "@/services/api/projectService"
import { taskService } from "@/services/api/taskService"

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
          />
        )}
        
        {activeView === "list" && (
          <Card className="p-6">
            <div className="text-center py-12 text-gray-400">
              <ApperIcon name="List" className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>List view coming soon!</p>
              <p className="text-sm mt-1">Use Kanban view for now</p>
            </div>
          </Card>
        )}
        
        {activeView === "calendar" && (
          <Card className="p-6">
            <div className="text-center py-12 text-gray-400">
              <ApperIcon name="Calendar" className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Calendar view coming soon!</p>
              <p className="text-sm mt-1">Use Kanban view for now</p>
            </div>
          </Card>
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