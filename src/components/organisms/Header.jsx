import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import Button from "@/components/atoms/Button"
import Avatar from "@/components/atoms/Avatar"
import SearchBar from "@/components/molecules/SearchBar"
import ApperIcon from "@/components/ApperIcon"

const Header = ({ onMobileMenuToggle }) => {
  const navigate = useNavigate()
  const [showUserMenu, setShowUserMenu] = useState(false)

  const currentUser = {
    name: "Alex Johnson",
    email: "alex.johnson@company.com",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
  }

  const handleSearch = (query) => {
    if (query.trim()) {
      navigate(`/projects?search=${encodeURIComponent(query)}`)
    }
  }

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Mobile menu button */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="small"
            onClick={onMobileMenuToggle}
            className="lg:hidden"
          >
            <ApperIcon name="Menu" className="h-5 w-5" />
          </Button>
          
          {/* Logo for mobile */}
          <div className="lg:hidden">
            <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              FlowBoard
            </h1>
          </div>
        </div>

        {/* Search bar */}
        <div className="hidden md:block flex-1 max-w-md mx-8">
          <SearchBar
            onSearch={handleSearch}
            placeholder="Search projects and tasks..."
          />
        </div>

        {/* Right side actions */}
        <div className="flex items-center gap-4">
          {/* Mobile search */}
          <Button
            variant="ghost"
            size="small"
            className="md:hidden"
          >
            <ApperIcon name="Search" className="h-5 w-5" />
          </Button>

          {/* Notifications */}
          <Button
            variant="ghost"
            size="small"
            className="relative"
          >
            <ApperIcon name="Bell" className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 h-3 w-3 bg-error rounded-full"></span>
          </Button>

          {/* User menu */}
          <div className="relative">
            <Button
              variant="ghost"
              size="small"
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="p-1"
            >
              <Avatar
                src={currentUser.avatar}
                name={currentUser.name}
                size="medium"
              />
            </Button>

            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 z-50 animate-fade-in">
                <div className="p-4 border-b border-gray-100">
                  <p className="font-medium text-gray-900">{currentUser.name}</p>
                  <p className="text-sm text-gray-500">{currentUser.email}</p>
                </div>
                <div className="py-2">
                  <button
                    onClick={() => {
                      navigate("/settings")
                      setShowUserMenu(false)
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                  >
                    <ApperIcon name="Settings" className="h-4 w-4" />
                    Settings
                  </button>
                  <button
                    onClick={() => setShowUserMenu(false)}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                  >
                    <ApperIcon name="HelpCircle" className="h-4 w-4" />
                    Help
                  </button>
                  <div className="border-t border-gray-100 mt-2">
                    <button
                      onClick={() => setShowUserMenu(false)}
                      className="w-full text-left px-4 py-2 text-sm text-error hover:bg-error/5 flex items-center gap-2"
                    >
                      <ApperIcon name="LogOut" className="h-4 w-4" />
                      Sign out
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header