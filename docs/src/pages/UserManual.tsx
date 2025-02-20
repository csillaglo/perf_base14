import React from 'react'

const UserManual = () => {
  const sections = [
    {
      title: 'Célok kezelése',
      content: [
        'Saját célok létrehozása',
        'Célok súlyozása (0-100%)',
        'Státuszok beállítása: Függőben, Folyamatban, Teljesítve'
      ]
    },
    {
      title: 'Teljesítmény nyomon követése',
      content: [
        'Egyéni teljesítmény pontszám megtekintése',
        'Célok előrehaladásának figyelése',
        'Értékelési ciklus állapotának ellenőrzése'
      ]
    },
    {
      title: 'Profil kezelése',
      content: [
        'Személyes adatok frissítése',
        'Képzettség és tapasztalat rögzítése',
        'Kapcsolattartási információk módosítása'
      ]
    }
  ]

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-primary-600">Munkatárs (Alkalmazott) Útmutató</h1>
      
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

      <div className="bg-blue-50 p-4 rounded-lg">
        <h3 className="text-lg font-semibold text-blue-800 mb-2">Tippek</h3>
        <ul className="list-disc pl-5 text-blue-700">
          <li>Rendszeresen frissítse céljait</li>
          <li>Legyen naprakész a teljesítmény nyomon követésben</li>
          <li>Kommunikáljon rendszeresen a vezetőjével</li>
        </ul>
      </div>
    </div>
  )
}

export default UserManual
