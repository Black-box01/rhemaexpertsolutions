import Image from "next/image";
import Link from "next/link";
import { getServiceImages, getRandomImages } from "@/lib/images";
import HeroSlideshow from "@/components/HeroSlideshow";
import ImageWithSkeleton from "@/components/ImageWithSkeleton";
import AutoScrollGallery from "@/components/AutoScrollGallery";
import ContactButton from "@/components/ContactButton";

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
      folder: "cctv"
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
              <a href="#services" className="bg-blue-700 text-white px-6 py-3 rounded-lg hover:bg-blue-800 transition-colors font-medium flex items-center justify-center">
                Explore Services
              </a>
              <a href="#contact" className="border-2 border-blue-700 text-blue-700 px-6 py-3 rounded-lg hover:bg-blue-50 transition-colors font-medium flex items-center justify-center">
                Contact Us
              </a>
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
      <section id="services" className="py-16 bg-blue-50/50 backdrop-blur-sm relative">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-100/50 rounded-full filter blur-3xl -z-10 opacity-60"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-red-100/50 rounded-full filter blur-3xl -z-10 opacity-60"></div>
        
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-blue-900 mb-4 drop-shadow-sm">Our Services</h2>
            <div className="w-20 h-1 bg-gradient-to-r from-red-600 to-red-400 mx-auto rounded-full"></div>
            <p className="text-gray-700 mt-4 max-w-2xl mx-auto">
              Comprehensive technology solutions tailored to meet your specific needs and drive innovation.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div key={index} className="bg-white/80 backdrop-blur-md p-6 rounded-2xl shadow-sm border border-white/60 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full group">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-100 to-blue-50 flex items-center justify-center mb-4 shrink-0 group-hover:scale-110 transition-transform duration-300 shadow-inner">
                  <span className="text-blue-700 font-bold">{index + 1}</span>
                </div>
                <h3 className="text-xl font-bold text-blue-900 mb-2 group-hover:text-red-600 transition-colors">{service.title}</h3>
                <p className="text-gray-700 mb-6 flex-grow leading-relaxed">{service.description}</p>
                
                {/* Service Images */}
                {service.images && service.images.length > 0 && (
                  <div className="grid grid-cols-3 gap-2 mt-auto">
                    {service.images.slice(0, 3).map((src, imgIndex) => (
                      <div key={imgIndex} className="relative h-20 rounded-xl overflow-hidden bg-gray-50 shadow-sm border border-gray-100 group-hover:shadow-md transition-all">
                        <ImageWithSkeleton
                          src={src}
                          alt={`${service.title} image ${imgIndex + 1}`}
                          fill
                          className="object-cover transform hover:scale-110 transition-transform duration-500"
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
      <section id="projects" className="py-16 bg-gray-50/50 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-blue-900 mb-4 drop-shadow-sm">Our Projects</h2>
            <div className="w-20 h-1 bg-gradient-to-r from-red-600 to-red-400 mx-auto rounded-full"></div>
            <p className="text-gray-700 mt-4 max-w-2xl mx-auto">
              A glimpse into our impactful work in education and technology implementation.
            </p>
          </div>
          
          <div className="bg-white/80 backdrop-blur-md rounded-3xl p-6 shadow-xl border border-white/50">
            <AutoScrollGallery images={projectGalleryImages} />
          </div>
          
          <div className="text-center mt-12">
            <a 
              href="https://web.facebook.com/profile.php?id=100092432334656" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-block bg-blue-100/80 text-blue-800 px-8 py-3 rounded-full hover:bg-blue-200 transition-all font-medium shadow-sm hover:shadow-md backdrop-blur-sm"
            >
              View More on Facebook
            </a>
          </div>
        </div>
      </section>

      {/* Our Clients Section */}
      <section id="clients" className="py-16 bg-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-blue-50/50 via-transparent to-transparent opacity-70"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-blue-900 mb-4 drop-shadow-sm">Our Clients</h2>
            <div className="w-20 h-1 bg-gradient-to-r from-red-600 to-red-400 mx-auto rounded-full"></div>
            <p className="text-gray-700 mt-4 max-w-2xl mx-auto">
              Trusted by leading educational institutions across Nigeria.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              "DIVISON INTERNATIONAL SCHOOLS, Igbo-Etche, Rivers State",
              "MESHRIDGE INTERNATIONAL SCHOOL, Trans-Amadi, Rivers State",
              "GLORIOUS DESTINY ACADEMY, Eliozu, Port Harcourt, Rivers State",
              "CEREBRAL MODEL COLLEGE, Igwuruta, Rivers State",
              "BOLDLIVING CHRISTIAN ACADEMY, Trans-Worji, Port Harcourt, Rivers State",
              "ROHAN EXCELLENT SCHOOLS, Abuloma, Port Harcourt, Rivers State",
              "ROCKWORD CHRISTIAN SCHOOL, Elelenwo, Port Harcourt, Rivers State",
              "PROWESS-POINT MODEL SCHOOL, Owerri, Imo State",
              "STARLIGHT GALAXY INTERNATIONAL SCHOOL, Elelenwo, Port Harcourt, Rivers State",
              "GLORIOUS COVENANT SCHOOL, Rumuodara, Port Harcourt, Rivers State",
              "MORAL SEED MONTESSORI SCHOOL, Elelenwo, Port Harcourt, Rivers State",
              "DE EXCELLENT CHILD INTERNATIONAL SCHOOL, Elelenwo, Port Harcourt, Rivers State",
              "LIFE STANDARD EDUCATIONAL CENTER, Rumukwurushi, Port Harcourt, Rivers State",
              "TREASURE INTERNATIONAL SCHOOL, Rumukwurushi, Port Harcourt, Rivers State",
              "DIVINE FAVOUR INTERNATIONAL SCHOOL, Akpajo, Eleme, Rivers State",
              "JECK COMPREHENSIVE COLLEGE, Elimgbu, Port Harcourt, Rivers State",
              "GREATNESS MONTESSORI ACADEMY, Rumuokwurishi, Port Harcourt, Rivers State",
              "TRILLIUM SUCCESS ACADEMY, Eliozu, Port Harcourt, Rivers State",
              "JESHURUN MONTESSORI INTERNATIONAL SCHOOL, Atali, Port Harcourt, Rivers State",
              "CHIBSON INTERNATIONAL SCHOOL, Rumunduru, Port Harcourt, Rivers State",
              "JESHURUN HIGH SCHOOL, Atali, Port Harcourt, Rivers State",
              "EAGLE GREAT STARS INTERNATIONAL SCHOOL, Elelenwo, Port Harcourt, Rivers State",
              "3 STARS EDUCATIONAL CENTER, Borikiri, Port Harcourt, Rivers State"
            ].map((client, index) => (
              <div key={index} className="bg-white/60 backdrop-blur-sm p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md hover:scale-[1.02] transition-all duration-300 flex items-start">
                <div className="bg-blue-100/50 p-2 rounded-full mr-4 flex-shrink-0">
                  <span className="text-blue-600 font-bold text-sm w-6 h-6 flex items-center justify-center">{index + 1}</span>
                </div>
                <p className="text-gray-800 font-medium text-sm leading-relaxed">{client}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Team Section */}
      <section id="team" className="py-16 bg-gray-50/50 backdrop-blur-sm relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-blue-900 mb-4 drop-shadow-sm">Meet Our Team</h2>
            <div className="w-20 h-1 bg-gradient-to-r from-red-600 to-red-400 mx-auto rounded-full"></div>
            <p className="text-gray-700 mt-4 max-w-2xl mx-auto">
              Dedicated professionals committed to excellence and innovation.
            </p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-8 md:gap-12">
            {[
              {
                name: "FRED C. ODII",
                role: "Head of Operations (HOO)",
                image: "/img/staff/fred.jpeg"
              },
              {
                name: "NWACHUKWU ONYEKACHI",
                role: "Chief Technology Officer (CTO)",
                image: "/img/staff/onyekachi.jpeg"
              }
            ].map((staff, index) => (
              <div key={index} className="bg-white/80 backdrop-blur-md rounded-2xl p-6 shadow-lg border border-white/60 hover:shadow-xl hover:-translate-y-2 transition-all duration-300 w-full max-w-sm flex flex-col items-center group text-center">
                <div className="relative w-48 h-48 rounded-full overflow-hidden mb-6 border-4 border-blue-100 shadow-inner group-hover:border-red-100 transition-colors duration-300">
                  <ImageWithSkeleton
                    src={staff.image}
                    alt={staff.name}
                    fill
                    className="object-cover transform group-hover:scale-110 transition-transform duration-700"
                  />
                </div>
                <h3 className="text-xl font-bold text-blue-900 mb-2">{staff.name}</h3>
                <div className="bg-blue-50 text-blue-700 px-4 py-1 rounded-full text-sm font-medium mb-4">
                  {staff.role}
                </div>
                <div className="flex space-x-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-2 group-hover:translate-y-0">
                  {/* Social placeholders or contact icons could go here */}
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 hover:bg-blue-600 hover:text-white transition-colors cursor-pointer">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 hover:bg-blue-600 hover:text-white transition-colors cursor-pointer">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                  </div>
                </div>
              </div>
            ))}
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
          
          <div className="max-w-2xl mx-auto bg-blue-50 rounded-2xl p-10 text-center shadow-lg">
            <div className="mb-8 flex justify-center">
              <div className="bg-white p-4 rounded-full shadow-md">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
            
            <h3 className="text-2xl font-bold text-blue-900 mb-4">Send us an Email</h3>
            <p className="text-gray-600 mb-8 text-lg">
              Have a project in mind or need more information about our services? Choose an option below to contact us.
            </p>
            
            <ContactButton />
            
            <div className="mt-8 pt-8 border-t border-blue-100 flex flex-col md:flex-row justify-center space-y-4 md:space-y-0 md:space-x-8 text-gray-600">
              <div className="flex items-center justify-center">
                <span className="mr-2">📞</span> +234 803 522 6642
              </div>
              <div className="flex items-center justify-center">
                <span className="mr-2">📱</span> +234 802 579 1886
              </div>
            </div>
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