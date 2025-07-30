import React, { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { format, isAfter, subDays } from "date-fns"
import Card from "@/components/atoms/Card"
import Button from "@/components/atoms/Button"
import Avatar from "@/components/atoms/Avatar"
import StatusBadge from "@/components/molecules/StatusBadge"
import PriorityBadge from "@/components/molecules/PriorityBadge"
import ProgressRing from "@/components/molecules/ProgressRing"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"
import ApperIcon from "@/components/ApperIcon"
import { projectService } from "@/services/api/projectService"
import { taskService } from "@/services/api/taskService"
import { userService } from "@/services/api/userService"

const Dashboard = () => {
  const navigate = useNavigate()
  const [projects, setProjects] = useState([])
  const [tasks, setTasks] = useState([])
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      setError("")
      const [projectsData, tasksData, usersData] = await Promise.all([
        projectService.getAll(),
        taskService.getAll(),
        userService.getAll()
      ])
      setProjects(projectsData)
      setTasks(tasksData)
      setUsers(usersData)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const getUserById = (userId) => {
    return users.find(user => user.Id === parseInt(userId))
  }

  // Calculate statistics
  const activeProjects = projects.filter(p => p.status === "Active").length
  const completedProjects = projects.filter(p => p.status === "Completed").length
  const totalTasks = tasks.length
  const completedTasks = tasks.filter(t => t.status === "Done").length
  const myTasks = tasks.filter(t => t.assigneeId === "1") // Current user
  const overdueTasks = tasks.filter(t => 
    t.dueDate && isAfter(new Date(), new Date(t.dueDate)) && t.status !== "Done"
  )
  const recentActivity = tasks
    .filter(t => new Date(t.updatedAt) > subDays(new Date(), 7))
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
    .slice(0, 5)

  if (loading) {
    return <Loading type="cards" />
  }

  if (error) {
    return <Error message={error} onRetry={loadDashboardData} />
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back, Alex! 👋</h1>
          <p className="text-gray-600">Here's what's happening with your projects today.</p>
        </div>
        <Button onClick={() => navigate("/projects")}>
          <ApperIcon name="Plus" className="h-4 w-4 mr-2" />
          New Project
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6 card-hover">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Active Projects</p>
              <p className="text-3xl font-bold text-gray-900">{activeProjects}</p>
              <p className="text-xs text-gray-500 mt-1">of {projects.length} total</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-primary to-primary/80 rounded-lg flex items-center justify-center">
              <ApperIcon name="FolderOpen" className="h-6 w-6 text-white" />
            </div>
          </div>
        </Card>

        <Card className="p-6 card-hover">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">My Tasks</p>
              <p className="text-3xl font-bold text-gray-900">{myTasks.length}</p>
              <p className="text-xs text-gray-500 mt-1">{myTasks.filter(t => t.status === "Done").length} completed</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-secondary to-secondary/80 rounded-lg flex items-center justify-center">
              <ApperIcon name="CheckSquare" className="h-6 w-6 text-white" />
            </div>
          </div>
        </Card>

        <Card className="p-6 card-hover">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Completion Rate</p>
              <p className="text-3xl font-bold text-gray-900">
                {totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0}%
              </p>
              <p className="text-xs text-gray-500 mt-1">{completedTasks} of {totalTasks} tasks</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-success to-success/80 rounded-lg flex items-center justify-center">
              <ApperIcon name="TrendingUp" className="h-6 w-6 text-white" />
            </div>
          </div>
        </Card>

        <Card className="p-6 card-hover">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Overdue Tasks</p>
              <p className="text-3xl font-bold text-error">{overdueTasks.length}</p>
              <p className="text-xs text-gray-500 mt-1">Need attention</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-error to-error/80 rounded-lg flex items-center justify-center">
              <ApperIcon name="AlertTriangle" className="h-6 w-6 text-white" />
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Projects */}
        <div className="lg:col-span-2">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Active Projects</h2>
              <Button variant="ghost" size="small" onClick={() => navigate("/projects")}>
                View All
                <ApperIcon name="ArrowRight" className="h-4 w-4 ml-2" />
              </Button>
            </div>
            
            <div className="space-y-4">
              {projects
                .filter(p => p.status === "Active")
                .slice(0, 4)
                .map(project => (
                  <div
                    key={project.Id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                    onClick={() => navigate(`/projects/${project.Id}`)}
                  >
                    <div className="flex items-center gap-4">
                      <ProgressRing percentage={project.completionPercentage} size={40} strokeWidth={3} />
                      <div>
                        <h3 className="font-medium text-gray-900">{project.title}</h3>
                        <p className="text-sm text-gray-500 line-clamp-1">{project.description}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <StatusBadge status={project.status} type="project" />
                      <p className="text-xs text-gray-500 mt-1">
                        Due {format(new Date(project.deadline), "MMM dd")}
                      </p>
                    </div>
                  </div>
                ))}
              
              {projects.filter(p => p.status === "Active").length === 0 && (
                <div className="text-center py-8 text-gray-400">
                  <ApperIcon name="FolderOpen" className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No active projects</p>
                  <Button
                    variant="ghost"
                    size="small"
                    onClick={() => navigate("/projects")}
                    className="mt-2"
                  >
                    Create your first project
                  </Button>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Recent Activity */}
        <div>
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
              <Button variant="ghost" size="small" onClick={() => navigate("/my-tasks")}>
                View All
                <ApperIcon name="ArrowRight" className="h-4 w-4 ml-2" />
              </Button>
            </div>
            
            <div className="space-y-4">
              {recentActivity.map(task => {
                const assignee = getUserById(task.assigneeId)
                return (
                  <div key={task.Id} className="flex gap-3">
                    <Avatar
                      src={assignee?.avatar}
                      name={assignee?.name}
                      size="small"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-900 font-medium line-clamp-1">
                        {task.title}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <StatusBadge status={task.status} />
                        <PriorityBadge priority={task.priority} />
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Updated {format(new Date(task.updatedAt), "MMM dd, h:mm a")}
                      </p>
                    </div>
                  </div>
                )
              })}
              
              {recentActivity.length === 0 && (
                <div className="text-center py-8 text-gray-400">
                  <ApperIcon name="Activity" className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No recent activity</p>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>

      {/* Overdue Tasks Alert */}
      {overdueTasks.length > 0 && (
        <Card className="p-6 border-l-4 border-l-error bg-gradient-to-r from-error/5 to-transparent">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-error/10 rounded-lg flex items-center justify-center">
              <ApperIcon name="AlertTriangle" className="h-5 w-5 text-error" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 mb-2">
                You have {overdueTasks.length} overdue task{overdueTasks.length > 1 ? "s" : ""}
              </h3>
              <p className="text-gray-600 mb-4">
                These tasks are past their due date and need immediate attention.
              </p>
              <Button
                variant="outline"
                size="small"
                onClick={() => navigate("/my-tasks?filter=overdue")}
              >
                Review Overdue Tasks
                <ApperIcon name="ArrowRight" className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </div>
        </Card>
      )}
    </div>
  )
}

export default Dashboard