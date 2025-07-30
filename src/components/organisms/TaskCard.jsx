import React from "react"
import { format, isAfter } from "date-fns"
import Card from "@/components/atoms/Card"
import Avatar from "@/components/atoms/Avatar"
import StatusBadge from "@/components/molecules/StatusBadge"
import PriorityBadge from "@/components/molecules/PriorityBadge"
import ApperIcon from "@/components/ApperIcon"

const TaskCard = ({ 
  task, 
  assignee, 
  onStatusChange, 
  onClick,
  isDragging = false 
}) => {
  const dueDate = task.dueDate ? new Date(task.dueDate) : null
  const isOverdue = dueDate && isAfter(new Date(), dueDate) && task.status !== "Done"

  const handleStatusClick = (e) => {
    e.stopPropagation()
    const statusFlow = {
      "To Do": "In Progress",
      "In Progress": "Review", 
      "Review": "Done",
      "Done": "To Do"
    }
    onStatusChange?.(task.Id, statusFlow[task.status] || "To Do")
  }

  return (
    <Card 
      className={`p-4 cursor-pointer group transition-all duration-200 ${
        isDragging ? 'rotate-2 scale-105 shadow-2xl z-50' : 'hover:shadow-lg'
      }`}
      onClick={() => onClick?.(task)}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h4 className="font-medium text-gray-900 mb-2 line-clamp-2 group-hover:text-primary transition-colors">
            {task.title}
          </h4>
          <div className="flex items-center gap-2 mb-2">
            <PriorityBadge priority={task.priority} />
            <StatusBadge status={task.status} />
          </div>
        </div>
        
        {assignee && (
          <Avatar
            src={assignee.avatar}
            name={assignee.name}
            size="small"
            className="ml-2"
          />
        )}
      </div>

      {/* Description */}
      {task.description && (
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
          {task.description}
        </p>
      )}

      {/* Tags */}
      {task.tags && task.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {task.tags.slice(0, 3).map((tag) => (
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

      {/* Footer */}
      <div className="flex items-center justify-between">
        {dueDate && (
          <div className="flex items-center gap-1">
            <ApperIcon name="Calendar" className="h-3 w-3 text-gray-400" />
            <span className={`text-xs ${isOverdue ? 'text-error font-medium' : 'text-gray-500'}`}>
              {format(dueDate, "MMM dd")}
            </span>
            {isOverdue && (
              <ApperIcon name="AlertCircle" className="h-3 w-3 text-error" />
            )}
          </div>
        )}

        <button
          onClick={handleStatusClick}
          className="opacity-0 group-hover:opacity-100 transition-opacity text-primary hover:text-primary/80"
        >
          <ApperIcon name="ArrowRight" className="h-4 w-4" />
        </button>
      </div>
    </Card>
  )
}

export default TaskCard