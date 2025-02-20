import React from 'react'

const HRAdminManual = () => {
  const sections = [
    {
      title: 'Szervezeti beállítások',
      content: [
        'Értékelési ciklusok létrehozása és kezelése',
        'Teljesítményértékelési sablonok konfigurálása',
        'Szervezeti szintű teljesítmény mutatók nyomon követése'
      ]
    },
    {
      title: 'Felhasználók kezelése',
      content: [
        'Új felhasználók felvétele',
        'Tömeges felhasználó importálás',
        'Felhasználói jogosultságok beállítása'
      ]
    },
    {
      title: 'Jelentéskészítés',
      content: [
        'Szervezeti szintű teljesítmény jelentések generálása',
        'Részletes statisztikák és elemzések',
        'Vezetői döntéstámogatás'
      ]
    }
  ]

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-primary-600">HR Admin Útmutató</h1>
      
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

      <div className="bg-purple-50 p-4 rounded-lg">
        <h3 className="text-lg font-semibold text-purple-800 mb-2">HR Admin ajánlások</h3>
        <ul className="list-disc pl-5 text-purple-700">
          <li>Folyamatos rendszerfelügyelet</li>
          <li>Adatvédelmi és biztonsági szabályzatok betartása</li>
          <li>Rendszeres képzések és támogatás nyújtása</li>
        </ul>
      </div>
    </div>
  )
}

export default HRAdminManual
