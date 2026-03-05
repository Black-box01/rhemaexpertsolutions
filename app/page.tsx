import Image from "next/image";
import Link from "next/link";
import { getServiceImages, getRandomImages } from "@/lib/images";
import HeroSlideshow from "@/components/HeroSlideshow";
import ImageWithSkeleton from "@/components/ImageWithSkeleton";
import AutoScrollGallery from "@/components/AutoScrollGallery";

export default async function Home() {
  // Get images for specific sections
  const codingImages = getServiceImages('coding');
  const roboticsImages = getServiceImages('robotics');
  const allProjectImages = [...codingImages, ...roboticsImages];
  
  // Hero: All images from coding and robotics, randomized
  const heroImages = getRandomImages(allProjectImages, allProjectImages.length);
  
  // About: 6 random images from coding and robotics
  const aboutImages = getRandomImages(allProjectImages, 6);
  
  // Projects: All coding and robotics images for the scrolling view
  // We use the same source as hero but maybe shuffled differently or just raw list
  const projectGalleryImages = allProjectImages; 

  const servicesData = [
    {
      title: "Science Lab Setup",
      description: "Complete apparatus and reagents for educational and research institutions",
      folder: "lab"
    },
    {
      title: "Coding & STEM Robotics",
      description: "Comprehensive training and development in programming and robotics",
      folder: "coding" // Represents both
    },
    {
      title: "AI & IoT Solutions",
      description: "Cutting-edge artificial intelligence and Internet of Things implementations",
      folder: "ai&iot"
    },
    {
      title: "Drone Technology",
      description: "Advanced drone systems for various commercial applications",
      folder: "drone"
    },
    {
      title: "Digital Electronics",
      description: "Circuitry design and embedded systems development",
      folder: "physics" // Best match for electronics components
    },
    {
      title: "CCTV Systems",
      description: "Installation and maintenance of security surveillance systems",
      folder: "coding" // Fallback as no cctv folder found
    },
    {
      title: "Software Development",
      description: "Custom websites, mobile apps, and web applications",
      folder: "software development"
    },
    {
      title: "Cyber Security",
      description: "Ethical hacking and security solutions for digital assets",
      folder: "cyber security"
    },
    {
      title: "Data Analysis: Excel, Power BI",
      description: "Professional data analysis and visualization services",
      folder: "data analysis"
    },
    {
      title: "Digital Marketing: Affiliate Marketing",
      description: "Strategic digital marketing and affiliate program management",
      folder: "digital marketing"
    }
  ];

  // Attach images to services
  const services = servicesData.map(service => ({
    ...service,
    images: getServiceImages(service.folder).slice(0, 3) // Get up to 3 images per service
  }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-red-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <ImageWithSkeleton
              src="/logo.png"
              alt="Rhema Expert Solutions Logo"
              width={50}
              height={50}
              className="rounded-lg"
            />
            <h1 className="text-xl font-bold text-blue-900">Rhema Expert Solutions</h1>
          </div>
          <nav className="hidden md:block">
            <ul className="flex space-x-8">
              <li><a href="#home" className="text-blue-900 hover:text-red-600 font-medium">Home</a></li>
              <li><a href="#about" className="text-blue-900 hover:text-red-600 font-medium">About</a></li>
              <li><a href="#services" className="text-blue-900 hover:text-red-600 font-medium">Services</a></li>
              <li><a href="#projects" className="text-blue-900 hover:text-red-600 font-medium">Projects</a></li>
              <li><a href="#contact" className="text-blue-900 hover:text-red-600 font-medium">Contact</a></li>
              {/* Facebook link in navigation */}
              <li>
                <a 
                  href="https://web.facebook.com/profile.php?id=100092432334656" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center text-blue-900 hover:text-red-600 font-medium"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-5 h-5 fill-current mr-1">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                  Facebook
                </a>
              </li>
            </ul>
          </nav>
          <a 
            href="https://cbt.rhemaexpertsolutions.com/" 
            target="_blank"
            rel="noopener noreferrer"
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors font-bold shadow-md animate-pulse"
          >
            Rhema CBT Exam
          </a>
        </div>
      </header>

      {/* Hero Section */}
      <section id="home" className="py-16 md:py-24">
        <div className="container mx-auto px-4 flex flex-col-reverse md:flex-row items-center">
          <div className="w-full md:w-1/2 mt-10 md:mt-0">
            <h1 className="text-4xl md:text-5xl font-bold text-blue-900 mb-4">
              Empowering Innovation Through Technology
            </h1>
            <p className="text-lg text-gray-700 mb-8">
              Providing cutting-edge solutions in Science, Technology, Engineering, and Mathematics to transform ideas into reality.
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <a 
                href="https://cbt.rhemaexpertsolutions.com/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors font-bold shadow-lg flex items-center justify-center"
              >
                Start CBT Exam
              </a>
              <button className="bg-blue-700 text-white px-6 py-3 rounded-lg hover:bg-blue-800 transition-colors font-medium">
                Explore Services
              </button>
              <button className="border-2 border-blue-700 text-blue-700 px-6 py-3 rounded-lg hover:bg-blue-50 transition-colors font-medium">
                Contact Us
              </button>
            </div>
            {/* Facebook CTA Button */}
            <div className="mt-8">
              <a 
                href="https://web.facebook.com/profile.php?id=100092432334656" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-5 h-5 fill-current mr-2">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                Visit Our Facebook Page
              </a>
            </div>
          </div>
          <div className="w-full md:w-1/2 flex justify-center -mx-4 md:mx-0 width-auto">
            <div className="relative w-full max-w-lg">
              <div className="hidden md:block w-64 h-64 md:w-80 md:h-80 bg-blue-200 rounded-full opacity-20 absolute -top-6 -left-6 z-0"></div>
              <div className="hidden md:block w-64 h-64 md:w-80 md:h-80 bg-red-200 rounded-full opacity-20 absolute -bottom-6 -right-6 z-0"></div>
              <div className="relative z-10 bg-white p-0 md:p-2 rounded-none md:rounded-2xl shadow-none md:shadow-xl overflow-hidden w-screen md:w-full ml-[calc(-50vw+50%)] md:ml-0 left-[calc(50vw-50%)] md:left-0">
                <HeroSlideshow images={heroImages} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-blue-900 mb-4">About Us</h2>
            <div className="w-20 h-1 bg-red-600 mx-auto"></div>
          </div>
          
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-10 md:mb-0">
              <h3 className="text-2xl font-bold text-blue-900 mb-4">Transforming Ideas Into Reality</h3>
              <p className="text-gray-700 mb-4">
                Rhema Expert Solutions is a premier technology company based in Nigeria, dedicated to providing innovative solutions across multiple technological domains.
              </p>
              <p className="text-gray-700 mb-4">
                With expertise spanning Science Lab Setup, Coding & STEM Robotics, AI & IoT, Drone Technology, Digital Electronics, CCTV Systems, Software Development, and Cyber Security, we empower businesses and educational institutions with cutting-edge technology solutions.
              </p>
              <p className="text-gray-700 mb-6">
                Our mission is to bridge the gap between innovation and implementation, delivering tailored solutions that drive growth and excellence.
              </p>
              
              <div className="grid grid-cols-3 gap-2 mt-6">
                {aboutImages.map((src, i) => (
                  <div key={i} className="relative h-24 rounded-lg overflow-hidden shadow-sm bg-gray-100">
                    <ImageWithSkeleton
                      src={src}
                      alt="About Us Image"
                      fill
                      className="object-cover hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                ))}
              </div>
              <div className="mt-6">
                <a 
                  href="#projects" 
                  className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-md"
                >
                  View More Projects
                </a>
              </div>
            </div>
            <div className="md:w-1/2 md:pl-10">
              <div className="bg-gray-100 p-8 rounded-2xl">
                <h4 className="text-xl font-bold text-blue-900 mb-4">Contact Information</h4>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <span className="text-red-600 mr-2">📍</span>
                    <span className="text-gray-700">1. Elelenwo, Port Harcourt - Nigeria</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-600 mr-2">📍</span>
                    <span className="text-gray-700">2. Surulere, Lagos - Nigeria</span>
                  </li>
                  <li className="flex items-center">
                    <span className="text-red-600 mr-2">📞</span>
                    <span className="text-gray-700">+234 803 522 6642</span>
                  </li>
                  <li className="flex items-center">
                    <span className="text-red-600 mr-2">📱</span>
                    <span className="text-gray-700">+234 802 579 1886 (WhatsApp)</span>
                  </li>
                  <li className="flex items-center">
                    <span className="text-red-600 mr-2">✉️</span>
                    <span className="text-gray-700">rhemaexpertsolutions@gmail.com</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-16 bg-blue-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-blue-900 mb-4">Our Services</h2>
            <div className="w-20 h-1 bg-red-600 mx-auto"></div>
            <p className="text-gray-700 mt-4 max-w-2xl mx-auto">
              Comprehensive technology solutions tailored to meet your specific needs and drive innovation.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow flex flex-col h-full">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-4 shrink-0">
                  <span className="text-blue-700 font-bold">{index + 1}</span>
                </div>
                <h3 className="text-xl font-bold text-blue-900 mb-2">{service.title}</h3>
                <p className="text-gray-700 mb-4 flex-grow">{service.description}</p>
                
                {/* Service Images */}
                {service.images && service.images.length > 0 && (
                  <div className="grid grid-cols-3 gap-2 mt-auto">
                    {service.images.slice(0, 3).map((src, imgIndex) => (
                      <div key={imgIndex} className="relative h-20 rounded-lg overflow-hidden bg-gray-50">
                        <ImageWithSkeleton
                          src={src}
                          alt={`${service.title} image ${imgIndex + 1}`}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-blue-900 mb-4">Our Projects</h2>
            <div className="w-20 h-1 bg-red-600 mx-auto"></div>
            <p className="text-gray-700 mt-4 max-w-2xl mx-auto">
              A glimpse into our impactful work in education and technology implementation.
            </p>
          </div>
          
          <AutoScrollGallery images={projectGalleryImages} />
          
          <div className="text-center mt-8">
            <a 
              href="https://web.facebook.com/profile.php?id=100092432334656" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-block bg-blue-100 text-blue-800 px-6 py-3 rounded-lg hover:bg-blue-200 transition-colors font-medium"
            >
              View More on Facebook
            </a>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-blue-900 mb-4">Get In Touch</h2>
            <div className="w-20 h-1 bg-red-600 mx-auto"></div>
            <p className="text-gray-700 mt-4 max-w-2xl mx-auto">
              Ready to transform your ideas into reality? Contact us today for a consultation.
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto bg-blue-50 rounded-2xl p-8">
            <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-gray-700 mb-2">Full Name</label>
                <input 
                  type="text" 
                  id="name" 
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your name"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-gray-700 mb-2">Email Address</label>
                <input 
                  type="email" 
                  id="email" 
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your email"
                />
              </div>
              <div>
                <label htmlFor="phone" className="block text-gray-700 mb-2">Phone Number</label>
                <input 
                  type="tel" 
                  id="phone" 
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your phone number"
                />
              </div>
              <div>
                <label htmlFor="service" className="block text-gray-700 mb-2">Service Interested In</label>
                <select 
                  id="service" 
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option>Select a service</option>
                  <option>Science Lab Setup</option>
                  <option>Coding & STEM Robotics</option>
                  <option>AI & IoT Solutions</option>
                  <option>Drone Technology</option>
                  <option>Digital Electronics</option>
                  <option>CCTV Systems</option>
                  <option>Software Development</option>
                  <option>Cyber Security</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label htmlFor="message" className="block text-gray-700 mb-2">Message</label>
                <textarea 
                  id="message" 
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Tell us about your project"
                ></textarea>
              </div>
              <div className="md:col-span-2">
                <button 
                  type="submit"
                  className="w-full bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition-colors font-medium"
                >
                  Send Message
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-blue-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Image
                  src="/logo.png"
                  alt="Rhema Expert Solutions Logo"
                  width={40}
                  height={40}
                  className="rounded-lg"
                />
                <h3 className="text-xl font-bold">Rhema Expert Solutions</h3>
              </div>
              <p className="text-blue-200">
                Empowering innovation through cutting-edge technology solutions across multiple domains.
              </p>
              {/* Facebook Link in Footer */}
              <div className="mt-4">
                <a 
                  href="https://web.facebook.com/profile.php?id=100092432334656" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center bg-white text-blue-900 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors font-medium"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-5 h-5 fill-current mr-2">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                  Follow on Facebook
                </a>
              </div>
            </div>
            <div>
              <h4 className="text-lg font-bold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><a href="#home" className="text-blue-200 hover:text-white">Home</a></li>
                <li><a href="#about" className="text-blue-200 hover:text-white">About Us</a></li>
                <li><a href="#services" className="text-blue-200 hover:text-white">Services</a></li>
                <li><a href="#projects" className="text-blue-200 hover:text-white">Projects</a></li>
                <li><a href="#contact" className="text-blue-200 hover:text-white">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-bold mb-4">Services</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-blue-200 hover:text-white">Science Lab Setup</a></li>
                <li><a href="#" className="text-blue-200 hover:text-white">STEM Robotics</a></li>
                <li><a href="#" className="text-blue-200 hover:text-white">AI & IoT</a></li>
                <li><a href="#" className="text-blue-200 hover:text-white">Software Development</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-bold mb-4">Contact Info</h4>
              <ul className="space-y-2 text-blue-200">
                <li>📍 Port Harcourt & Lagos, Nigeria</li>
                <li>📞 +234 803 522 6642</li>
                <li>📱 +234 802 579 1886</li>
                <li>✉️ rhemaexpertsolutions@gmail.com</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-blue-800 mt-8 pt-8 text-center text-blue-300">
            <p>&copy; {new Date().getFullYear()} Rhema Expert Solutions. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}