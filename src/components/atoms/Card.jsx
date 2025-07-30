import React, { forwardRef } from "react"
import { cn } from "@/utils/cn"

const Card = forwardRef(({ 
  className, 
  children, 
  hover = false,
  ...props 
}, ref) => {
  return (
    <div
      className={cn(
        "bg-white rounded-xl shadow-md border border-gray-100 transition-all duration-200",
        hover && "hover:shadow-lg hover:scale-[1.02] cursor-pointer",
        className
      )}
      ref={ref}
      {...props}
    >
      {children}
    </div>
  )
})

Card.displayName = "Card"

export default Card