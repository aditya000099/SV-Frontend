'use client';

import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export function Navbar() {
  const { isAuthenticated, logout } = useAuth();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gray-900 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link href="/" className="text-xl font-bold">
            Your App
          </Link>
          
          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <Button
                onClick={logout}
                variant="ghost"
                className="text-white hover:bg-gray-800"
              >
                Logout
              </Button>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" className="text-white hover:bg-gray-800">
                    Login
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button className="bg-white text-gray-900 hover:bg-gray-100">
                    Sign Up
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
} 