import React from "react"
import { cn } from "@/utils/cn"

const Avatar = ({ 
  src, 
  alt, 
  name, 
  size = "medium", 
  className 
}) => {
  const sizes = {
    small: "w-8 h-8 text-xs",
    medium: "w-10 h-10 text-sm",
    large: "w-12 h-12 text-base",
    xl: "w-16 h-16 text-lg"
  }
  
  const getInitials = (name) => {
    return name
      ?.split(" ")
      .slice(0, 2)
      .map(n => n[0])
      .join("")
      .toUpperCase() || "?"
  }
  
  if (src) {
    return (
      <img
        src={src}
        alt={alt || name}
        className={cn(
          "rounded-full object-cover border-2 border-white shadow-sm",
          sizes[size],
          className
        )}
      />
    )
  }
  
  return (
    <div
      className={cn(
        "rounded-full bg-gradient-to-r from-primary to-secondary text-white font-medium flex items-center justify-center border-2 border-white shadow-sm",
        sizes[size],
        className
      )}
    >
      {getInitials(name)}
    </div>
  )
}

export default Avatar