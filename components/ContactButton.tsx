'use client';

import { useState } from 'react';

export default function ContactButton() {
  const [showOptions, setShowOptions] = useState(false);
  const email = "rhemaexpertsolutions@gmail.com";
  const subject = "Inquiry from Website";

  const handleGmailClick = () => {
    // Open Gmail compose in a new tab
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${email}&su=${encodeURIComponent(subject)}`;
    window.open(gmailUrl, '_blank');
  };

  const handleDefaultMailClick = () => {
    window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}`;
  };

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(email);
    alert('Email address copied to clipboard!');
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="flex flex-wrap justify-center gap-4">
        <button
          onClick={handleDefaultMailClick}
          className="inline-flex items-center justify-center bg-red-600 text-white text-lg font-bold px-8 py-4 rounded-xl hover:bg-red-700 transition-all transform hover:scale-105 shadow-xl"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          Open Mail App
        </button>

        <button
          onClick={handleGmailClick}
          className="inline-flex items-center justify-center bg-blue-600 text-white text-lg font-bold px-8 py-4 rounded-xl hover:bg-blue-700 transition-all transform hover:scale-105 shadow-xl"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          Open in Gmail Web
        </button>
      </div>

      <button
        onClick={handleCopyEmail}
        className="text-gray-500 hover:text-blue-600 underline text-sm mt-2"
      >
        Copy Email Address
      </button>
    </div>
  );
}
