import Image from "next/image";
import { getServiceImages, getRandomImages, getCloudinaryImage, resolveImageUrl } from "@/lib/images";
import HeroSlideshow from "@/components/HeroSlideshow";
import ImageWithSkeleton from "@/components/ImageWithSkeleton";
import AutoScrollGallery from "@/components/AutoScrollGallery";
import ContactButton from "@/components/ContactButton";
import NewsTicker from "@/components/NewsTicker";
import VideoPlayer from "@/components/VideoPlayer";
import ENotesSection from "@/components/ENotesSection";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { RhemaCompetition, RhemaNewsletter, RhemaService, RhemaClient, RhemaTeam, RhemaContent, RhemaStaffNote } from "@/types/supabase";
import Header from "@/components/Header";

export default async function Home() {
  // Fetch dynamic content from Supabase
  let dynamicServices: RhemaService[] | null = null;
  let dynamicClients: RhemaClient[] | null = null;
  let dynamicTeam: RhemaTeam[] | null = null;
  let competitions: RhemaCompetition[] | null = null;
  let newsletters: RhemaNewsletter[] | null = null;
  let dynamicContent: RhemaContent[] | null = null;
  let staffNotes: RhemaStaffNote[] = [];

  if (isSupabaseConfigured()) {
    try {
      const [servicesRes, clientsRes, teamRes, compRes, newsRes, contentRes, notesRes] = await Promise.all([
        supabase.from('rhema_services').select('*').order('display_order'),
        supabase.from('rhema_clients').select('*').order('display_order'),
        supabase.from('rhema_team').select('*').order('display_order'),
        supabase.from('rhema_competitions').select('*').eq('is_active', true),
        supabase.from('rhema_newsletter').select('*').eq('is_published', true).order('created_at', { ascending: false }).limit(10),
        supabase.from('rhema_content').select('*'),
        supabase.from('rhema_staff_notes').select('*').eq('status', 'active').order('is_pinned', { ascending: false }).order('created_at', { ascending: false }).limit(20)
      ]);

      // Assign fetched data directly, even if empty array, to prevent fallback to static data
      dynamicServices = servicesRes.data;
      if (clientsRes.data && clientsRes.data.length > 0) dynamicClients = clientsRes.data;
      if (teamRes.data && teamRes.data.length > 0) dynamicTeam = teamRes.data;
      if (compRes.data) competitions = compRes.data;
      if (newsRes.data) newsletters = newsRes.data;
      if (contentRes.data) dynamicContent = contentRes.data;
      if (notesRes.data) staffNotes = notesRes.data;
    } catch (error) {
      console.error('Error fetching dynamic content:', error);
    }
  }

  const getContent = (section: string, key: string, fallback: string) => {
    if (!dynamicContent) return fallback;
    const item = dynamicContent.find(c => c.section === section && c.key === key);
    return item ? item.value : fallback;
  };

  // Fallback to static content if dynamic content is missing
  // Get images for specific sections (now async - fetched from Cloudinary)
  const codingImages = await getServiceImages('coding');
  const roboticsImages = await getServiceImages('robotics');
  const allProjectImages = [...codingImages, ...roboticsImages];
  
  // Hero: All images from coding and robotics, randomized
  const heroImages = getRandomImages(allProjectImages, allProjectImages.length);
  
  // About: 6 random images from coding and robotics
  const aboutImages = getRandomImages(allProjectImages, 6);
  
  // Projects: All coding and robotics images for the scrolling view
  const projectGalleryImages = allProjectImages; 

  const staticServicesData = [
    {
      title: "Science Lab Setup",
      description: "Complete apparatus and reagents for educational and research institutions",
      folder: "lab"
    },
    // ... (rest of static services)
    {
      title: "Coding & STEM Robotics",
      description: "Comprehensive training and development in programming and robotics",
      folder: "coding" 
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
      folder: "physics" 
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

  // Process services: ONLY use dynamic services if available and fallback to empty array (or static ONLY if database is empty/failed)
  // The user stated they deleted items from DB but they still show. 
  // This means `dynamicServices` is likely null or empty, causing the fallback `staticServicesData` to render.
  // We should prefer showing NOTHING if the DB call succeeded but returned 0 items, rather than showing stale static data.
  // However, `dynamicServices` is initialized as null.
  
  // Pre-fetch service folder images from Cloudinary for all possible folders
  const serviceFolderImages: Record<string, string[]> = {};
  const allFolderNames = [
    ...new Set([
      ...(dynamicServices || []).map(s => s.folder_name).filter(Boolean) as string[],
      ...staticServicesData.map(s => s.folder),
    ]),
  ];
  await Promise.all(
    allFolderNames.map(async (folder) => {
      serviceFolderImages[folder] = await getServiceImages(folder);
    })
  );

  const servicesToRender = dynamicServices && dynamicServices.length > 0 
    ? dynamicServices.map(s => ({
        ...s,
        images: [
          ...(s.image_urls || []).map(resolveImageUrl), 
          ...(s.folder_name ? (serviceFolderImages[s.folder_name] || []) : [])
        ].slice(0, 3)
      }))
    : dynamicServices !== null // If DB fetch succeeded but empty, show nothing. Only show static if DB fetch failed/not run (null)
      ? []
      : staticServicesData.map(service => ({
        ...service,
        images: (serviceFolderImages[service.folder] || []).slice(0, 3)
      }));


  const clientsToRender = dynamicClients && dynamicClients.length > 0
    ? dynamicClients.map(c => c.name)
    : [
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
    ];

  const staticTeamMembers = [
    {
      name: "FRED C. ODII",
      role: "Head of Operations (HOO)",
      image_url: getCloudinaryImage('staff', 'fred.jpeg')
    },
    {
      name: "CHIAMAKA OKONKWO",
      role: "Admin Officer",
      image_url: getCloudinaryImage('staff', 'admin.jpg')
    },
    {
      name: "ADEBOLA ADEYEMI",
      role: "STEM Instructor",
      image_url: getCloudinaryImage('staff', 'instructor.jpg')
    },
    {
      name: "NWACHUKWU ONYEKACHI",
      role: "Chief Technology Officer (CTO)",
      image_url: getCloudinaryImage('staff', 'onyekachi.jpeg')
    },
    {
      name: "CHINEDU OKAFOR",
      role: "Remote Software Engineer",
      image_url: getCloudinaryImage('staff', 'remote-software-engineer.jpg')
    }
  ];

  const teamToRender = (() => {
    const base = dynamicTeam && dynamicTeam.length > 0 ? dynamicTeam : [];

    const merged = [
      ...base,
      ...staticTeamMembers.filter((s) => {
        const sName = (s.name || '').toLowerCase();
        const sImg = s.image_url || '';
        return !base.some((d) => {
          const dName = (d.name || '').toLowerCase();
          const dImg = d.image_url || '';
          return (sImg && dImg && sImg === dImg) || (sName && dName && sName === dName);
        });
      })
    ];

    const orderRank = (member: { name?: string | null; image_url?: string | null }) => {
      const img = member.image_url || '';
      const name = (member.name || '').toLowerCase();
      if (img.includes('/staff/fred') || name.includes('fred')) return 1;
      if (img.includes('/staff/admin') || name.includes('admin')) return 2;
      return 100;
    };

    return merged.sort((a, b) => orderRank(a) - orderRank(b));
  })();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-red-50">
      {/* Header */}
      <Header />

      {/* Hero Section */}
      <section id="home" className="py-12 md:py-20">
        <div className="container mx-auto px-4 flex flex-col-reverse md:flex-row items-center">
          <div className="w-full md:w-1/2 mt-8 md:mt-0">
            <h1 className="text-xl md:text-4xl lg:text-5xl font-extrabold text-blue-900 mb-6 leading-tight">
              {getContent('hero', 'title', 'Empowering Innovation Through Technology')}
            </h1>
            <p className="text-lg text-gray-700 mb-8 max-w-lg">
              {getContent('hero', 'subtitle', 'Providing cutting-edge solutions in Science, Technology, Engineering, and Mathematics to transform ideas into reality.')}
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <a 
                href="https://cbt.rhemaexpertsolutions.com/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-red-600 text-white px-8 py-3 rounded-full hover:bg-red-700 transition-all shadow-lg hover:shadow-red-200 hover:-translate-y-1 font-bold text-center"
              >
                Start CBT Exam
              </a>
              <a href="#services" className="bg-white text-blue-900 border-2 border-blue-900 px-8 py-3 rounded-full hover:bg-blue-50 transition-all font-bold text-center">
                Explore Services
              </a>
            </div>
            
            {/* Newsletter Snippet / Updates */}
            {newsletters && newsletters.length > 0 && (
              <NewsTicker newsletters={newsletters} />
            )}
          </div>
          
          <div className="w-full md:w-1/2 flex justify-center mt-8 md:mt-0">
            <div className="relative w-full max-w-lg">
              <div className="hidden md:block w-72 h-72 bg-blue-200 rounded-full opacity-20 absolute -top-10 -left-10 z-0 blur-3xl"></div>
              <div className="hidden md:block w-72 h-72 bg-red-200 rounded-full opacity-20 absolute -bottom-10 -right-10 z-0 blur-3xl"></div>
              <div className="relative z-10 bg-white p-2 rounded-xl md:rounded-3xl shadow-lg md:shadow-2xl overflow-hidden w-full">
                <HeroSlideshow images={heroImages} />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="training" className="py-16 bg-white/70 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-blue-900 mb-4 drop-shadow-sm">Online Trainings & Professional Development</h2>
            <div className="w-20 h-1 bg-gradient-to-r from-red-600 to-red-400 mx-auto rounded-full"></div>
            <p className="text-gray-700 mt-4 max-w-3xl mx-auto">
              We offer structured online classes for students and comprehensive professional training programs to advance your career in technology.
            </p>
          </div>

          <div className="flex flex-col lg:flex-row items-start gap-10">
            <div className="w-full lg:w-1/2">
              <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200">
                <h3 className="text-xl font-bold text-blue-900 mb-3">What You'll Learn</h3>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start">
                    <span className="text-red-600 mr-2">•</span>
                    <span><strong>For Students:</strong> Foundation to advanced programming concepts with hands-on practice.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-600 mr-2">•</span>
                    <span><strong>For Professionals:</strong> Advanced skills in AI, Data Science, Cyber Security, and more.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-600 mr-2">•</span>
                    <span>Problem-solving, logic building, and real-world project delivery.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-600 mr-2">•</span>
                    <span>Personalized support and progress tracking throughout the course.</span>
                  </li>
                </ul>

                <div className="mt-6 flex flex-col sm:flex-row gap-4">
                  <a
                    href="#training-video"
                    className="bg-red-600 text-white px-6 py-3 rounded-xl hover:bg-red-700 transition-all shadow-md font-bold text-center"
                  >
                    Watch Class Preview
                  </a>
                  <a
                    href="/coding-classes"
                    className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-all shadow-md font-bold text-center"
                  >
                    Register for Coding Classes
                  </a>
                  <a
                    href="/professional-trainings"
                    className="bg-purple-600 text-white px-6 py-3 rounded-xl hover:bg-purple-700 transition-all shadow-md font-bold text-center"
                  >
                    Professional Trainings
                  </a>
                </div>
              </div>
            </div>

            <div className="w-full lg:w-1/2" id="training-video">
              <VideoPlayer
                src="https://res.cloudinary.com/dq7vegvkk/video/upload/VID_20251021_171858_1_1_gmmkh9.mp4"
                poster={getCloudinaryImage('', 'preview.png')}
                title="Class Preview"
                description="Watch a real training session before enrolling"
              />
            </div>
          </div>
        </div>
      </section>

      {/* R.E.S Coding Competition Section */}
      <section id="competitions" className="py-20 relative overflow-hidden">
        {/* Liquid Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-950 via-purple-900 to-blue-950 z-0"></div>
        
        {/* Liquid Blobs for Glass Effect */}
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-600/30 rounded-full mix-blend-screen filter blur-[100px] opacity-60"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-600/30 rounded-full mix-blend-screen filter blur-[100px] opacity-60"></div>
        <div className="absolute top-[40%] left-[40%] w-[300px] h-[300px] bg-pink-600/20 rounded-full mix-blend-screen filter blur-[80px] opacity-50"></div>
        
        <div className="container mx-auto px-4 relative z-10 text-white">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="md:w-2/3 mb-12 md:mb-0">
              <div className="flex items-center mb-6">
                <div className="relative bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-xl border border-white/30 p-3 rounded-2xl shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] mr-5 overflow-hidden group">
                  <Image
                    src="/logo.png"
                    alt="Rhema Logo"
                    width={70}
                    height={70}
                    className="object-contain drop-shadow-md rounded-2xl"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm rounded-2xl">
                    <span className="text-xs font-bold text-white">R.E.S</span>
                  </div>
                  {/* Coding Icon Overlay */}
                  <div className="absolute -bottom-1 -right-1 bg-gradient-to-r from-red-600 to-red-500 rounded-full p-1.5 border-2 border-white/50 shadow-lg">
                     <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                     </svg>
                  </div>
                </div>
                <div>
                   <h2 className="text-3xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-100 to-blue-200 drop-shadow-sm">SMART CODERS</h2>
                   <p className="text-xl md:text-2xl font-bold text-white mt-1">NATIONAL COMPETITION</p>
                   <p className="text-yellow-300 font-bold italic tracking-wider mt-2 text-lg">&quot;I CAN CODE&quot;</p>
                </div>
              </div>
              <p className="text-blue-50 text-lg mb-8 max-w-2xl leading-relaxed font-light">
                Join the annual coding challenge for schools across Nigeria. Showcase your skills, compete with the best, and win prestigious awards.
              </p>
              
              <div className="bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-2xl p-8 rounded-3xl border border-white/20 shadow-[0_8px_32px_0_rgba(0,0,0,0.2)]">
                  <p className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 to-yellow-400 mb-2">Registration is FREE!</p>
                  <p className="text-blue-50 mb-6">Open for scholars in Nigerian Primary and Secondary Schools.</p>
                  
                  <div className="flex flex-col sm:flex-row gap-4">
                    <a 
                      href="/competition"
                      className="inline-block bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white font-bold px-8 py-3 rounded-full transition-all shadow-lg hover:shadow-red-500/30 border border-white/10 text-center"
                    >
                      Register Now
                    </a>
                    <a 
                      href="/competition"
                      className="inline-block bg-white/10 hover:bg-white/20 text-white font-bold px-8 py-3 rounded-full transition-all border border-white/30 text-center backdrop-blur-md"
                    >
                      View Details
                    </a>
                  </div>

                   <div className="mt-6 flex items-center text-sm text-blue-100 bg-white/5 p-3 rounded-xl border border-white/5 w-fit">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="font-medium">Prepare for the &quot;I Can Code&quot; Challenge</span>
                   </div>
              </div>

            </div>
            <div className="md:w-1/3 flex justify-center mt-12 md:mt-0 relative">
              {/* Decorative Glow for Award */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-yellow-400/20 rounded-full filter blur-3xl z-0"></div>
              
              <div className="w-72 h-72 rounded-full flex items-center justify-center relative bg-gradient-to-b from-white/20 to-white/5 backdrop-blur-2xl border border-white/30 shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] ring-1 ring-white/20 z-10 group hover:scale-105 transition-transform duration-500">
                <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-transparent via-white/10 to-transparent opacity-50 pointer-events-none"></div>
                
                {/* Floating Coding Image Badge */}
                <div className="absolute -top-8 -right-8 w-42 h-42 rounded-full border-4 border-white/20 shadow-xl overflow-hidden z-20 animate-bounce">
                  <Image
                    src={getCloudinaryImage('', 'coding.jpg')}
                    alt="Coding Badge"
                    fill
                    className="object-cover"
                  />
                </div>

                <div className="flex flex-col items-center">
                   <div className="relative w-52 h-52 transform group-hover:scale-110 transition-transform duration-500">
                     <Image
                       src={getCloudinaryImage('', 'cup.png')}
                       alt="National Award Cup"
                       fill
                       className="object-contain drop-shadow-[0_0_15px_rgba(250,204,21,0.5)]"
                     />
                   </div>
                   <span className="text-white font-extrabold text-2xl text-center leading-tight drop-shadow-md tracking-tight">National<br/>Award</span>
                </div>
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
          
          <div className="flex flex-col md:flex-row items-start">
            <div className="md:w-1/2 mb-10 md:mb-0">
              <h3 className="text-2xl font-bold text-blue-900 mb-4">COMPANY PROFILE</h3>
              <p className="text-gray-700 mb-4 text-justify">
                <strong>RHEMA EXPERT SOLUTIONS</strong> is a premier Technology company based in Nigeria, dedicated to providing innovative solutions across multiple technological domains. 
              </p>
              <p className="text-gray-700 mb-4 text-justify">
                With expertise spanning; Science Laboratory Setup, Coding (Programming) & STEM Robotics, AI, IoT, Drone Technology, CCTV System, Software Development and Cyber Security. We empower businesses and educational institutions with cutting-edge technology solutions.
              </p>
              <p className="text-gray-700 mb-4 text-justify">
                The firm blaze the impact of Technology in all sphere of learning and equally engages in other services such as Installation and Maintenance of CCTV Systems, Website Designs & Development: Web App and Mobile App, Drone Technology & Database Management, CYBER SECURITY, majoring on; Ethical Hacking, Digital Forensics, Penetration Testing and Vulnerability Assessment, STEM AVIATION, DIGITAL MARKETING, DATA ANALYSIS: Excel, Power BI.
              </p>
              <p className="text-gray-700 mb-4 text-justify">
                Our mission is to bridge the gap between innovation and implementation, delivering tailored solutions that drive growth and excellence.
              </p>
              <p className="text-gray-700 mb-4 text-justify">
                <strong>RHEMA EXPERT SOLUTIONS</strong> is working endlessly to become a major player in the Tech-World in terms of product efficiency, distribution and services. By leveraging a well thought out business plans executed by a skilled Management Team, RHEMA EXPERT SOLUTIONS will achieve its goals and vision in a short while.
              </p>
              <p className="text-gray-700 mb-6 text-justify">
                The firm source for products from affiliate companies in Europe, Asia and India.
              </p>
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
              <div className="grid grid-cols-3 gap-2 mb-8">
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
                    <span className="text-gray-700">{getContent('contact', 'phone1', '+234 803 522 6642')}</span>
                  </li>
                  <li className="flex items-center">
                    <span className="text-red-600 mr-2">📱</span>
                    <span className="text-gray-700">{getContent('contact', 'phone2', '+234 802 579 1886 (WhatsApp)')}</span>
                  </li>
                  <li className="flex items-center">
                    <span className="text-red-600 mr-2">✉️</span>
                    <span className="text-gray-700">{getContent('contact', 'email', 'rhemaexpertsolutions@gmail.com')}</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-16 bg-blue-50/80 backdrop-blur-sm relative">
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
            {servicesToRender.map((service, index) => (
              <div key={index} className="bg-white p-6 rounded-2xl shadow-sm border border-blue-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full group">
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

      {/* E-Notes / Updates Section */}
      <ENotesSection notes={staffNotes} />

      {/* Projects Section */}
      <section id="projects" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-blue-900 mb-4 drop-shadow-sm">Our Projects</h2>
            <div className="w-20 h-1 bg-gradient-to-r from-red-600 to-red-400 mx-auto rounded-full"></div>
            <p className="text-gray-700 mt-4 max-w-2xl mx-auto">
              A glimpse into our impactful work in education and technology implementation.
            </p>
          </div>
          
          <div className="bg-gray-50 rounded-3xl p-6 shadow-inner border border-gray-100">
            <AutoScrollGallery images={projectGalleryImages} />
          </div>
          
          <div className="text-center mt-12">
            <a 
              href="https://web.facebook.com/profile.php?id=100092432334656" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-block bg-blue-50 text-blue-800 px-8 py-3 rounded-full hover:bg-blue-100 transition-all font-medium shadow-sm hover:shadow-md border border-blue-100"
            >
              View More on Facebook
            </a>
          </div>
        </div>
      </section>

      {/* Our Clients Section */}
      <section id="clients" className="py-16 bg-gray-100 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-white/50 via-transparent to-transparent opacity-70"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-blue-900 mb-4 drop-shadow-sm">Our Clients</h2>
            <div className="w-20 h-1 bg-gradient-to-r from-red-600 to-red-400 mx-auto rounded-full"></div>
            <p className="text-gray-700 mt-4 max-w-2xl mx-auto">
              Trusted by leading educational institutions across Nigeria.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {clientsToRender.map((client, index) => (
              <div key={index} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 hover:shadow-md hover:scale-[1.02] transition-all duration-300 flex items-start">
                <div className="bg-blue-100 p-2 rounded-full mr-4 flex-shrink-0">
                  <span className="text-blue-600 font-bold text-sm w-6 h-6 flex items-center justify-center">{index + 1}</span>
                </div>
                <p className="text-gray-800 font-medium text-sm leading-relaxed">{client}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Team Section */}
      <section id="team" className="py-16 bg-blue-50/80 backdrop-blur-sm relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-blue-900 mb-4 drop-shadow-sm">Meet Our Team</h2>
            <div className="w-20 h-1 bg-gradient-to-r from-red-600 to-red-400 mx-auto rounded-full"></div>
            <p className="text-gray-700 mt-4 max-w-2xl mx-auto">
              Dedicated professionals committed to excellence and innovation.
            </p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-8 md:gap-12">
            {teamToRender.map((staff, index) => (
              <div key={index} className="bg-white rounded-2xl p-6 shadow-lg border border-blue-100 hover:shadow-xl hover:-translate-y-2 transition-all duration-300 w-full max-w-sm flex flex-col items-center group text-center">
                <div className="relative w-48 h-48 rounded-full overflow-hidden mb-6 border-4 border-blue-50 shadow-inner group-hover:border-red-50 transition-colors duration-300">
                  <ImageWithSkeleton
                    src={resolveImageUrl(staff.image_url)}
                    alt={staff.name}
                    fill
                    className="object-cover transform group-hover:scale-110 transition-transform duration-700"
                  />
                </div>
                <h3 className="text-xl font-bold text-blue-900 mb-2">{staff.name}</h3>
                <div className="bg-blue-50 text-blue-700 px-4 py-1 rounded-full text-sm font-medium mb-4">
                  {staff.role}
                </div>
                {/* 
                <div className="flex space-x-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-2 group-hover:translate-y-0">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 hover:bg-blue-600 hover:text-white transition-colors cursor-pointer">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 hover:bg-blue-600 hover:text-white transition-colors cursor-pointer">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                  </div>
                </div>
                */}
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
                <span className="mr-2">📞</span> {getContent('contact', 'phone1', '+234 803 522 6642')}
              </div>
              <div className="flex items-center justify-center">
                <span className="mr-2">📱</span> {getContent('contact', 'phone2', '+234 802 579 1886')}
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
                <li>📞 {getContent('contact', 'phone1', '+234 803 522 6642')}</li>
                <li>📱 {getContent('contact', 'phone2', '+234 802 579 1886')}</li>
                <li>✉️ {getContent('contact', 'email', 'rhemaexpertsolutions@gmail.com')}</li>
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
