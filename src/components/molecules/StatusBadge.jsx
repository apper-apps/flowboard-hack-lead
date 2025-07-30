import React from "react"
import Badge from "@/components/atoms/Badge"
import ApperIcon from "@/components/ApperIcon"

const StatusBadge = ({ status, type = "task", showIcon = true }) => {
  const taskStatusConfig = {
    "To Do": {
      variant: "default",
      icon: "Circle",
      color: "text-gray-500"
    },
    "In Progress": {
      variant: "info",
      icon: "Clock",
      color: "text-info"
    },
    "Review": {
      variant: "warning",
      icon: "Eye",
      color: "text-warning"
    },
    "Done": {
      variant: "success",
      icon: "CheckCircle",
      color: "text-success"
    }
  }

  const projectStatusConfig = {
    Planning: {
      variant: "default",
      icon: "FileText",
      color: "text-gray-500"
    },
    Active: {
      variant: "success",
      icon: "Play",
      color: "text-success"
    },
    "On Hold": {
      variant: "warning",
      icon: "Pause",
      color: "text-warning"
    },
    Completed: {
      variant: "success",
      icon: "CheckCircle2",
      color: "text-success"
    }
  }

  const config = type === "task" 
    ? taskStatusConfig[status] || taskStatusConfig["To Do"]
    : projectStatusConfig[status] || projectStatusConfig.Planning

  return (
    <Badge variant={config.variant} size="small">
      {showIcon && (
        <ApperIcon 
          name={config.icon} 
          className={`h-3 w-3 mr-1 ${config.color}`} 
        />
      )}
      {status}
    </Badge>
  )
}

export default StatusBadge