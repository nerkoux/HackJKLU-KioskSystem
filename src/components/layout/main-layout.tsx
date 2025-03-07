import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useSession } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Determine where the "Home" link should point
  const homeLink = status === 'authenticated' ? '/home' : '/';
  
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };
  
  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 text-white">
      <header className="border-b border-slate-700 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href={homeLink} onClick={closeMobileMenu}>
            <div className="flex items-center space-x-2">
              <motion.div
                initial={{ rotate: 0 }}
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"
              />
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
                CareerKiosk AI
              </span>
            </div>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:block">
            <ul className="flex space-x-6">
              <li>
                <Link href={homeLink} className={`hover:text-blue-400 transition-colors ${pathname === homeLink ? 'text-blue-400' : ''}`}>
                  Home
                </Link>
              </li>
              {status === 'authenticated' && (
                <>
                  <li>
                    <Link href="/assessment" className={`hover:text-blue-400 transition-colors ${pathname === '/assessment' ? 'text-blue-400' : ''}`}>
                      Assessment
                    </Link>
                  </li>
                  <li>
                    <Link href="/consultation" className={`hover:text-blue-400 transition-colors ${pathname === '/consultation' ? 'text-blue-400' : ''}`}>
                      Consultation
                    </Link>
                  </li>
                  <li>
                    <Link href="/profile" className={`hover:text-blue-400 transition-colors ${pathname === '/profile' ? 'text-blue-400' : ''}`}>
                      Profile
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </nav>
          
          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-white focus:outline-none"
            onClick={toggleMobileMenu}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
        
        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-slate-800 border-t border-slate-700"
          >
            <ul className="flex flex-col py-4">
              <li className="py-2 px-4">
                <Link 
                  href={homeLink} 
                  className={`block hover:text-blue-400 transition-colors ${pathname === homeLink ? 'text-blue-400' : ''}`}
                  onClick={closeMobileMenu}
                >
                  Home
                </Link>
              </li>
              {status === 'authenticated' && (
                <>
                  <li className="py-2 px-4">
                    <Link 
                      href="/assessment" 
                      className={`block hover:text-blue-400 transition-colors ${pathname === '/assessment' ? 'text-blue-400' : ''}`}
                      onClick={closeMobileMenu}
                    >
                      Assessment
                    </Link>
                  </li>
                  <li className="py-2 px-4">
                    <Link 
                      href="/consultation" 
                      className={`block hover:text-blue-400 transition-colors ${pathname === '/consultation' ? 'text-blue-400' : ''}`}
                      onClick={closeMobileMenu}
                    >
                      Consultation
                    </Link>
                  </li>
                  <li className="py-2 px-4">
                    <Link 
                      href="/profile" 
                      className={`block hover:text-blue-400 transition-colors ${pathname === '/profile' ? 'text-blue-400' : ''}`}
                      onClick={closeMobileMenu}
                    >
                      Profile
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </motion.div>
        )}
      </header>
      
      <main className="pb-16">
        {children}
      </main>
      
      <footer className="bg-slate-900 border-t border-slate-800 py-6 px-4">
        <div className="container mx-auto text-center text-sm text-slate-400">
          <p>© {new Date().getFullYear()} CareerKiosk AI. All rights reserved.</p>
          <p className="mt-2">Powered by AI to help you find your perfect career path.</p>
        </div>
      </footer>
    </div>
  );
}