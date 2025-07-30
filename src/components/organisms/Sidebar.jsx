import React from "react"
import { NavLink } from "react-router-dom"
import ApperIcon from "@/components/ApperIcon"
import { cn } from "@/utils/cn"

const Sidebar = ({ isOpen, onClose }) => {
const navigation = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: "LayoutDashboard"
    },
    {
      name: "Projects",
      href: "/projects",
      icon: "FolderOpen"
    },
    {
      name: "My Tasks",
      href: "/my-tasks",
      icon: "CheckSquare"
    },
    {
      name: "Calendar",
      href: "/calendar",
      icon: "Calendar"
    },
    {
      name: "Team",
      href: "/team",
      icon: "Users"
    },
    {
      name: "Settings",
      href: "/settings",
      icon: "Settings"
    }
  ]

  // Desktop Sidebar
  const DesktopSidebar = () => (
    <div className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 lg:bg-white lg:border-r lg:border-gray-200">
      <div className="flex flex-col flex-1">
        {/* Logo */}
        <div className="px-6 py-6 border-b border-gray-200">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            FlowBoard
          </h1>
          <p className="text-sm text-gray-500 mt-1">Project Management Hub</p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          {navigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 px-4 py-3 text-gray-600 hover:text-primary hover:bg-primary/5 rounded-lg transition-all duration-200 cursor-pointer group",
                  isActive && "bg-gradient-to-r from-primary/10 to-primary/5 text-primary border-r-2 border-primary"
                )
              }
            >
              <ApperIcon name={item.icon} className="h-5 w-5 transition-colors" />
              <span className="font-medium">{item.name}</span>
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
            <span className="text-sm text-gray-500">All systems operational</span>
          </div>
        </div>
      </div>
    </div>
  )

  // Mobile Sidebar
  const MobileSidebar = () => (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black bg-opacity-50 backdrop-blur-sm"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          "lg:hidden fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
            <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              FlowBoard
            </h1>
            <button
              onClick={onClose}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg"
            >
              <ApperIcon name="X" className="h-5 w-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navigation.map((item) => (
              <NavLink
                key={item.name}
                to={item.href}
                onClick={onClose}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3 px-4 py-3 text-gray-600 hover:text-primary hover:bg-primary/5 rounded-lg transition-all duration-200 cursor-pointer",
                    isActive && "bg-gradient-to-r from-primary/10 to-primary/5 text-primary"
                  )
                }
              >
                <ApperIcon name={item.icon} className="h-5 w-5" />
                <span className="font-medium">{item.name}</span>
              </NavLink>
            ))}
          </nav>
        </div>
      </div>
    </>
  )

  return (
    <>
      <DesktopSidebar />
      <MobileSidebar />
    </>
  )
}

export default Sidebar