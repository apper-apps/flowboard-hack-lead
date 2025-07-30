import React from "react"
import Badge from "@/components/atoms/Badge"
import ApperIcon from "@/components/ApperIcon"

const PriorityBadge = ({ priority, showIcon = true }) => {
  const priorityConfig = {
    Low: {
      variant: "default",
      icon: "ArrowDown",
      color: "text-gray-500"
    },
    Medium: {
      variant: "info",
      icon: "Minus",
      color: "text-info"
    },
    High: {
      variant: "warning",
      icon: "ArrowUp",
      color: "text-warning"
    },
    Critical: {
      variant: "error",
      icon: "AlertTriangle",
      color: "text-error"
    }
  }

  const config = priorityConfig[priority] || priorityConfig.Low

  return (
    <Badge variant={config.variant} size="small">
      {showIcon && (
        <ApperIcon 
          name={config.icon} 
          className={`h-3 w-3 mr-1 ${config.color}`} 
        />
      )}
      {priority}
    </Badge>
  )
}

export default PriorityBadge