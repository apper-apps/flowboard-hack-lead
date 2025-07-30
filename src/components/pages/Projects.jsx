import React, { useState, useEffect } from "react"
import { useSearchParams } from "react-router-dom"
import { toast } from "react-toastify"
import Button from "@/components/atoms/Button"
import SearchBar from "@/components/molecules/SearchBar"
import ProjectCard from "@/components/organisms/ProjectCard"
import ProjectModal from "@/components/organisms/ProjectModal"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"
import Empty from "@/components/ui/Empty"
import ApperIcon from "@/components/ApperIcon"
import { projectService } from "@/services/api/projectService"

const Projects = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [projects, setProjects] = useState([])
  const [filteredProjects, setFilteredProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [showProjectModal, setShowProjectModal] = useState(false)
  const [selectedProject, setSelectedProject] = useState(null)
  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "")
  const [statusFilter, setStatusFilter] = useState("")

  const filters = [
    {
      key: "status",
      label: "Status",
      value: statusFilter,
      options: [
        { value: "Planning", label: "Planning" },
        { value: "Active", label: "Active" },
        { value: "On Hold", label: "On Hold" },
        { value: "Completed", label: "Completed" }
      ]
    }
  ]

  useEffect(() => {
    loadProjects()
  }, [])

  useEffect(() => {
    filterProjects()
  }, [projects, searchQuery, statusFilter])

  const loadProjects = async () => {
    try {
      setLoading(true)
      setError("")
      const projectsData = await projectService.getAll()
      setProjects(projectsData)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const filterProjects = () => {
    let filtered = [...projects]

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(project =>
        project.title.toLowerCase().includes(query) ||
        project.description.toLowerCase().includes(query)
      )
    }

    if (statusFilter) {
      filtered = filtered.filter(project => project.status === statusFilter)
    }

    setFilteredProjects(filtered)
  }

  const handleSearch = (query) => {
    setSearchQuery(query)
    if (query) {
      setSearchParams({ search: query })
    } else {
      setSearchParams({})
    }
  }

  const handleFilterChange = (key, value) => {
    if (key === "status") {
      setStatusFilter(value)
    }
  }

  const handleNewProject = () => {
    setSelectedProject(null)
    setShowProjectModal(true)
  }

  const handleEditProject = (project) => {
    setSelectedProject(project)
    setShowProjectModal(true)
  }

  const handleDeleteProject = async (project) => {
    if (window.confirm(`Are you sure you want to delete "${project.title}"?`)) {
      try {
        await projectService.delete(project.Id)
        setProjects(prev => prev.filter(p => p.Id !== project.Id))
        toast.success("Project deleted successfully")
      } catch (err) {
        toast.error("Failed to delete project")
      }
    }
  }

  const handleProjectSave = (savedProject) => {
    if (selectedProject) {
      setProjects(prev => prev.map(p => p.Id === savedProject.Id ? savedProject : p))
    } else {
      setProjects(prev => [...prev, savedProject])
    }
  }

  if (loading) {
    return <Loading type="cards" />
  }

  if (error) {
    return <Error message={error} onRetry={loadProjects} />
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Projects</h1>
          <p className="text-gray-600">
            Manage your projects and track their progress
          </p>
        </div>
        <Button onClick={handleNewProject}>
          <ApperIcon name="Plus" className="h-4 w-4 mr-2" />
          New Project
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1">
          <SearchBar
            onSearch={handleSearch}
            placeholder="Search projects..."
            showFilters={true}
            filters={filters}
            onFilterChange={handleFilterChange}
          />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="text-2xl font-bold text-primary">
            {projects.filter(p => p.status === "Active").length}
          </div>
          <div className="text-sm text-gray-500">Active</div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="text-2xl font-bold text-warning">
            {projects.filter(p => p.status === "Planning").length}
          </div>
          <div className="text-sm text-gray-500">Planning</div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="text-2xl font-bold text-success">
            {projects.filter(p => p.status === "Completed").length}
          </div>
          <div className="text-sm text-gray-500">Completed</div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="text-2xl font-bold text-error">
            {projects.filter(p => p.status === "On Hold").length}
          </div>
          <div className="text-sm text-gray-500">On Hold</div>
        </div>
      </div>

      {/* Projects Grid */}
      {filteredProjects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map(project => (
            <ProjectCard
              key={project.Id}
              project={project}
              onEdit={handleEditProject}
              onDelete={handleDeleteProject}
            />
          ))}
        </div>
      ) : (
        <Empty
          title={searchQuery || statusFilter ? "No projects found" : "No projects yet"}
          message={
            searchQuery || statusFilter
              ? "Try adjusting your search criteria or filters."
              : "Create your first project to get started with FlowBoard."
          }
          actionLabel="Create Project"
          onAction={handleNewProject}
          iconName="FolderOpen"
        />
      )}

      {/* Project Modal */}
      <ProjectModal
        project={selectedProject}
        isOpen={showProjectModal}
        onClose={() => setShowProjectModal(false)}
        onSave={handleProjectSave}
      />
    </div>
  )
}

export default Projects