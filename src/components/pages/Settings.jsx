import React, { useState } from "react"
import Card from "@/components/atoms/Card"
import Button from "@/components/atoms/Button"
import Input from "@/components/atoms/Input"
import FormField from "@/components/molecules/FormField"
import Avatar from "@/components/atoms/Avatar"
import ApperIcon from "@/components/ApperIcon"
import { toast } from "react-toastify"

const Settings = () => {
  const [activeTab, setActiveTab] = useState("profile")
  const [profileData, setProfileData] = useState({
    name: "Alex Johnson",
    email: "alex.johnson@company.com",
    role: "Full Stack Developer",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
  })
  const [preferences, setPreferences] = useState({
    notifications: true,
    emailUpdates: true,
    theme: "light",
    timezone: "UTC-05:00"
  })
  const [loading, setLoading] = useState(false)

  const tabs = [
    { id: "profile", label: "Profile", icon: "User" },
    { id: "preferences", label: "Preferences", icon: "Settings" },
    { id: "notifications", label: "Notifications", icon: "Bell" },
    { id: "team", label: "Team Settings", icon: "Users" },
    { id: "integrations", label: "Integrations", icon: "Zap" }
  ]

  const handleProfileSave = async () => {
    setLoading(true)
    // Simulate API call
    setTimeout(() => {
      setLoading(false)
      toast.success("Profile updated successfully")
    }, 1000)
  }

  const handlePreferencesSave = async () => {
    setLoading(true)
    // Simulate API call
    setTimeout(() => {
      setLoading(false)
      toast.success("Preferences updated successfully")
    }, 1000)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Settings</h1>
        <p className="text-gray-600">
          Manage your account settings and preferences
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <Card className="p-4">
            <nav className="space-y-1">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2 text-left rounded-lg transition-colors ${
                    activeTab === tab.id
                      ? "bg-primary text-white"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <ApperIcon name={tab.icon} className="h-4 w-4" />
                  {tab.label}
                </button>
              ))}
            </nav>
          </Card>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          <Card className="p-6">
            {activeTab === "profile" && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Profile Information</h2>
                  
                  <div className="flex items-center gap-6 mb-6">
                    <Avatar
                      src={profileData.avatar}
                      name={profileData.name}
                      size="xl"
                    />
                    <div>
                      <Button variant="secondary" size="small">
                        <ApperIcon name="Upload" className="h-4 w-4 mr-2" />
                        Change Photo
                      </Button>
                      <p className="text-sm text-gray-500 mt-1">
                        JPG, GIF or PNG. 1MB max.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField label="Full Name" required>
                      <Input
                        value={profileData.name}
                        onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
                      />
                    </FormField>

                    <FormField label="Email Address" required>
                      <Input
                        type="email"
                        value={profileData.email}
                        onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                      />
                    </FormField>

                    <FormField label="Role">
                      <Input
                        value={profileData.role}
                        onChange={(e) => setProfileData(prev => ({ ...prev, role: e.target.value }))}
                      />
                    </FormField>

                    <FormField label="Phone Number">
                      <Input
                        type="tel"
                        placeholder="+1 (555) 000-0000"
                      />
                    </FormField>
                  </div>

                  <div className="flex justify-end">
                    <Button onClick={handleProfileSave} disabled={loading}>
                      {loading && <ApperIcon name="Loader2" className="h-4 w-4 mr-2 animate-spin" />}
                      Save Changes
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "preferences" && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Preferences</h2>
                  
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-medium text-gray-900 mb-3">Appearance</h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-gray-900">Theme</p>
                            <p className="text-sm text-gray-500">Choose your preferred theme</p>
                          </div>
                          <select
                            value={preferences.theme}
                            onChange={(e) => setPreferences(prev => ({ ...prev, theme: e.target.value }))}
                            className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                          >
                            <option value="light">Light</option>
                            <option value="dark">Dark</option>
                            <option value="system">System</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-medium text-gray-900 mb-3">Notifications</h3>
                      <div className="space-y-3">
                        <label className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-gray-900">Push Notifications</p>
                            <p className="text-sm text-gray-500">Receive notifications in your browser</p>
                          </div>
                          <input
                            type="checkbox"
                            checked={preferences.notifications}
                            onChange={(e) => setPreferences(prev => ({ ...prev, notifications: e.target.checked }))}
                            className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                          />
                        </label>

                        <label className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-gray-900">Email Updates</p>
                            <p className="text-sm text-gray-500">Receive email notifications for important updates</p>
                          </div>
                          <input
                            type="checkbox"
                            checked={preferences.emailUpdates}
                            onChange={(e) => setPreferences(prev => ({ ...prev, emailUpdates: e.target.checked }))}
                            className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                          />
                        </label>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-medium text-gray-900 mb-3">Regional</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField label="Timezone">
                          <select
                            value={preferences.timezone}
                            onChange={(e) => setPreferences(prev => ({ ...prev, timezone: e.target.value }))}
                            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                          >
                            <option value="UTC-05:00">Eastern Time (UTC-05:00)</option>
                            <option value="UTC-06:00">Central Time (UTC-06:00)</option>
                            <option value="UTC-07:00">Mountain Time (UTC-07:00)</option>
                            <option value="UTC-08:00">Pacific Time (UTC-08:00)</option>
                          </select>
                        </FormField>

                        <FormField label="Date Format">
                          <select className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20">
                            <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                            <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                            <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                          </select>
                        </FormField>
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <Button onClick={handlePreferencesSave} disabled={loading}>
                        {loading && <ApperIcon name="Loader2" className="h-4 w-4 mr-2 animate-spin" />}
                        Save Preferences
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {(activeTab === "notifications" || activeTab === "team" || activeTab === "integrations") && (
              <div className="text-center py-12">
                <ApperIcon name="Settings" className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {tabs.find(tab => tab.id === activeTab)?.label} Settings
                </h3>
                <p className="text-gray-500">
                  This section is coming soon! We're working on bringing you more customization options.
                </p>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  )
}

export default Settings