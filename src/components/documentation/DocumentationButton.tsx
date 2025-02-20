import React, { useState } from 'react';
import { Book } from 'lucide-react';
import { DocumentationModal } from './DocumentationModal';

export function DocumentationButton() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <button 
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-6 right-6 bg-indigo-600 text-white p-3 rounded-full shadow-lg hover:bg-indigo-700 transition-colors"
        title="Dokumentáció"
      >
        <Book className="h-6 w-6" />
      </button>
      <DocumentationModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </>
  );
}
