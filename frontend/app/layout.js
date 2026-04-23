import './globals.css';
import Sidebar from '../components/Sidebar';

export const metadata = {
  title: 'Altairis Backoffice',
  description: 'Plataforma de gestión hotelera B2B',
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>
        <div className="flex h-screen overflow-hidden">
          <Sidebar />
          <main className="flex-1 overflow-y-auto">
            <div className="p-8">
              {children}
            </div>
          </main>
        </div>
      </body>
    </html>
  );
}
