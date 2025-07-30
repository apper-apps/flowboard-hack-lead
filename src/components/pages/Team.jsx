import React, { useState, useEffect } from "react"
import Card from "@/components/atoms/Card"
import Avatar from "@/components/atoms/Avatar"
import Button from "@/components/atoms/Button"
import Badge from "@/components/atoms/Badge"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"
import Empty from "@/components/ui/Empty"
import ApperIcon from "@/components/ApperIcon"
import { userService } from "@/services/api/userService"
import { taskService } from "@/services/api/taskService"
import { projectService } from "@/services/api/projectService"

const Team = () => {
  const [users, setUsers] = useState([])
  const [tasks, setTasks] = useState([])
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    loadTeamData()
  }, [])

  const loadTeamData = async () => {
    try {
      setLoading(true)
      setError("")
      const [usersData, tasksData, projectsData] = await Promise.all([
        userService.getAll(),
        taskService.getAll(),
        projectService.getAll()
      ])
      setUsers(usersData)
      setTasks(tasksData)
      setProjects(projectsData)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const getUserTasks = (userId) => {
    return tasks.filter(task => task.assigneeId === userId.toString())
  }

  const getUserActiveTasks = (userId) => {
    return getUserTasks(userId).filter(task => task.status !== "Done")
  }

  const getUserCompletedTasks = (userId) => {
    return getUserTasks(userId).filter(task => task.status === "Done")
  }

  const getWorkloadColor = (activeTasks) => {
    if (activeTasks >= 8) return "error"
    if (activeTasks >= 5) return "warning"
    if (activeTasks >= 3) return "info"
    return "success"
  }

  const getWorkloadLabel = (activeTasks) => {
    if (activeTasks >= 8) return "Heavy"
    if (activeTasks >= 5) return "Moderate"
    if (activeTasks >= 3) return "Light"
    return "Available"
  }

  if (loading) {
    return <Loading type="cards" />
  }

  if (error) {
    return <Error message={error} onRetry={loadTeamData} />
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Team</h1>
          <p className="text-gray-600">
            Manage your team members and track their workload
          </p>
        </div>
        <Button>
          <ApperIcon name="UserPlus" className="h-4 w-4 mr-2" />
          Invite Member
        </Button>
      </div>

      {/* Team Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="text-2xl font-bold text-primary">{users.length}</div>
          <div className="text-sm text-gray-500">Team Members</div>
        </Card>
        
        <Card className="p-4">
          <div className="text-2xl font-bold text-success">
            {users.filter(user => getUserActiveTasks(user.Id).length < 3).length}
          </div>
          <div className="text-sm text-gray-500">Available</div>
        </Card>
        
        <Card className="p-4">
          <div className="text-2xl font-bold text-warning">
            {users.filter(user => {
              const activeTasks = getUserActiveTasks(user.Id).length
              return activeTasks >= 5 && activeTasks < 8
            }).length}
          </div>
          <div className="text-sm text-gray-500">Busy</div>
        </Card>
        
        <Card className="p-4">
          <div className="text-2xl font-bold text-error">
            {users.filter(user => getUserActiveTasks(user.Id).length >= 8).length}
          </div>
          <div className="text-sm text-gray-500">Overloaded</div>
        </Card>
      </div>

      {/* Team Members */}
      {users.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {users.map(user => {
            const userTasks = getUserTasks(user.Id)
            const activeTasks = getUserActiveTasks(user.Id)
            const completedTasks = getUserCompletedTasks(user.Id)
            const workloadColor = getWorkloadColor(activeTasks.length)
            const workloadLabel = getWorkloadLabel(activeTasks.length)

            return (
              <Card key={user.Id} className="p-6 hover:shadow-lg transition-all duration-200">
                <div className="flex items-start gap-4">
                  <Avatar
                    src={user.avatar}
                    name={user.name}
                    size="large"
                  />
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-gray-900 truncate">
                        {user.name}
                      </h3>
                      <Badge variant={workloadColor} size="small">
                        {workloadLabel}
                      </Badge>
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-3">{user.role}</p>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">Active Tasks</span>
                        <span className="font-medium text-gray-900">{activeTasks.length}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">Completed</span>
                        <span className="font-medium text-success">{completedTasks.length}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">Total Tasks</span>
                        <span className="font-medium text-gray-900">{userTasks.length}</span>
                      </div>
                    </div>

                    {/* Recent Tasks */}
                    {activeTasks.length > 0 && (
                      <div className="space-y-1">
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                          Recent Tasks
                        </p>
                        {activeTasks.slice(0, 2).map(task => (
                          <div key={task.Id} className="text-xs text-gray-600 truncate">
                            • {task.title}
                          </div>
                        ))}
                        {activeTasks.length > 2 && (
                          <div className="text-xs text-gray-500">
                            +{activeTasks.length - 2} more tasks
                          </div>
                        )}
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-2 mt-4">
                      <Button variant="ghost" size="small" className="flex-1">
                        <ApperIcon name="MessageCircle" className="h-4 w-4 mr-2" />
                        Message
                      </Button>
                      <Button variant="ghost" size="small" className="flex-1">
                        <ApperIcon name="UserCheck" className="h-4 w-4 mr-2" />
                        Assign
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            )
          })}
        </div>
      ) : (
        <Empty
          title="No team members"
          message="Start building your team by inviting members to collaborate on projects."
          actionLabel="Invite First Member"
          iconName="Users"
        />
      )}

      {/* Workload Distribution */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Workload Distribution</h2>
        
        <div className="space-y-4">
          {users.map(user => {
            const activeTasks = getUserActiveTasks(user.Id).length
            const maxTasks = Math.max(...users.map(u => getUserActiveTasks(u.Id).length), 10)
            const percentage = maxTasks > 0 ? (activeTasks / maxTasks) * 100 : 0
            const workloadColor = getWorkloadColor(activeTasks)

            return (
              <div key={user.Id} className="flex items-center gap-4">
                <div className="flex items-center gap-3 w-48">
                  <Avatar
                    src={user.avatar}
                    name={user.name}
                    size="small"
                  />
                  <span className="font-medium text-gray-900 truncate">
                    {user.name}
                  </span>
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <Badge variant={workloadColor} size="small">
                        {getWorkloadLabel(activeTasks)}
                      </Badge>
                    </div>
                    <span className="text-sm font-medium text-gray-900">
                      {activeTasks} tasks
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${
                        workloadColor === "error" ? "bg-error" :
                        workloadColor === "warning" ? "bg-warning" :
                        workloadColor === "info" ? "bg-info" : "bg-success"
                      }`}
                      style={{ width: `${Math.min(percentage, 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </Card>
    </div>
  )
}

export default Team