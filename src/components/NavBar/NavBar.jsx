import React from "react";
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import * as NavigationMenu from '@radix-ui/react-navigation-menu';
import * as Avatar from '@radix-ui/react-avatar';
import "./NavBar.css";

function NavBar() {
  const { user, logout } = useAuth();

  return (
    <nav className="fixed border-b border-zinc-900 top-0 w-full backdrop-blur-md bg-background-light/75 dark:bg-background-dark/75 text-text-light dark:text-text-dark p-2 border-accent-light/20 dark:border-accent-dark/20 z-50 shadow-sm">
      <div className="container mx-auto px-4">
        <NavigationMenu.Root className="relative flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-2xl text-zinc-200 font-extrabold">
              {/* StudyVerse */}
              <img src="/svlogow.png" className="w-9"></img>
            </Link>
            
            {user && (
              <div className="ml-8 flex space-x-4">
                <Link
                  to="/dashboard"
                  className="text-gray-300 hover:text-white px-3 py-2 rounded-md"
                >
                  Dashboard
                </Link>
                <Link
                  to="/questions"
                  className="text-gray-300 hover:text-white px-3 py-2 rounded-md"
                >
                  AI Tests
                </Link>
                <Link
                  to="/ai-bot"
                  className="text-gray-300 hover:text-white px-3 py-2 rounded-md"
                >
                  AI Bot
                </Link>
              </div>
            )}
          </div>

          {user ? (
            <div className="flex items-center space-x-4">
              <Link to="/account">
                <Avatar.Root className="flex items-center space-x-2">
                  <Avatar.Image
                    src={user.profilePicture || '/default-avatar.png'}
                    className="w-8 h-8 rounded-full"
                  />
                  <Avatar.Fallback className="w-8 h-8 rounded-full bg-[#5e41de5c] flex items-center justify-center">
                    {user.name[0]}
                  </Avatar.Fallback>
                  <span className="text-gray-300">{user.name}</span>
                </Avatar.Root>
              </Link>
              <button
                onClick={logout}
                className="text-gray-300 hover:text-white px-3 py-2 rounded-md"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex space-x-4">
              <Link
                to="/login"
                className="text-gray-300 hover:text-white px-3 py-2 rounded-md"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="bg-blue-600 text-white px-3 py-2 rounded-md hover:bg-blue-700"
              >
                Sign Up
              </Link>
            </div>
          )}
        </NavigationMenu.Root>
      </div>
    </nav>
  );
}

export default NavBar;
