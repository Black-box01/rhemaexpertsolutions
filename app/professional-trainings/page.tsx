'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { submitProfessionalTrainingRegistration } from '@/app/actions/registration';
import Link from 'next/link';

export default function ProfessionalTrainingPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    gender: 'Male',
    date_of_birth: '',
    organization: '',
    job_title: '',
    training_program: 'AI: Deep Learning',
    preferred_schedule: 'Weekday Evenings',
    experience_level: 'Beginner',
    payment_preference: 'Full Payment',
    additional_info: ''
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
      const result = await submitProfessionalTrainingRegistration(formData);
      if (result.success) {
        setMessage({ type: 'success', text: 'Registration Successful! We will contact you shortly with payment details.' });
        setFormData({
          full_name: '',
          email: '',
          phone: '',
          gender: 'Male',
          date_of_birth: '',
          organization: '',
          job_title: '',
          training_program: 'AI: Deep Learning',
          preferred_schedule: 'Weekday Evenings',
          experience_level: 'Beginner',
          payment_preference: 'Full Payment',
          additional_info: ''
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

  const trainingPrograms = [
    'AI: Deep Learning',
    'AI: Machine Learning',
    'Power BI',
    'Data Science',
    'Data Analytics',
    'Cyber Security',
    'IoT'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 text-gray-800 font-sans">
      
      {/* Hero Header */}
      <header className="bg-gradient-to-r from-purple-900 via-blue-900 to-indigo-900 text-white py-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/img/pattern.png')] opacity-10 bg-repeat"></div>
        <div className="container mx-auto max-w-5xl relative z-10 text-center">
          <Link href="/" className="inline-block mb-6 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-full text-sm font-medium transition-colors border border-white/20">
             ← Back to Home
          </Link>
          <h1 className="text-4xl md:text-6xl font-extrabold mb-4 tracking-tight drop-shadow-md">
            PROFESSIONAL <br/> <span className="text-yellow-400">TRAININGS</span>
          </h1>
          <p className="text-xl md:text-2xl font-light text-blue-100 italic mb-6">Advance Your Career with Industry-Leading Skills</p>
          <div className="flex flex-wrap justify-center gap-3 mt-8">
            {trainingPrograms.map((program, idx) => (
              <span key={idx} className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium border border-white/20">
                {program}
              </span>
            ))}
          </div>
          <div className="mt-10">
            <a href="#register" className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-10 rounded-full shadow-lg transform hover:-translate-y-1 transition-all inline-block border-2 border-red-500">
              ENROLL NOW
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
              <h2 className="text-2xl font-bold text-blue-900 mb-4 border-b border-blue-100 pb-2">About Professional Trainings</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                <strong>RHEMA EXPERT SOLUTIONS</strong> offers cutting-edge professional training programs designed to equip you with in-demand skills in today's rapidly evolving tech landscape. 
                Our industry-expert instructors bring real-world experience to help you master complex concepts and advance your career.
              </p>
              <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-600">
                <p className="font-bold text-blue-800 mb-1">WHY CHOOSE US?</p>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>✓ Industry-certified instructors</li>
                  <li>✓ Hands-on practical projects</li>
                  <li>✓ Flexible scheduling (Weekday/Weekend options)</li>
                  <li>✓ Career support and mentorship</li>
                  <li>✓ Certificate of completion</li>
                </ul>
              </div>
            </section>

            {/* Training Programs */}
            <section className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <h3 className="text-xl font-bold text-blue-900 mb-6">Available Training Programs</h3>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl border border-purple-200">
                  <h4 className="font-bold text-purple-900 text-lg mb-2 flex items-center">
                    <span className="text-2xl mr-2">🤖</span> AI: Deep Learning
                  </h4>
                  <p className="text-purple-800 text-sm">Master neural networks, CNNs, RNNs, and advanced deep learning architectures.</p>
                </div>

                <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-200">
                  <h4 className="font-bold text-blue-900 text-lg mb-2 flex items-center">
                    <span className="text-2xl mr-2">🧠</span> AI: Machine Learning
                  </h4>
                  <p className="text-blue-800 text-sm">Learn supervised/unsupervised learning, algorithms, and practical ML applications.</p>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl border border-green-200">
                  <h4 className="font-bold text-green-900 text-lg mb-2 flex items-center">
                    <span className="text-2xl mr-2">📊</span> Power BI
                  </h4>
                  <p className="text-green-800 text-sm">Transform data into actionable insights with advanced visualization and reporting.</p>
                </div>

                <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-xl border border-orange-200">
                  <h4 className="font-bold text-orange-900 text-lg mb-2 flex items-center">
                    <span className="text-2xl mr-2">🔬</span> Data Science
                  </h4>
                  <p className="text-orange-800 text-sm">End-to-end data science: statistics, modeling, deployment, and real-world projects.</p>
                </div>

                <div className="bg-gradient-to-br from-teal-50 to-teal-100 p-6 rounded-xl border border-teal-200">
                  <h4 className="font-bold text-teal-900 text-lg mb-2 flex items-center">
                    <span className="text-2xl mr-2">📈</span> Data Analytics
                  </h4>
                  <p className="text-teal-800 text-sm">Master data analysis, visualization, and business intelligence tools.</p>
                </div>

                <div className="bg-gradient-to-br from-red-50 to-red-100 p-6 rounded-xl border border-red-200">
                  <h4 className="font-bold text-red-900 text-lg mb-2 flex items-center">
                    <span className="text-2xl mr-2">🔒</span> Cyber Security
                  </h4>
                  <p className="text-red-800 text-sm">Ethical hacking, penetration testing, network security, and threat analysis.</p>
                </div>

                <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 p-6 rounded-xl border border-indigo-200 md:col-span-2">
                  <h4 className="font-bold text-indigo-900 text-lg mb-2 flex items-center">
                    <span className="text-2xl mr-2">🌐</span> IoT (Internet of Things)
                  </h4>
                  <p className="text-indigo-800 text-sm">Build smart devices, sensor networks, and IoT applications with hands-on projects.</p>
                </div>
              </div>
            </section>

            {/* Training Details */}
            <section className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <h3 className="text-xl font-bold text-blue-900 mb-6">Training Details</h3>
              
              <div className="space-y-6">
                <div>
                  <h4 className="font-bold text-gray-800 mb-3">SCHEDULE OPTIONS</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <p className="font-semibold text-gray-800 mb-1">Weekday Evenings</p>
                      <p className="text-sm text-gray-600">Mon - Fri, 6:00 PM - 9:00 PM</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <p className="font-semibold text-gray-800 mb-1">Weekend Classes</p>
                      <p className="text-sm text-gray-600">Sat - Sun, 9:00 AM - 4:00 PM</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-bold text-gray-800 mb-3">EXPERIENCE LEVELS</h4>
                  <div className="space-y-2">
                    <div className="flex items-center bg-green-50 p-3 rounded border border-green-200">
                      <span className="bg-green-200 text-green-800 font-bold px-3 py-1 rounded text-xs mr-3">BEGINNER</span>
                      <span className="text-sm text-gray-700">No prior experience required</span>
                    </div>
                    <div className="flex items-center bg-blue-50 p-3 rounded border border-blue-200">
                      <span className="bg-blue-200 text-blue-800 font-bold px-3 py-1 rounded text-xs mr-3">INTERMEDIATE</span>
                      <span className="text-sm text-gray-700">Basic knowledge in the field</span>
                    </div>
                    <div className="flex items-center bg-purple-50 p-3 rounded border border-purple-200">
                      <span className="bg-purple-200 text-purple-800 font-bold px-3 py-1 rounded text-xs mr-3">ADVANCED</span>
                      <span className="text-sm text-gray-700">Professional experience recommended</span>
                    </div>
                  </div>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 p-6 rounded-lg">
                  <h4 className="font-bold text-yellow-800 mb-2 flex items-center">
                    <span className="text-2xl mr-2">💰</span> PAYMENT OPTIONS
                  </h4>
                  <ul className="text-sm text-yellow-800 space-y-1">
                    <li>• <strong>Full Payment:</strong> Pay upfront and get 10% discount</li>
                    <li>• <strong>Installment Plan:</strong> Split into 2-3 payments</li>
                    <li>• <strong>Corporate Sponsorship:</strong> Special rates for organizations</li>
                  </ul>
                </div>
              </div>
            </section>
            
            {/* Benefits */}
            <section className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-100">
              <h4 className="font-bold text-blue-900 mb-3 flex items-center">
                <span className="text-2xl mr-2">🎓</span> WHAT YOU'LL GET
              </h4>
              <div className="grid md:grid-cols-2 gap-3 text-sm text-blue-800">
                <div className="flex items-start">
                  <span className="text-green-600 mr-2">✓</span>
                  <span>Industry-recognized certificate</span>
                </div>
                <div className="flex items-start">
                  <span className="text-green-600 mr-2">✓</span>
                  <span>Hands-on project portfolio</span>
                </div>
                <div className="flex items-start">
                  <span className="text-green-600 mr-2">✓</span>
                  <span>Career guidance & mentorship</span>
                </div>
                <div className="flex items-start">
                  <span className="text-green-600 mr-2">✓</span>
                  <span>Lifetime access to course materials</span>
                </div>
                <div className="flex items-start">
                  <span className="text-green-600 mr-2">✓</span>
                  <span>Networking opportunities</span>
                </div>
                <div className="flex items-start">
                  <span className="text-green-600 mr-2">✓</span>
                  <span>Job placement assistance</span>
                </div>
              </div>
            </section>

          </div>

          {/* Registration Form Column */}
          <div className="md:col-span-1">
            <div className="bg-white p-6 rounded-2xl shadow-xl border border-purple-100 sticky top-24" id="register">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-purple-900">Enroll Now</h3>
                <p className="text-purple-600 font-bold uppercase text-sm tracking-wide mt-1">Secure Your Spot</p>
                <p className="text-xs text-gray-500 mt-2">Limited seats available per batch</p>
              </div>

              {message.text && (
                <div className={`p-4 rounded-lg mb-6 text-sm ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {message.text}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Full Name *</label>
                  <input required name="full_name" value={formData.full_name} onChange={handleChange} type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all text-sm" placeholder="Your full name" />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Email Address *</label>
                  <input required name="email" value={formData.email} onChange={handleChange} type="email" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all text-sm" placeholder="your.email@example.com" />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Phone Number *</label>
                  <input required name="phone" value={formData.phone} onChange={handleChange} type="tel" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all text-sm" placeholder="+234 800 000 0000" />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Gender</label>
                    <select required name="gender" value={formData.gender} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none text-sm">
                      <option>Male</option>
                      <option>Female</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Date of Birth</label>
                    <input name="date_of_birth" value={formData.date_of_birth} onChange={handleChange} type="date" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none text-sm" />
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-100">
                  <p className="text-xs font-bold text-gray-400 uppercase mb-3">Professional Information</p>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Organization/Company</label>
                      <input name="organization" value={formData.organization} onChange={handleChange} type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none text-sm" placeholder="Your current employer (Optional)" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Job Title</label>
                      <input name="job_title" value={formData.job_title} onChange={handleChange} type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none text-sm" placeholder="e.g. Software Engineer (Optional)" />
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-100">
                  <p className="text-xs font-bold text-gray-400 uppercase mb-3">Training Preferences</p>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Training Program *</label>
                      <select required name="training_program" value={formData.training_program} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none text-sm">
                        {trainingPrograms.map(program => (
                          <option key={program} value={program}>{program}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Preferred Schedule *</label>
                      <select required name="preferred_schedule" value={formData.preferred_schedule} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none text-sm">
                        <option>Weekday Evenings</option>
                        <option>Weekend Classes</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Experience Level *</label>
                      <select required name="experience_level" value={formData.experience_level} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none text-sm">
                        <option>Beginner</option>
                        <option>Intermediate</option>
                        <option>Advanced</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Payment Preference *</label>
                      <select required name="payment_preference" value={formData.payment_preference} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none text-sm">
                        <option>Full Payment</option>
                        <option>Installment Plan</option>
                        <option>Corporate Sponsorship</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Additional Information</label>
                      <textarea name="additional_info" value={formData.additional_info} onChange={handleChange} rows={3} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none text-sm" placeholder="Any questions or special requirements?" />
                    </div>
                  </div>
                </div>

                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className={`w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold py-3 rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Registration'}
                </button>
                <p className="text-xs text-center text-gray-500 mt-2">We'll contact you with payment details within 24 hours.</p>
              </form>
            </div>
          </div>

        </div>
      </main>
      
      <footer className="bg-gray-900 text-gray-400 py-8 text-center text-sm">
        <div className="container mx-auto">
          <p className="mb-2">RHEMA EXPERT SOLUTIONS</p>
          <p>Empowering professionals with cutting-edge skills</p>
        </div>
      </footer>
    </div>
  );
}
