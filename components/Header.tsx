'use client';

import { useState } from 'react';
import Link from 'next/link';
import ImageWithSkeleton from './ImageWithSkeleton';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isTrainingDropdownOpen, setIsTrainingDropdownOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
    setIsTrainingDropdownOpen(false);
  };

  const toggleTrainingDropdown = () => {
    setIsTrainingDropdownOpen(!isTrainingDropdownOpen);
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo Area */}
        <div className="flex items-center space-x-2">
          <ImageWithSkeleton
            src="/logo.png"
            alt="Rhema Expert Solutions Logo"
            width={50}
            height={50}
            className="rounded-lg"
          />
          <h1 className="text-sm font-bold text-blue-900 sm:text-xl">Rhema Expert Solutions</h1>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:block">
          <ul className="flex space-x-6 text-sm font-medium">
            <li><a href="#home" className="text-blue-900 hover:text-red-600 transition-colors">Home</a></li>
            <li><a href="#about" className="text-blue-900 hover:text-red-600 transition-colors">About</a></li>
            <li><a href="#services" className="text-blue-900 hover:text-red-600 transition-colors">Services</a></li>
            <li><a href="#projects" className="text-blue-900 hover:text-red-600 transition-colors">Projects</a></li>
            
            {/* Training Dropdown */}
            <li 
              className="relative group"
              onMouseEnter={() => setIsTrainingDropdownOpen(true)}
              onMouseLeave={() => setIsTrainingDropdownOpen(false)}
            >
              <button className="text-blue-900 hover:text-red-600 transition-colors font-semibold flex items-center">
                Trainings
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {/* Dropdown Menu */}
              <div className={`absolute top-full left-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-100 py-2 z-50 transition-all duration-200 ${isTrainingDropdownOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2'}`}>
                <a 
                  href="/coding-classes" 
                  className="block px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                >
                  <div className="font-semibold">Coding Classes</div>
                  <div className="text-xs text-gray-500 mt-1">For students: Scratch, Python, HTML/CSS/JS, Roblox, React & more</div>
                </a>
                <a 
                  href="/professional-trainings" 
                  className="block px-4 py-3 text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition-colors"
                >
                  <div className="font-semibold">Professional Trainings</div>
                  <div className="text-xs text-gray-500 mt-1">AI, Machine Learning, Power BI, Data Science, Cyber Security & IoT</div>
                </a>
              </div>
            </li>
            
            <li><a href="#competitions" className="text-red-600 hover:text-blue-900 transition-colors animate-pulse">Competitions</a></li>
            <li className="ml-auto"><a href="#contact" className="text-blue-900 hover:text-red-600 transition-colors">Contact</a></li>
            <li>
              <a 
                href="https://web.facebook.com/profile.php?id=100092432334656" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center text-blue-900 hover:text-red-600 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-5 h-5 fill-current mr-1">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                Facebook
              </a>
            </li>
          </ul>
        </nav>

        {/* Mobile Menu Button & CBT Button */}
        <div className="flex items-center space-x-4">
           <a 
            href="https://cbt.rhemaexpertsolutions.com/" 
            target="_blank"
            rel="noopener noreferrer"
            className="bg-red-600 text-white px-3 py-2 rounded-lg hover:bg-red-700 transition-colors font-bold shadow-md text-sm hidden xs:block"
          >
            CBT Exam
          </a>

          {/* Hamburger Icon */}
          <button 
            onClick={toggleMenu} 
            className="md:hidden text-blue-900 hover:text-red-600 focus:outline-none"
            aria-label="Toggle menu"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Sidebar/Drawer */}
      {/* Overlay */}
      <div 
        className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 md:hidden ${isMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={closeMenu}
      ></div>

      {/* Sidebar Content */}
      <div 
        className={`fixed top-0 right-0 h-full w-64 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out md:hidden ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="p-5 flex justify-between items-center border-b border-gray-100">
          <h2 className="text-lg font-bold text-blue-900">Menu</h2>
          <button onClick={closeMenu} className="text-gray-500 hover:text-red-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="p-5 flex flex-col space-y-4">
          <a href="#home" onClick={closeMenu} className="text-lg font-medium text-gray-800 hover:text-blue-600 border-b border-gray-50 pb-2">Home</a>
          <a href="#about" onClick={closeMenu} className="text-lg font-medium text-gray-800 hover:text-blue-600 border-b border-gray-50 pb-2">About</a>
          <a href="#services" onClick={closeMenu} className="text-lg font-medium text-gray-800 hover:text-blue-600 border-b border-gray-50 pb-2">Services</a>
          <a href="#projects" onClick={closeMenu} className="text-lg font-medium text-gray-800 hover:text-blue-600 border-b border-gray-50 pb-2">Projects</a>
          
          {/* Training Section in Mobile */}
          <div className="border-b border-gray-50 pb-2">
            <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">Training Programs</p>
            <a href="/coding-classes" onClick={closeMenu} className="block text-lg font-medium text-blue-900 hover:text-blue-600 pl-4 py-1 border-l-2 border-blue-200 ml-2">
              Coding Classes
              <span className="block text-xs text-gray-500 mt-1">For students</span>
            </a>
            <a href="/professional-trainings" onClick={closeMenu} className="block text-lg font-medium text-purple-600 hover:text-purple-800 pl-4 py-1 border-l-2 border-purple-200 ml-2 mt-2">
              Professional Trainings
              <span className="block text-xs text-gray-500 mt-1">AI, Data Science, Cyber Security & more</span>
            </a>
          </div>
          
          <a href="#competitions" onClick={closeMenu} className="text-lg font-medium text-red-600 hover:text-blue-900 border-b border-gray-50 pb-2">Competitions</a>
          <hr className="my-2 border-gray-200" />
          <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Connect</p>
          <a href="#contact" onClick={closeMenu} className="text-lg font-medium text-gray-800 hover:text-blue-600 border-b border-gray-50 pb-2">Contact</a>
          <a 
            href="https://web.facebook.com/profile.php?id=100092432334656" 
            target="_blank" 
            rel="noopener noreferrer" 
            onClick={closeMenu}
            className="text-lg font-medium text-blue-800 hover:text-blue-600 border-b border-gray-50 pb-2 flex items-center"
          >
             <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-5 h-5 fill-current mr-2">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            Facebook
          </a>
          <div className="pt-4">
             <a 
              href="https://cbt.rhemaexpertsolutions.com/" 
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full bg-red-600 text-white px-4 py-3 rounded-lg hover:bg-red-700 transition-colors font-bold text-center shadow-md"
            >
              Start CBT Exam
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}