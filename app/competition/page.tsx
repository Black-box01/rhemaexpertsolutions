'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { submitRegistration } from '@/app/actions/registration';
import Link from 'next/link';

export default function CompetitionPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    full_name: '',
    gender: 'Male',
    date_of_birth: '',
    age: '',
    school_name: '',
    school_address: '',
    school_phone: '',
    class_level: '',
    category: 'LOWER PRIMARY',
    parent_name: '',
    parent_phone: '',
    parent_email: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage({ type: '', text: '' });

    try {
      const result = await submitRegistration(formData);
      if (result.success) {
        setMessage({ type: 'success', text: 'Registration Successful! We will contact you shortly.' });
        setFormData({
          full_name: '',
          gender: 'Male',
          date_of_birth: '',
          age: '',
          school_name: '',
          school_address: '',
          school_phone: '',
          class_level: '',
          category: 'LOWER PRIMARY',
          parent_name: '',
          parent_phone: '',
          parent_email: ''
        });
        window.scrollTo(0, 0);
      } else {
        setMessage({ type: 'error', text: result.error || 'Registration failed. Please try again.' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'An unexpected error occurred.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans">
      
      {/* Hero Header */}
      <header className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white py-16 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/img/pattern.png')] opacity-10 bg-repeat"></div>
        <div className="container mx-auto max-w-5xl relative z-10 text-center">
          <Link href="/" className="inline-block mb-6 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-full text-sm font-medium transition-colors border border-white/20">
             ← Back to Home
          </Link>
          <h1 className="text-4xl md:text-6xl font-extrabold mb-4 tracking-tight drop-shadow-md">
            SMART CODERS <br/> <span className="text-yellow-400">NATIONAL COMPETITION</span>
          </h1>
          <p className="text-xl md:text-2xl font-light text-blue-100 italic">"I CAN CODE"</p>
          <div className="mt-8">
            <a href="#register" className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded-full shadow-lg transform hover:-translate-y-1 transition-all inline-block border-2 border-red-500">
              REGISTER FOR FREE
            </a>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12 max-w-6xl">
        
        <div className="grid md:grid-cols-3 gap-12">
          
          {/* Information Column */}
          <div className="md:col-span-2 space-y-10">
            
            {/* Introduction */}
            <section className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <h2 className="text-2xl font-bold text-blue-900 mb-4 border-b border-blue-100 pb-2">About The Competition</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                <strong>SMART CODERS NATIONAL COMPETITION</strong> is an annual competition organized by <strong>RHEMA EXPERT SOLUTIONS</strong>. 
                The competition is open for scholars in Nigerian Primary and Secondary Schools both public and private, throughout the federation.
              </p>
              <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-600">
                <p className="font-bold text-blue-800 mb-1">NOTE:</p>
                <p className="text-sm text-blue-700">No nepotism, No racism, No ethnicity, No discrimination, No favoritism of any kind, Selection(award) is by <strong>MERIT</strong>.</p>
              </div>
            </section>

            {/* Aim & Objectives */}
            <section className="grid md:grid-cols-2 gap-6">
              <div className="bg-indigo-50 p-6 rounded-xl border border-indigo-100">
                <h3 className="font-bold text-indigo-900 text-lg mb-3 flex items-center">
                  <span className="bg-indigo-200 p-1 rounded mr-2">🎯</span> AIM
                </h3>
                <p className="text-indigo-800">To build a generation with outstanding knowledge of ICT.</p>
              </div>
              <div className="bg-green-50 p-6 rounded-xl border border-green-100">
                <h3 className="font-bold text-green-900 text-lg mb-3 flex items-center">
                  <span className="bg-green-200 p-1 rounded mr-2">🚀</span> OBJECTIVES
                </h3>
                <p className="text-green-800 text-sm">
                  Preparing scholars to solve problems, think critically, work collaboratively and creatively function in a digital and information-driven world, apply digital and ICT skills and transfer these skills to solve everyday problems and its possibilities.
                </p>
              </div>
            </section>

            {/* Principles & Details */}
            <section className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <h3 className="text-xl font-bold text-blue-900 mb-6">Competition Details</h3>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h4 className="font-bold text-gray-800 mb-2 border-b border-gray-100 pb-1">PRINCIPLES</h4>
                  <ul className="list-disc list-inside text-gray-600 space-y-1 text-sm">
                    <li>Social transformation</li>
                    <li>Active and critical skills</li>
                    <li>High knowledge and high skill</li>
                    <li>Progression</li>
                  </ul>
                </div>

                <div>
                   <h4 className="font-bold text-gray-800 mb-2 border-b border-gray-100 pb-1">CATEGORY</h4>
                   <ul className="space-y-2 text-sm">
                     <li className="flex justify-between bg-gray-50 p-2 rounded">
                       <span className="font-medium">LOWER PRIMARY</span>
                       <span className="text-gray-500">Primary 1 – 3 (Age 5-7)</span>
                     </li>
                     <li className="flex justify-between bg-gray-50 p-2 rounded">
                       <span className="font-medium">UPPER PRIMARY</span>
                       <span className="text-gray-500">Primary 4 – 6 (Age 8-11)</span>
                     </li>
                   </ul>
                </div>
              </div>

              <div className="mt-8 space-y-6">
                <div>
                  <h4 className="font-bold text-gray-800 mb-2">STAGES OF TEST</h4>
                  <div className="space-y-3">
                    <div className="flex items-start">
                      <div className="bg-blue-100 text-blue-800 font-bold px-2 py-1 rounded text-xs mr-3 mt-1">STAGE 1</div>
                      <div>
                        <p className="font-semibold text-gray-800">Online Test</p>
                        <p className="text-sm text-gray-600">Candidates will write an online test. Test portal is compatible with any digital device: mobile phones, laptops, desktop computers, etc.</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="bg-purple-100 text-purple-800 font-bold px-2 py-1 rounded text-xs mr-3 mt-1">STAGE 2</div>
                      <div>
                        <p className="font-semibold text-gray-800">Final Test</p>
                        <p className="text-sm text-gray-600">Candidates who passed stage 1, will be invited to a slated venue for the final test.</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                   <h4 className="font-bold text-gray-800 mb-2">SELECTION CRITERIA & PRIZES</h4>
                   <p className="text-sm text-gray-600 mb-2">
                     Selection is strictly by merit based on speed, accuracy and highest point. Award given to the very best CODERS (1ST, 2ND & 3RD).
                     In case of ties, submission time determines the winner.
                   </p>
                   <p className="text-sm text-gray-600 mb-4">
                     <strong>Project Evaluation Criteria:</strong> Algorithms, Animation, Actors, Code Environment, Code Integration and Sequence, Demonstration & Interpretation and Presentation.
                   </p>
                   <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
                     <p className="font-bold text-yellow-800 flex items-center">
                       <span className="text-2xl mr-2">🏆</span> PRIZES TO WIN: Cash, Awards, Medals, etc.
                     </p>
                   </div>
                </div>
              </div>
            </section>
            
            {/* Disqualification */}
            <section className="bg-red-50 p-6 rounded-xl border border-red-100 text-red-800 text-sm">
              <h4 className="font-bold mb-2 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                DISQUALIFICATION
              </h4>
              <p>Candidate would be disqualified based on: False declaration of age, class or school and any form of exam malpractice.</p>
            </section>

          </div>

          {/* Registration Form Column */}
          <div className="md:col-span-1">
            <div className="bg-white p-6 rounded-2xl shadow-xl border border-blue-100 sticky top-24" id="register">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-blue-900">Register Now</h3>
                <p className="text-green-600 font-bold uppercase text-sm tracking-wide mt-1">Registration is Free</p>
                <p className="text-xs text-gray-500 mt-2">Registration is online for a duration of two weeks</p>
              </div>

              {message.text && (
                <div className={`p-4 rounded-lg mb-6 text-sm ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {message.text}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Full Name</label>
                  <input required name="full_name" value={formData.full_name} onChange={handleChange} type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm" placeholder="Student's Name" />
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Gender</label>
                    <select required name="gender" value={formData.gender} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm">
                      <option>Male</option>
                      <option>Female</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Age</label>
                    <input required name="age" value={formData.age} onChange={handleChange} type="number" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm" placeholder="Age" />
                  </div>
                </div>

                <div>
                   <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Date of Birth</label>
                   <input required name="date_of_birth" value={formData.date_of_birth} onChange={handleChange} type="date" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm" />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">School Name</label>
                  <input required name="school_name" value={formData.school_name} onChange={handleChange} type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm" placeholder="Current School" />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">School Address</label>
                  <input name="school_address" value={formData.school_address} onChange={handleChange} type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm" placeholder="City, State" />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">School Phone Number</label>
                  <input name="school_phone" value={formData.school_phone} onChange={handleChange} type="tel" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm" placeholder="Official School Contact" />
                </div>

                <div className="grid grid-cols-2 gap-3">
                   <div>
                     <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Class</label>
                     <input required name="class_level" value={formData.class_level} onChange={handleChange} type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm" placeholder="e.g. Primary 4" />
                   </div>
                   <div>
                     <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Category</label>
                     <select required name="category" value={formData.category} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm">
                       <option value="LOWER PRIMARY">Lower Primary (P1-3)</option>
                       <option value="UPPER PRIMARY">Upper Primary (P4-6)</option>
                     </select>
                   </div>
                </div>

                <div className="pt-4 border-t border-gray-100">
                  <p className="text-xs font-bold text-gray-400 uppercase mb-3">Parent/Guardian Info</p>
                  <div className="space-y-3">
                    <div>
                      <input required name="parent_name" value={formData.parent_name} onChange={handleChange} type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm" placeholder="Parent's Name" />
                    </div>
                    <div>
                      <input required name="parent_phone" value={formData.parent_phone} onChange={handleChange} type="tel" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm" placeholder="Phone Number" />
                    </div>
                    <div>
                      <input name="parent_email" value={formData.parent_email} onChange={handleChange} type="email" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm" placeholder="Email (Optional)" />
                    </div>
                  </div>
                </div>

                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className={`w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold py-3 rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Registration'}
                </button>
                <p className="text-xs text-center text-gray-500 mt-2">By registering, you agree to the competition rules.</p>
              </form>
            </div>
          </div>

        </div>
      </main>
      
      <footer className="bg-gray-900 text-gray-400 py-8 text-center text-sm">
        <div className="container mx-auto">
          <p className="mb-2">RHEMA EXPERT SOLUTIONS</p>
          <p>Sponsorship is open to private individuals and organizations.</p>
        </div>
      </footer>
    </div>
  );
}
