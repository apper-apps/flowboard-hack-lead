import React from "react"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { ToastContainer } from "react-toastify"
import Layout from "@/components/organisms/Layout"
import Dashboard from "@/components/pages/Dashboard"
import Projects from "@/components/pages/Projects"
import ProjectDetail from "@/components/pages/ProjectDetail"
import MyTasks from "@/components/pages/MyTasks"
import Calendar from "@/components/pages/Calendar"
import Team from "@/components/pages/Team"
import Settings from "@/components/pages/Settings"

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-background">
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="projects" element={<Projects />} />
            <Route path="projects/:id" element={<ProjectDetail />} />
            <Route path="my-tasks" element={<MyTasks />} />
            <Route path="calendar" element={<Calendar />} />
            <Route path="team" element={<Team />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Routes>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
          className="!top-20 !right-4 !w-auto !max-w-md !z-[9999]"
        />
      </div>
    </BrowserRouter>
  )
}

export default App