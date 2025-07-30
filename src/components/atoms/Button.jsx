import React, { forwardRef } from "react"
import { cn } from "@/utils/cn"

const Button = forwardRef(({ 
  className, 
  variant = "primary", 
  size = "medium", 
  children, 
  disabled,
  ...props 
}, ref) => {
  const baseClasses = "inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
  
  const variants = {
    primary: "bg-gradient-to-r from-primary to-primary/90 text-white hover:shadow-lg hover:scale-[1.02] focus:ring-primary/20 border border-primary/20",
    secondary: "bg-gradient-to-r from-gray-50 to-gray-100 text-gray-700 hover:from-gray-100 hover:to-gray-200 hover:shadow-md focus:ring-gray-300 border border-gray-200",
    outline: "bg-transparent text-primary border border-primary hover:bg-primary hover:text-white focus:ring-primary/20",
    ghost: "bg-transparent text-gray-600 hover:bg-gray-100 hover:text-gray-900 focus:ring-gray-300",
    danger: "bg-gradient-to-r from-error to-error/90 text-white hover:shadow-lg hover:scale-[1.02] focus:ring-error/20 border border-error/20"
  }
  
  const sizes = {
    small: "px-3 py-1.5 text-sm",
    medium: "px-6 py-2.5 text-base",
    large: "px-8 py-3 text-lg"
  }
  
  return (
    <button
      className={cn(
        baseClasses,
        variants[variant],
        sizes[size],
        className
      )}
      ref={ref}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  )
})

Button.displayName = "Button"

export default Button