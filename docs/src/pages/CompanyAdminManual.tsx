import React from 'react'

const CompanyAdminManual = () => {
  const sections = [
    {
      title: 'Rendszerszintű beállítások',
      content: [
        'Szervezeti struktúra konfigurálása',
        'Teljesítmény értékelési kategóriák definiálása',
        'Jogosultsági szintek beállítása'
      ]
    },
    {
      title: 'Szervezetek kezelése',
      content: [
        'Új szervezetek létrehozása',
        'Szervezeti hierarchia karbantartása',
        'Adminisztrátorok kijelölése'
      ]
    },
    {
      title: 'Rendszer monitorozás',
      content: [
        'Felhasználói aktivitás figyelése',
        'Rendszerteljesítmény ellenőrzése',
        'Biztonsági beállítások konfigurálása'
      ]
    }
  ]

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-primary-600">Vállalati Admin Útmutató</h1>
      
      {sections.map((section, index) => (
        <div key={index} className="bg-white p-6 rounded-lg shadow mb-6">
          <h2 className="text-xl font-semibold mb-4 text-primary-700 border-b pb-2">{section.title}</h2>
          <ul className="list-disc pl-5 space-y-2">
            {section.content.map((item, idx) => (
              <li key={idx} className="text-gray-700">{item}</li>
            ))}
          </ul>
        </div>
      ))}

      <div className="bg-red-50 p-4 rounded-lg">
        <h3 className="text-lg font-semibold text-red-800 mb-2">Vállalati Admin ajánlások</h3>
        <ul className="list-disc pl-5 text-red-700">
          <li>Rendszeres biztonsági felülvizsgálat</li>
          <li>Adatvédelmi szabályzatok naprakészen tartása</li>
          <li>Rendszerfrissítések és karbantartás ütemezése</li>
        </ul>
      </div>
    </div>
  )
}

export default CompanyAdminManual
