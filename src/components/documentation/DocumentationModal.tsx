import React, { useState } from 'react';
import { Book, X, ChevronRight, Search } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface DocumentationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const DOCUMENTATION_SECTIONS = [
  {
    category: 'Első lépések',
    items: [
      { 
        title: 'PerformancePro bemutatása', 
        description: 'Ismerje meg teljesítményértékelő platformunk alapjait',
        time: '5 perc olvasás',
        content: `
          <h2>PerformancePro: Teljesítményértékelő Platform</h2>
          <p>A PerformancePro egy átfogó teljesítménymenedzsment rendszer, amely segít a szervezeteknek hatékonyan nyomon követni és fejleszteni munkatársaik teljesítményét.</p>
          
          <h3>Főbb jellemzők</h3>
          <ul>
            <li>Egyéni és csoportos célok kitűzése</li>
            <li>Folyamatos teljesítmény nyomon követés</li>
            <li>Részletes értékelési jelentések</li>
            <li>Fejlesztési lehetőségek azonosítása</li>
          </ul>
        `
      },
      { 
        title: 'Profil beállítása', 
        description: 'Hogyan állíthatja be és testreszabhatja profilját',
        time: '3 perc olvasás',
        content: `
          <h2>Profil beállítása a PerformancePro-ban</h2>
          <p>A sikeres teljesítményértékelés első lépése a pontos és naprakész profil létrehozása.</p>
          
          <h3>Profil beállítási lépések</h3>
          <ol>
            <li>Jelentkezzen be a rendszerbe</li>
            <li>Navigáljon a Profil oldalra</li>
            <li>Töltse ki a személyes adatokat</li>
            <li>Adja meg munkakörét és részlegét</li>
            <li>Mentse el a módosításokat</li>
          </ol>
        `
      }
    ]
  },
  {
    category: 'Célok és Teljesítmény',
    items: [
      { 
        title: 'Célok létrehozása és kezelése', 
        description: 'Hogyan állíthat be és követhet nyomon szakmai célokat',
        time: '7 perc olvasás',
        content: `
          <h2>Célok létrehozása a PerformancePro-ban</h2>
          <p>A célok kulcsfontosságúak a szakmai fejlődésben és a szervezeti sikerben.</p>
          
          <h3>Hatékony célkitűzés lépései</h3>
          <ul>
            <li>Legyen specifikus</li>
            <li>Mérhető célokat tűzzön ki</li>
            <li>Igazítsa a szervezeti célokhoz</li>
            <li>Reális határidőket szabjon</li>
          </ul>
        `
      },
      { 
        title: 'Teljesítmény értékelési folyamat', 
        description: 'Az értékelési munkafolyamat megértése',
        time: '6 perc olvasás',
        content: `
          <h2>Teljesítmény Értékelési Folyamat</h2>
          <p>A rendszeres és átlátható teljesítményértékelés kulcsfontosságú a szervezeti fejlődésben.</p>
          
          <h3>Értékelési ciklus lépései</h3>
          <ol>
            <li>Célok kitűzése</li>
            <li>Folyamatos nyomon követés</li>
            <li>Önértékelés</li>
            <li>Vezetői értékelés</li>
            <li>Visszajelzés és fejlesztési terv</li>
          </ol>
        `
      }
    ]
  },
  {
    category: 'Szerepkörök és Jogosultságok',
    items: [
      { 
        title: 'Felhasználói szerepkörök', 
        description: 'A rendszer különböző szerepköreinek megértése',
        time: '4 perc olvasás',
        content: `
          <h2>Felhasználói Szerepkörök a PerformancePro-ban</h2>
          <p>A különböző szerepkörök meghatározzák a rendszerben elérhető funkciókat és jogosultságokat.</p>
          
          <h3>Szerepkörök hierarchiája</h3>
          <ul>
            <li><strong>Munkatárs</strong>: Saját célok kezelése</li>
            <li><strong>Vezető</strong>: Csapat céljainak és teljesítményének felügyelete</li>
            <li><strong>HR Admin</strong>: Szervezeti teljesítmény folyamatok kezelése</li>
            <li><strong>Cég Admin</strong>: Rendszerbeállítások konfigurálása</li>
            <li><strong>Szuperadmin</strong>: Teljes rendszer hozzáférés</li>
          </ul>
        `
      },
      { 
        title: 'Hozzáférés-vezérlés', 
        description: 'Hogyan működnek a jogosultságok a különböző felhasználói típusoknál',
        time: '5 perc olvasás',
        content: `
          <h2>Hozzáférés-vezérlés a PerformancePro-ban</h2>
          <p>A biztonságos és hatékony működés érdekében minden felhasználónak specifikus jogosultságai vannak.</p>
          
          <h3>Jogosultság típusok</h3>
          <ul>
            <li>Olvasási jogosultság</li>
            <li>Írási jogosultság</li>
            <li>Módosítási jogosultság</li>
            <li>Jóváhagyási jogosultság</li>
          </ul>
        `
      }
    ]
  }
];

export function DocumentationModal({ isOpen, onClose }: DocumentationModalProps) {
  const { role } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [activeContent, setActiveContent] = useState<string | null>(null);

  const filteredSections = DOCUMENTATION_SECTIONS.filter(section => 
    section.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    section.items.some(item => 
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-5/6 h-5/6 bg-white dark:bg-gray-900 rounded-xl shadow-2xl flex">
        {/* Sidebar */}
        <div className="w-1/4 bg-gray-50 dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 p-6 overflow-y-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Dokumentáció</h2>
            <button 
              onClick={onClose} 
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="relative mb-6">
            <input 
              type="text" 
              placeholder="Dokumentáció keresése..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-200"
            />
            <Search className="absolute right-3 top-3 text-gray-400" />
          </div>

          {filteredSections.map((section, index) => (
            <div key={index} className="mb-6">
              <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-300 mb-3">
                {section.category}
              </h3>
              {section.items.map((item, itemIndex) => (
                <div 
                  key={itemIndex} 
                  className="p-3 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg cursor-pointer group"
                  onClick={() => {
                    setActiveCategory(section.category);
                    setActiveContent(item.content);
                  }}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-primary-600">
                        {item.title}
                      </h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {item.description}
                      </p>
                      <span className="text-xs text-gray-400 dark:text-gray-500">
                        {item.time}
                      </span>
                    </div>
                    <ChevronRight className="text-gray-400 group-hover:text-primary-600" />
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Content Area */}
        <div className="w-3/4 p-8 overflow-y-auto">
          {activeContent ? (
            <div>
              <button 
                onClick={() => {
                  setActiveCategory(null);
                  setActiveContent(null);
                }}
                className="text-sm text-gray-500 hover:text-gray-700 mb-4 flex items-center"
              >
                <ChevronRight className="h-4 w-4 mr-2 transform rotate-180" />
                Vissza a kategóriákhoz
              </button>
              
              <div 
                className="prose dark:prose-invert max-w-none" 
                dangerouslySetInnerHTML={{ __html: activeContent }}
              />
            </div>
          ) : (
            <div className="text-center py-16">
              <Book className="mx-auto h-16 w-16 text-gray-300 mb-4" />
              <h2 className="text-2xl font-semibold text-gray-600">
                Válasszon dokumentációs kategóriát a kezdéshez
              </h2>
              <p className="text-gray-500 mt-2">
                Böngésszen átfogó útmutatóink között a PerformancePro mélyebb megismeréséhez
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
