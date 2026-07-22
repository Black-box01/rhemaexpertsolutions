'use client';

import { useState } from 'react';
import Link from 'next/link';
import { submitCodingClassRegistration } from '@/app/actions/coding-classes';

const AVAILABLE_COURSES = [
  { id: 'scratch', name: 'Scratch Programming', icon: '🧩', description: 'Visual block-based coding for beginners' },
  { id: 'python', name: 'Python Programming', icon: '🐍', description: 'Powerful language for all skill levels' },
  { id: 'html', name: 'HTML', icon: '🌐', description: 'Build the structure of web pages' },
  { id: 'css', name: 'CSS', icon: '🎨', description: 'Style and design beautiful websites' },
  { id: 'javascript', name: 'JavaScript', icon: '⚡', description: 'Add interactivity to websites and apps' },
  { id: 'roblox', name: 'Roblox Development', icon: '🎮', description: 'Create games and experiences on Roblox' },
  { id: 'react-native', name: 'React Native', icon: '📱', description: 'Build cross-platform mobile apps' },
  { id: 'react-js', name: 'React JS', icon: '⚛️', description: 'Modern frontend web development' },
  { id: 'next-js', name: 'Next JS', icon: '▲', description: 'Full-stack React framework' },
  { id: 'robotics', name: 'Robotics', icon: '🤖', description: 'Build and program physical robots' },
];

const PAYMENT_PLANS = [
  { id: 'per_hour', name: 'Per Hour', description: 'Pay for each session individually', price: 'Flexible' },
  { id: 'weekly', name: 'Weekly', description: 'Fixed weekly payment plan', price: 'Best for short-term' },
  { id: 'monthly', name: 'Monthly', description: 'Monthly subscription package', price: 'Best value' },
];

