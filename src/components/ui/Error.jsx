import React from "react"
import Button from "@/components/atoms/Button"
import ApperIcon from "@/components/ApperIcon"

const Error = ({ 
  title = "Something went wrong", 
  message = "We encountered an error while loading your data. Please try again.", 
  onRetry,
  className = "" 
}) => {
  return (
    <div className={`text-center py-12 ${className}`}>
      <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-error to-error/80 rounded-full mb-4">
        <ApperIcon name="AlertCircle" className="h-8 w-8 text-white" />
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-500 mb-6 max-w-md mx-auto">{message}</p>
      {onRetry && (
        <Button onClick={onRetry}>
          <ApperIcon name="RefreshCw" className="h-4 w-4 mr-2" />
          Try Again
        </Button>
      )}
    </div>
  )
}

export default Error