import React from "react"
import { useNavigate } from "react-router-dom"
import { format, isAfter } from "date-fns"
import Card from "@/components/atoms/Card"
import Button from "@/components/atoms/Button"
import StatusBadge from "@/components/molecules/StatusBadge"
import ProgressRing from "@/components/molecules/ProgressRing"
import ApperIcon from "@/components/ApperIcon"

const ProjectCard = ({ project, onEdit, onDelete }) => {
  const navigate = useNavigate()
  
  const deadline = new Date(project.deadline)
  const isOverdue = isAfter(new Date(), deadline) && project.status !== "Completed"
  
  const handleCardClick = () => {
    navigate(`/projects/${project.Id}`)
  }

  return (
    <Card hover className="p-6 cursor-pointer group" onClick={handleCardClick}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-primary transition-colors">
            {project.title}
          </h3>
          <p className="text-gray-600 text-sm line-clamp-2 mb-3">
            {project.description}
          </p>
          <StatusBadge status={project.status} type="project" />
        </div>
        
        <div className="flex items-center gap-2 ml-4">
          <Button
            variant="ghost"
            size="small"
            onClick={(e) => {
              e.stopPropagation()
              onEdit?.(project)
            }}
            className="opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <ApperIcon name="Edit" className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="small"
            onClick={(e) => {
              e.stopPropagation()
              onDelete?.(project)
            }}
            className="opacity-0 group-hover:opacity-100 transition-opacity text-error hover:text-error"
          >
            <ApperIcon name="Trash2" className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <ProgressRing 
            percentage={project.completionPercentage} 
            size={48} 
            strokeWidth={3}
          />
          
          <div>
            <div className="flex items-center gap-2 mb-1">
              <ApperIcon name="Calendar" className="h-4 w-4 text-gray-400" />
              <span className={`text-sm ${isOverdue ? 'text-error font-medium' : 'text-gray-600'}`}>
                {format(deadline, "MMM dd, yyyy")}
              </span>
              {isOverdue && (
                <span className="text-xs text-error font-medium bg-error/10 px-2 py-0.5 rounded-full">
                  Overdue
                </span>
              )}
            </div>
            <p className="text-xs text-gray-500">
              Updated {format(new Date(project.updatedAt), "MMM dd")}
            </p>
          </div>
        </div>

        <div className="text-right">
          <div className="text-2xl font-bold text-primary mb-1">
            {project.completionPercentage}%
          </div>
          <div className="text-xs text-gray-500">
            Complete
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-4 pt-4 border-t border-gray-100 opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="small"
            onClick={(e) => {
              e.stopPropagation()
              navigate(`/projects/${project.Id}`)
            }}
            className="flex-1"
          >
            <ApperIcon name="Eye" className="h-4 w-4 mr-2" />
            View
          </Button>
          <Button
            variant="ghost"
            size="small"
            onClick={(e) => {
              e.stopPropagation()
              navigate(`/projects/${project.Id}?view=tasks`)
            }}
            className="flex-1"
          >
            <ApperIcon name="CheckSquare" className="h-4 w-4 mr-2" />
            Tasks
          </Button>
        </div>
      </div>
    </Card>
  )
}

export default ProjectCard