import React, { useState } from "react"
import Input from "@/components/atoms/Input"
import Button from "@/components/atoms/Button"
import ApperIcon from "@/components/ApperIcon"
import { cn } from "@/utils/cn"

const SearchBar = ({ 
  onSearch, 
  placeholder = "Search...", 
  showFilters = false,
  filters,
  onFilterChange,
  className 
}) => {
  const [query, setQuery] = useState("")
  const [showFilterDropdown, setShowFilterDropdown] = useState(false)

  const handleSearch = (e) => {
    e.preventDefault()
    onSearch?.(query)
  }

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch(e)
    }
  }

  return (
    <div className={cn("relative", className)}>
      <form onSubmit={handleSearch} className="flex gap-3">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <ApperIcon name="Search" className="h-5 w-5 text-gray-400" />
          </div>
          <Input
            type="text"
            placeholder={placeholder}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            className="pl-10"
          />
        </div>
        
        {showFilters && (
          <div className="relative">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setShowFilterDropdown(!showFilterDropdown)}
            >
              <ApperIcon name="Filter" className="h-4 w-4 mr-2" />
              Filters
            </Button>
            
            {showFilterDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                <div className="p-4 space-y-3">
                  {filters?.map((filter) => (
                    <div key={filter.key}>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {filter.label}
                      </label>
                      <select
                        value={filter.value || ""}
                        onChange={(e) => onFilterChange?.(filter.key, e.target.value)}
                        className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                      >
                        <option value="">All</option>
                        {filter.options?.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
        
        <Button type="submit">
          Search
        </Button>
      </form>
    </div>
  )
}

export default SearchBar