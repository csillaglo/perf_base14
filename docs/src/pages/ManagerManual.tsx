import React from 'react'

const ManagerManual = () => {
  const sections = [
    {
      title: 'Csapattagok céljainak kezelése',
      content: [
        'Beosztottak céljainak megtekintése',
        'Célok jóváhagyása és visszajelzés adása',
        'Új célok létrehozásának támogatása'
      ]
    },
    {
      title: 'Teljesítmény értékelés',
      content: [
        'Csapattagok egyéni teljesítményének értékelése',
        'Pontszámok rögzítése (1-5 skála)',
        'Részletes szöveges értékelés készítése'
      ]
    },
    {
      title: 'Fejlesztési tervek',
      content: [
        'Egyéni fejlesztési területek azonosítása',
        'Képzési és fejlődési lehetőségek ajánlása',
        'Karriertervezés támogatása'
      ]
    }
  ]

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-primary-600">Menedzser Útmutató</h1>
      
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

      <div className="bg-green-50 p-4 rounded-lg">
        <h3 className="text-lg font-semibold text-green-800 mb-2">Menedzseri ajánlások</h3>
        <ul className="list-disc pl-5 text-green-700">
          <li>Rendszeres egyéni és csoportos visszajelzés</li>
          <li>Objektív és konstruktív értékelés</li>
          <li>Egyéni fejlődési utak támogatása</li>
        </ul>
      </div>
    </div>
  )
}

export default ManagerManual
