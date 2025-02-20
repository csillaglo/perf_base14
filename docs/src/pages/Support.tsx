import React from 'react'
import { Mail, Phone, HelpCircle } from 'lucide-react'

const Support = () => {
  const supportChannels = [
    {
      icon: Mail,
      title: 'Email támogatás',
      description: 'support@performancepro.com',
      details: 'Munkanapokon 8-16 óra között válaszolunk.'
    },
    {
      icon: Phone,
      title: 'Telefonos ügyfélszolgálat',
      description: '+36 1 234 5678',
      details: 'Hétfő-Péntek: 8:00-17:00'
    },
    {
      icon: HelpCircle,
      title: 'Online súgó',
      description: 'Gyakori kérdések és útmutatók',
      details: 'Tekintse meg a rendszer beépített súgóját.'
    }
  ]

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-primary-600">Támogatás</h1>
      
      {supportChannels.map((channel, index) => (
        <div key={index} className="bg-white p-6 rounded-lg shadow mb-6 flex items-center">
          <div className="mr-6 bg-primary-100 p-4 rounded-full">
            <channel.icon className="w-10 h-10 text-primary-600" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-primary-700 mb-2">{channel.title}</h2>
            <p className="text-gray-700 font-medium">{channel.description}</p>
            <p className="text-gray-500 text-sm">{channel.details}</p>
          </div>
        </div>
      ))}

      <div className="bg-blue-50 p-6 rounded-lg">
        <h3 className="text-xl font-semibold text-blue-800 mb-4">Hibabejelentés</h3>
        <p className="text-blue-700 mb-4">
          Ha problémát tapasztal a rendszerben, kérjük, az alábbi információkat készítse elő:
        </p>
        <ul className="list-disc pl-5 text-blue-700 space-y-2">
          <li>Pontos hibaleírás</li>
          <li>Képernyőkép (ha lehetséges)</li>
          <li>A hiba lépésről lépésre történő reprodukálhatósága</li>
        </ul>
      </div>
    </div>
  )
}

export default Support
