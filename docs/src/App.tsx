import React, { useState } from 'react'
import { Routes, Route, Link, NavLink } from 'react-router-dom'
import { Menu, Book, Users, Settings, HelpCircle, Search } from 'lucide-react'

import Home from './pages/Home'
import UserManual from './pages/UserManual'
import ManagerManual from './pages/ManagerManual'
import HRAdminManual from './pages/HRAdminManual'
import CompanyAdminManual from './pages/CompanyAdminManual'
import Support from './pages/Support'

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  const menuItems = [
    { icon: Book, label: 'Kezdőlap', path: '/' },
    { icon: Users, label: 'Munkatárs útmutató', path: '/user-manual' },
    { icon: Settings, label: 'Menedzser útmutató', path: '/manager-manual' },
    { icon: Settings, label: 'HR Admin útmutató', path: '/hr-admin-manual' },
    { icon: Settings, label: 'Vállalati Admin útmutató', path: '/company-admin-manual' },
    { icon: HelpCircle, label: 'Támogatás', path: '/support' }
  ]

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Mobile Sidebar Toggle */}
      <button 
        onClick={() => setSidebarOpen(!sidebarOpen)} 
        className="md:hidden fixed top-4 left-4 z-50 bg-white p-2 rounded-lg shadow"
      >
        <Menu />
      </button>

      {/* Sidebar */}
      <div className={`
        fixed md:static z-40 w-64 h-full bg-white shadow-lg transform transition-transform duration-300
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0
      `}>
        <div className="p-5 border-b">
          <h1 className="text-2xl font-bold text-primary-600">PerformancePro</h1>
          <p className="text-sm text-gray-500">Felhasználói Kézikönyv</p>
        </div>

        <div className="p-4">
          <div className="relative mb-4">
            <input 
              type="text" 
              placeholder="Keresés..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-200"
            />
            <Search className="absolute right-3 top-3 text-gray-400" />
          </div>

          <nav>
            {menuItems.map((item) => (
              <NavLink 
                key={item.path} 
                to={item.path} 
                className={({ isActive }) => 
                  `sidebar-link flex items-center ${isActive ? 'active' : ''}`
                }
                onClick={() => setSidebarOpen(false)}
              >
                <item.icon className="mr-2 w-5 h-5" />
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>
      </div>

      {/* Content Area */}
      <main className="flex-1 overflow-y-auto p-10 bg-gray-50">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/user-manual" element={<UserManual />} />
          <Route path="/manager-manual" element={<ManagerManual />} />
          <Route path="/hr-admin-manual" element={<HRAdminManual />} />
          <Route path="/company-admin-manual" element={<CompanyAdminManual />} />
          <Route path="/support" element={<Support />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
