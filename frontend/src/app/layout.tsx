// frontend/src/app/layout.tsx
import Sidebar from '@/app/components/Sidebar';


import './globals.css';

export const metadata = {
  title: 'Internal AI Tool',
  description: 'A tool for managing AI workflows and communication',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ display: 'flex', minHeight: '100vh' }}>
        {/* Sidebar Area */}
        <Sidebar />
        {/* Main Content Area */}
        <main style={{ flex: 1, padding: '20px' }}>
          {children}
        </main>
      </body>
    </html>
  );
}
