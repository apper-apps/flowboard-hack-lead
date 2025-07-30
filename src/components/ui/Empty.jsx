import React from "react"
import Button from "@/components/atoms/Button"
import ApperIcon from "@/components/ApperIcon"

const Empty = ({ 
  title = "No data found", 
  message = "There's nothing here yet. Get started by creating your first item.", 
  actionLabel = "Get Started",
  onAction,
  iconName = "Plus",
  className = "" 
}) => {
  return (
    <div className={`text-center py-12 ${className}`}>
      <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full mb-4">
        <ApperIcon name={iconName} className="h-8 w-8 text-gray-400" />
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-500 mb-6 max-w-md mx-auto">{message}</p>
      {onAction && (
        <Button onClick={onAction}>
          <ApperIcon name="Plus" className="h-4 w-4 mr-2" />
          {actionLabel}
        </Button>
      )}
    </div>
  )
}

export default Empty