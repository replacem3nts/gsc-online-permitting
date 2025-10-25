'use client'

import { usePathname } from 'next/navigation'

export default function ConditionalLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  
  // If this is a permit page, render without header/footer
  if (pathname?.startsWith('/permit/')) {
    return <>{children}</>
  }
  
  // Otherwise, render with full layout
  return (
    <>
      <nav className="shadow-lg">
        <div className="flex h-24">
          <div className="w-1/3 bg-white flex items-center justify-start pl-8 pr-4">
            <div className="flex items-center">
              <img src="/white_logo.png" alt="Shellfish Commission Logo" className="h-20 mr-3" />
              <h1 className="font-bold text-2xl lg:text-4xl" style={{ color: 'rgb(85, 85, 85)', fontFamily: 'EB Garamond, serif', fontWeight: 700 }}>
                Shellfish Commission
              </h1>
            </div>
          </div>
          <div className="w-2/3 flex items-center justify-end px-4 sm:px-6 lg:px-8" style={{ backgroundColor: 'rgba(18, 62, 45, 0.9)' }}>
            <a href="https://www.greenwichct.gov" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity">
              <img src="/greenwich_logo.png" alt="Town of Greenwich" className="h-12" />
            </a>
          </div>
        </div>
      </nav>
      <main className="min-h-screen" style={{ background: 'linear-gradient(to bottom right, rgba(18, 62, 45, 0.05), rgba(59, 102, 126, 0.1))' }}>
        {children}
      </main>
      <footer style={{ backgroundColor: 'rgba(18, 62, 45, 0.9)', color: 'white' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">Greenwich Shellfish Commission</h3>
              <p className="text-sm" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                Managing shellfish resources and permits for the Town of Greenwich, Connecticut.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="/" className="transition-colors" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>Apply for Permit</a></li>
                <li><a href="/terms" className="transition-colors" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>Terms of Service</a></li>
                <li><a href="/admin/login" className="transition-colors" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>Admin Portal</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
              <div className="text-sm space-y-1" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                <p>Town of Greenwich</p>
                <p>101 Field Point Road</p>
                <p>Greenwich, CT 06830</p>
                <p>Phone: (203) 622-7700</p>
              </div>
            </div>
          </div>
          <div className="mt-8 pt-8 text-center text-sm" style={{ borderTop: '1px solid rgba(255, 255, 255, 0.2)', color: 'rgba(255, 255, 255, 0.6)' }}>
            <p>&copy; 2024 Town of Greenwich, Connecticut. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </>
  )
}


