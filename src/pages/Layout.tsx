import React from 'react';
import { DocumentationButton } from '../components/documentation/DocumentationButton';

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      {children}
      <DocumentationButton />
    </div>
  );
}