export default function CodingClassesPage() {
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    age: '',
    gender: '',
    courses: [] as string[],
    payment_plan: '',
    experience_level: 'beginner',
    preferred_start_date: '',
    notes: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const toggleCourse = (courseId: string) => {
    setFormData(prev => {
      const courses = prev.courses.includes(courseId)
        ? prev.courses.filter(c => c !== courseId)
        : [...prev.courses, courseId];
      return { ...prev, courses };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage({ type: '', text: '' });

    try {
      const result = await submitCodingClassRegistration(formData);
      if (result.success) {
        setMessage({ type: 'success', text: 'Registration Successful! We will contact you shortly to confirm your classes.' });
        setFormData({
          full_name: '',
          email: '',
          phone: '',
          age: '',
          gender: '',
          courses: [],
          payment_plan: '',
          experience_level: 'beginner',
          preferred_start_date: '',
          notes: ''
        });
        window.scrollTo(0, 0);
      } else {
        setMessage({ type: 'error', text: result.error || 'Registration failed. Please try again.' });
      }
    } catch {
      setMessage({ type: 'error', text: 'An unexpected error occurred.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans">
      {/* Hero Header */}
      <header className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white py-16 px-4 relative overflow-hidden">
        <div className="container mx-auto max-w-5xl relative z-10 text-center">
          <Link href="/" className="inline-block mb-6 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-full text-sm font-medium transition-colors border border-white/20">
            ← Back to Home
          </Link>
          <h1 className="text-4xl md:text-6xl font-extrabold mb-4 tracking-tight drop-shadow-md">
            Online <span className="text-yellow-400">Coding Classes</span>
          </h1>
          <p className="text-xl md:text-2xl font-light text-blue-100">
            Learn to code from anywhere in the world
          </p>
          <div className="mt-8">
            <a href="#register" className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded-full shadow-lg transform hover:-translate-y-1 transition-all inline-block border-2 border-red-500">
              Register Now
            </a>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12 max-w-6xl">
        <div className="grid lg:grid-cols-5 gap-12">
          {/* Information Column */}
          <div className="lg:col-span-3 space-y-10">
            {/* Introduction */}
            <section className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <h2 className="text-2xl font-bold text-blue-900 mb-4 border-b border-blue-100 pb-2">About Our Coding Classes</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                <strong>RHEMA EXPERT SOLUTIONS</strong> offers structured, instructor-led online coding classes designed for students of all ages. Whether you are a complete beginner or looking to advance your skills, our expert instructors will guide you through hands-on projects and real-world applications.
              </p>
              <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-600">
                <p className="font-bold text-blue-800 mb-1">Why Choose Us?</p>
                <ul className="text-sm text-blue-700 space-y-1 mt-2">
                  <li>• Live interactive online sessions</li>
                  <li>• Experienced STEM-certified instructors</li>
                  <li>• Project-based learning approach</li>
                  <li>• Flexible payment plans</li>
                  <li>• Certificate of completion</li>
                </ul>
              </div>
            </section>

            {/* Available Courses */}
            <section className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <h3 className="text-xl font-bold text-blue-900 mb-6">Available Courses</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                {AVAILABLE_COURSES.map((course) => (
                  <div key={course.id} className="bg-gray-50 p-4 rounded-xl border border-gray-100 hover:border-blue-200 hover:bg-blue-50/50 transition-all">
                    <div className="flex items-center mb-2">
                      <span className="text-2xl mr-3">{course.icon}</span>
                      <h4 className="font-bold text-gray-900">{course.name}</h4>
                    </div>
                    <p className="text-sm text-gray-600">{course.description}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Payment Plans */}
            <section className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <h3 className="text-xl font-bold text-blue-900 mb-6">Flexible Payment Plans</h3>
              <div className="grid sm:grid-cols-3 gap-4">
                {PAYMENT_PLANS.map((plan) => (
                  <div key={plan.id} className="bg-gradient-to-br from-blue-50 to-white p-5 rounded-xl border border-blue-100 text-center hover:shadow-md transition-all">
                    <h4 className="font-bold text-blue-900 text-lg">{plan.name}</h4>
                    <p className="text-sm text-gray-600 mt-2">{plan.description}</p>
                    <span className="inline-block mt-3 bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1 rounded-full">{plan.price}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* How It Works */}
            <section className="bg-indigo-50 p-8 rounded-2xl border border-indigo-100">
              <h3 className="text-xl font-bold text-indigo-900 mb-6">How It Works</h3>
              <div className="space-y-4">
                {[
                  { step: '1', title: 'Register Online', desc: 'Fill out the registration form with your preferred courses and payment plan.' },
                  { step: '2', title: 'Get Contacted', desc: 'Our team will reach out to confirm your schedule and provide payment details.' },
                  { step: '3', title: 'Start Learning', desc: 'Join live online classes and begin your coding journey with expert guidance.' },
                ].map((item) => (
                  <div key={item.step} className="flex items-start">
                    <div className="bg-indigo-600 text-white font-bold w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mr-4 text-sm">
                      {item.step}
                    </div>
                    <div>
                      <h4 className="font-bold text-indigo-900">{item.title}</h4>
                      <p className="text-sm text-indigo-800">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Registration Form Column */}
          <div className="lg:col-span-2">
            <div className="bg-white p-6 rounded-2xl shadow-xl border border-blue-100 sticky top-24" id="register">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-blue-900">Register for Classes</h3>
                <p className="text-gray-500 text-sm mt-1">Fill the form below and we will contact you</p>
              </div>

              {message.text && (
                <div className={`p-4 rounded-lg mb-6 text-sm ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {message.text}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Full Name */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Full Name *</label>
                  <input
                    required
                    name="full_name"
                    value={formData.full_name}
                    onChange={handleChange}
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm"
                    placeholder="Your full name"
                  />
                </div>

                {/* Email & Phone */}
                <div className="grid grid-cols-1 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Email</label>
                    <input
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      type="email"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                      placeholder="your@email.com"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Phone Number *</label>
                    <input
                      required
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      type="tel"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                      placeholder="+234..."
                    />
                  </div>
                </div>

                {/* Age & Gender */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Age</label>
                    <input
                      name="age"
                      value={formData.age}
                      onChange={handleChange}
                      type="number"
                      min="5"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                      placeholder="Age"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Gender</label>
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                    >
                      <option value="">Select</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                {/* Experience Level */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Experience Level</label>
                  <select
                    name="experience_level"
                    value={formData.experience_level}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                  >
                    <option value="beginner">Beginner - Never coded before</option>
                    <option value="intermediate">Intermediate - Some experience</option>
                    <option value="advanced">Advanced - Looking to specialize</option>
                  </select>
                </div>

                {/* Preferred Start Date */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Preferred Start Date</label>
                  <input
                    name="preferred_start_date"
                    value={formData.preferred_start_date}
                    onChange={handleChange}
                    type="date"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                  />
                </div>

                {/* Courses Selection */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Select Courses *</label>
                  <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                    {AVAILABLE_COURSES.map((course) => (
                      <label
                        key={course.id}
                        className={`flex items-center p-2 rounded-lg border cursor-pointer transition-all ${
                          formData.courses.includes(course.id)
                            ? 'bg-blue-50 border-blue-300'
                            : 'bg-white border-gray-200 hover:border-blue-200'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={formData.courses.includes(course.id)}
                          onChange={() => toggleCourse(course.id)}
                          className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 mr-3"
                        />
                        <span className="text-sm text-gray-800">{course.icon} {course.name}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Payment Plan */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Payment Plan *</label>
                  <div className="space-y-2">
                    {PAYMENT_PLANS.map((plan) => (
                      <label
                        key={plan.id}
                        className={`flex items-center p-3 rounded-lg border cursor-pointer transition-all ${
                          formData.payment_plan === plan.id
                            ? 'bg-blue-50 border-blue-300'
                            : 'bg-white border-gray-200 hover:border-blue-200'
                        }`}
                      >
                        <input
                          type="radio"
                          name="payment_plan"
                          value={plan.id}
                          checked={formData.payment_plan === plan.id}
                          onChange={handleChange}
                          className="w-4 h-4 text-blue-600 focus:ring-blue-500 mr-3"
                        />
                        <div className="flex-1">
                          <span className="text-sm font-medium text-gray-900">{plan.name}</span>
                          <p className="text-xs text-gray-500">{plan.description}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Additional Notes</label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                    placeholder="Any specific goals or questions..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold py-3 rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                  {isSubmitting ? 'Submitting...' : 'Register for Classes'}
                </button>
                <p className="text-xs text-center text-gray-500 mt-2">By registering, you agree to our terms and conditions.</p>
              </form>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-gray-900 text-gray-400 py-8 text-center text-sm">
        <div className="container mx-auto">
          <p className="mb-2">RHEMA EXPERT SOLUTIONS</p>
          <p>Empowering the next generation of coders.</p>
        </div>
      </footer>
    </div>
  );
}
