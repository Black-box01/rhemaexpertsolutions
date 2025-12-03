"use client";

import Image from "next/image";
import Link from "next/link";

export default function VerificationSuccess() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-red-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-blue-700 to-red-600 p-6 text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
          <h1 className="text-2xl font-bold text-white">Verification Successful!</h1>
        </div>
        
        <div className="p-8 text-center">
          <div className="flex justify-center mb-6">
            <Image
              src="/logo.png"
              alt="Rhema Expert Solutions Logo"
              width={80}
              height={80}
              className="rounded-lg"
            />
          </div>
          
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Thank You for Verifying</h2>
          <p className="text-gray-600 mb-8">
            Your account has been successfully verified. You can now access all features of our School Management System.
          </p>
          
          <div className="bg-blue-50 rounded-lg p-4 mb-8">
            <p className="text-sm text-gray-700">
              <span className="font-semibold">Next Steps:</span> You will be automatically redirected to your dashboard shortly.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/dashboard" className="bg-blue-700 text-white px-6 py-3 rounded-lg hover:bg-blue-800 transition-colors font-medium text-center">
              Go to Dashboard
            </Link>
            <Link href="/" className="border-2 border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors font-medium text-center">
              Back to Home
            </Link>
          </div>
        </div>
        
        <div className="bg-gray-50 px-6 py-4 text-center">
          <p className="text-sm text-gray-600">
            Need help? Contact us at{' '}
            <a href="mailto:rhemaexpertsolutions@gmail.com" className="text-blue-600 hover:underline">
              rhemaexpertsolutions@gmail.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}