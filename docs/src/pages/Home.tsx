import React from 'react'
import { Book, Users, Settings, HelpCircle } from 'lucide-react'
import { Link } from 'react-router-dom'

const Home = () => {
  const sections = [
    { 
      icon: Users, 
      title: 'Munkatárs útmutató', 
      description: 'Alapvető funkciók és célkezelés',
      path: '/user-manual'
    },
    { 
      icon: Settings, 
      title: 'Menedzser útmutató', 
      description: 'Csapattagok teljesítményének kezelése',
      path: '/manager-manual'
    },
    { 
      icon: Settings, 
      title: 'HR Admin útmutató', 
      description: 'Szervezeti szintű beállítások',
      path: '/hr-admin-manual'
    },
    { 
      icon: Settings, 
      title: 'Vállalati Admin útmutató', 
      description: 'Rendszerszintű konfigurációk',
      path: '/company-admin-manual'
    }
  ]

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold mb-8 text-primary-600">PerformancePro Dokumentáció</h1>
      
      <div className="grid md:grid-cols-2 gap-6">
        {sections.map((section) => (
          <Link 
            key={section.path} 
            to={section.path} 
            className="block bg-white p-6 rounded-lg shadow hover:shadow-lg transition-all group"
          >
            <div className="flex items-center mb-4">
              <section.icon className="w-10 h-10 text-primary-500 mr-4 group-hover:scale-110 transition-transform" />
              <h2 className="text-xl font-semibold text-gray-800 group-hover:text-primary-600">{section.title}</h2>
            </div>
            <p className="text-gray-600">{section.description}</p>
          </Link>
        ))}
      </div>

      <div className="mt-12 bg-white p-6 rounded-lg shadow">
        <h3 className="text-2xl font-bold mb-4 text-primary-600">Üdvözöljük a PerformancePro dokumentációjában!</h3>
        <p className="text-gray-700 mb-4">
          Ez a dokumentáció segít Önnek megérteni és hatékonyan használni a PerformancePro teljesítményértékelő rendszert.
        </p>
        <p className="text-gray-600">
          Válassza ki a saját szerepköréhez tartozó útmutatót a bal oldali menüben, vagy böngésszen a különböző fejezetek között.
        </p>
      </div>
    </div>
  )
}

export default Home
