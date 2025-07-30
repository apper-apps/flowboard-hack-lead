import React, { useState } from "react"
import { Outlet } from "react-router-dom"
import Header from "@/components/organisms/Header"
import Sidebar from "@/components/organisms/Sidebar"

const Layout = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const handleMobileMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const handleMobileMenuClose = () => {
    setIsMobileMenuOpen(false)
  }

  return (
    <div className="min-h-screen bg-background">
      <Sidebar 
        isOpen={isMobileMenuOpen} 
        onClose={handleMobileMenuClose} 
      />
      
      <div className="lg:pl-64">
        <Header onMobileMenuToggle={handleMobileMenuToggle} />
        
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default Layout