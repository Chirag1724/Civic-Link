import React, { useState, useEffect, useRef } from 'react';
import { FileText, CheckCircle, TrendingUp, Shield, Users, Clock, ArrowRight, Menu, X, MessageCircle, Bot, Send, Loader, Minimize2 } from 'lucide-react';

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Chatbot states
  const [showChatbot, setShowChatbot] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const chatEndRef = useRef(null);
  
  // Counter animation states
  const [statsInView, setStatsInView] = useState(false);
  const [counters, setCounters] = useState({
    capacity: 0,
    resolution: 0,
    availability: '0/0',
    departments: 0
  });
  const statsRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !statsInView) {
          setStatsInView(true);
        }
      },
      { threshold: 0.3 }
    );

    if (statsRef.current) {
      observer.observe(statsRef.current);
    }

    return () => {
      if (statsRef.current) {
        observer.unobserve(statsRef.current);
      }
    };
  }, [statsInView]);

  useEffect(() => {
    if (!statsInView) return;

    const easeOutQuart = (t) => 1 - Math.pow(1 - t, 4);

    const animateCounter = (key, target, duration) => {
      const startTime = Date.now();
      
      const updateCounter = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easedProgress = easeOutQuart(progress);
        const current = Math.floor(easedProgress * target);

        setCounters(prev => ({ ...prev, [key]: current }));

        if (progress < 1) {
          requestAnimationFrame(updateCounter);
        } else {
          setCounters(prev => ({ ...prev, [key]: target }));
        }
      };

      requestAnimationFrame(updateCounter);
    };

    const animate247 = () => {
      const startTime = Date.now();
      const duration = 2000;
      
      const update = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easedProgress = easeOutQuart(progress);
        
        const hours = Math.floor(easedProgress * 24);
        const days = Math.floor(easedProgress * 7);
        
        setCounters(prev => ({ ...prev, availability: `${hours}/${days}` }));
        
        if (progress < 1) {
          requestAnimationFrame(update);
        } else {
          setCounters(prev => ({ ...prev, availability: '24/7' }));
        }
      };
      
      requestAnimationFrame(update);
    };

    setTimeout(() => animateCounter('capacity', 10000, 2500), 100);
    setTimeout(() => animateCounter('resolution', 95, 2500), 200);
    setTimeout(() => animate247(), 250);
    setTimeout(() => animateCounter('departments', 3, 2000), 300);
  }, [statsInView]);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages]);

  const handleNavigation = (path) => {
    window.location.href = path;
  };

  const openChatbot = () => {
    setShowChatbot(true);
    setIsMinimized(false);
    if (chatMessages.length === 0) {
      setChatMessages([
        {
          role: 'assistant',
          content: `👋 Namaste! Welcome to CivicLink!\n\nMain aapka AI assistant hoon. Main aapki madad kar sakta hoon:\n\n✨ CivicLink ke baare mein\n📝 Complaint kaise file karein\n🎯 Platform features\n💡 Getting started guide\n❓ Koi bhi sawal\n\nAap mujhse Hindi ya English mein baat kar sakte hain!`,
          timestamp: new Date()
        }
      ]);
    }
  };

  const closeChatbot = () => {
    setShowChatbot(false);
  };

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  // Comprehensive smart response system - NO BACKEND NEEDED!
  const getSmartResponse = (question) => {
    const q = question.toLowerCase();
    
    if (q.match(/^(hi|hello|hey|hii|hiii|namaste|namaskar)/)) {
      return `Namaste! 🙏 CivicLink mein aapka swagat hai!\n\nMain aapki kaise madad kar sakta hoon? Aap mujhse platform ke baare mein kuch bhi pooch sakte hain!`;
    }
    
    if (q.includes('what is') || q.includes('about') || q.includes('civiclink') || q.includes('platform') || q.includes('kya hai')) {
      return `**CivicLink** ek Digital Complaint Tracker System hai:\n\n🎯 **Citizens**: Easily complaints file aur track karein\n🏛️ **Departments**: Workflows streamline karein\n📊 **Transparency**: Real-time updates\n⚡ **Fast**: Automatic routing\n\nHum citizens aur authorities ke beech bridge hain!`;
    }
    
    if (q.includes('how') && (q.includes('work') || q.includes('use') || q.includes('kaise'))) {
      return `**Simple 3 Steps:**\n\n**1️⃣ Complaint Submit**\n• Type (Water/Electricity/Road)\n• Location add\n• Photo upload\n\n**2️⃣ Track Progress**\n• Real-time updates\n• Worker details\n• Timeline view\n\n**3️⃣ Get Resolution**\n• Department action\n• Worker resolves\n• Confirmation\n\nAasan, transparent, efficient! 🚀`;
    }
    
    return `Main yahan hoon aapki help ke liye! 😊\n\nAap pooch sakte hain:\n\n🔹 CivicLink kya hai\n🔹 Features\n🔹 Complaint kaise file karein\n🔹 Tracking process\n🔹 Security\n🔹 Pricing\n\nKya jaanna chahte hain?`;
  };

  const sendChatMessage = async () => {
    if (!chatInput.trim() || isChatLoading) return;

    const userMessage = {
      role: 'user',
      content: chatInput,
      timestamp: new Date()
    };

    const currentInput = chatInput;
    setChatMessages(prev => [...prev, userMessage]);
    setChatInput('');
    setIsChatLoading(true);

    setTimeout(() => {
      const smartResponse = getSmartResponse(currentInput);
      
      const assistantMessage = {
        role: 'assistant',
        content: smartResponse,
        timestamp: new Date()
      };
      
      setChatMessages(prev => [...prev, assistantMessage]);
      setIsChatLoading(false);
    }, 800);
  };

  const handleChatKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendChatMessage();
    }
  };

  const features = [
    {
      icon: <FileText className="w-8 h-8" />,
      title: "Easy Filing",
      description: "Submit complaints effortlessly with our intuitive interface and track them in real-time."
    },
    {
      icon: <CheckCircle className="w-8 h-8" />,
      title: "Quick Resolution",
      description: "Automated routing ensures complaints reach the right department for faster action."
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: "Analytics Dashboard",
      description: "Gain insights with comprehensive reports and performance metrics."
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Secure & Transparent",
      description: "End-to-end encryption with complete transparency in complaint handling."
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Multi-Department",
      description: "Seamlessly coordinate across departments for efficient governance."
    },
    {
      icon: <Clock className="w-8 h-8" />,
      title: "Status Updates",
      description: "Automatic notifications keep citizens informed at every stage."
    }
  ];

  const formatNumber = (num, key) => {
    if (key === 'capacity') {
      if (num >= 10000) return '10K+';
      if (num >= 1000) return `${(num / 1000).toFixed(1)}K+`;
      if (num === 0) return '0';
      return `${num}+`;
    }
    if (key === 'resolution') {
      return `${num}%`;
    }
    if (key === 'departments') {
      return num.toString();
    }
    return num.toString();
  };

  const stats = [
    { 
      key: 'capacity',
      number: statsInView ? formatNumber(counters.capacity, 'capacity') : '0',
      label: "Target Capacity",
      color: 'from-blue-500 to-blue-600'
    },
    { 
      key: 'resolution',
      number: statsInView ? formatNumber(counters.resolution, 'resolution') : '0%',
      label: "Resolution Goal",
      color: 'from-green-500 to-green-600'
    },
    { 
      key: 'availability',
      number: statsInView ? counters.availability : '0/0',
      label: "System Availability",
      color: 'from-purple-500 to-purple-600'
    },
    { 
      key: 'departments',
      number: statsInView ? formatNumber(counters.departments, 'departments') : '0',
      label: "Departments Supported",
      color: 'from-orange-500 to-orange-600'
    }
  ];

  return (
    <>
      <style>{`
        @keyframes pulse-once {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        
        .animate-pulse-once {
          animation: pulse-once 0.6s ease-in-out;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes slideUp {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }

        .backdrop-blur-custom {
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
        }

        .chatbot-icon-float {
          animation: float 3s ease-in-out infinite;
        }

        .chatbot-icon-shadow {
          box-shadow: 0 10px 40px rgba(59, 130, 246, 0.4);
        }
      `}</style>
      
      <div className="min-h-screen bg-gradient-to-b from-bg-primary to-bg-secondary">
      <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-bg-secondary/95 backdrop-blur-lg shadow-lg' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center overflow-hidden">
                <img src="/CivicLink_logo.png" alt="CivicLink Logo" className="w-full h-full object-contain" />
              </div>
              <span className="text-2xl font-bold text-gray-900">CivicLink</span>
            </div>

            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-gray-700 hover:text-primary transition-colors font-medium">Features</a>
              <a href="#how-it-works" className="text-gray-700 hover:text-primary transition-colors font-medium">How It Works</a>
              <a href="#impact" className="text-gray-700 hover:text-primary transition-colors font-medium">Impact</a>
              <button onClick={() => handleNavigation('/login')} className="text-gray-700 hover:text-primary transition-colors font-medium">Login</button>
              <button onClick={() => handleNavigation('/signup')} className="px-6 py-2.5 bg-primary hover:bg-primary-light text-white rounded-lg hover:shadow-lg transition-all duration-300 font-medium">Get Started</button>
            </div>

            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden p-2 rounded-lg hover:bg-gray-100">
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {mobileMenuOpen && (
            <div className="md:hidden py-4 space-y-4 border-t border-bg-tertiary bg-bg-secondary/95 backdrop-blur-lg">
              <a href="#features" className="block py-2 text-gray-700 hover:text-primary font-medium">Features</a>
              <a href="#how-it-works" className="block py-2 text-gray-700 hover:text-primary font-medium">How It Works</a>
              <a href="#impact" className="block py-2 text-gray-700 hover:text-primary font-medium">Impact</a>
              <button onClick={() => handleNavigation('/login')} className="block w-full text-left py-2 text-gray-700 hover:text-primary font-medium">Login</button>
              <button onClick={() => handleNavigation('/signup')} className="block w-full px-6 py-2.5 bg-primary hover:bg-primary-light text-white rounded-lg text-center font-medium">Get Started</button>
            </div>
          )}
        </div>
      </nav>

      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary font-semibold mb-6 animate-pulse">
            <span className="w-2 h-2 bg-primary rounded-full"></span>
            Empowering Transparent Governance
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
            Digital Complaint<br />Tracker System
          </h1>
          
          <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
            Streamline citizen grievances, enhance accountability, and build trust through our comprehensive complaint management platform.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button onClick={() => handleNavigation('/signup')} className="group px-8 py-4 bg-primary hover:bg-primary-light text-white rounded-xl hover:shadow-2xl transition-all duration-300 font-semibold text-lg flex items-center gap-2">
              Start Tracking Now
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button onClick={() => handleNavigation('/login')} className="px-8 py-4 bg-bg-secondary text-gray-700 rounded-xl hover:shadow-lg transition-all duration-300 font-semibold text-lg border-2 border-bg-tertiary hover:border-primary">
              Sign In
            </button>
          </div>
        </div>
      </section>

      <section ref={statsRef} className="py-16 px-4 sm:px-6 lg:px-8 bg-bg-secondary">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div 
              key={index} 
              className="text-center transform transition-all duration-700 hover:scale-105"
              style={{
                opacity: statsInView ? 1 : 0,
                transform: statsInView ? 'translateY(0) scale(1)' : 'translateY(30px) scale(0.9)',
                transitionDelay: `${index * 150}ms`
              }}
            >
              <div className={`relative text-4xl md:text-5xl font-bold mb-2 transition-all duration-300 ${statsInView ? 'animate-pulse-once' : ''}`}>
                <span className={`bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>{stat.number}</span>
                {statsInView && <div className="absolute inset-0 blur-xl opacity-30 bg-gradient-to-r from-primary to-accent-green animate-pulse"></div>}
              </div>
              <div className="text-gray-600 font-medium text-sm md:text-base">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Powerful Features</h2>
            <p className="text-xl text-gray-600">Everything you need to manage complaints efficiently and transparently</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-bg-secondary rounded-2xl p-8 hover:shadow-xl transition-all duration-300 border border-bg-tertiary hover:border-primary group">
                <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8 bg-bg-secondary">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-xl text-gray-600">Simple, efficient, and transparent complaint resolution process</p>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            {[
              { step: "01", title: "Submit Complaint", desc: "File your grievance through our easy-to-use portal" },
              { step: "02", title: "Track Progress", desc: "Monitor status updates in real-time on your dashboard" },
              { step: "03", title: "Get Resolution", desc: "Receive updates and resolution from concerned departments" }
            ].map((item, index) => (
              <React.Fragment key={index}>
                <div className="flex-1 bg-bg-primary rounded-2xl p-8 text-center hover:shadow-xl transition-all duration-300 border-2 border-primary/20">
                  <div className="text-6xl font-bold text-primary/20 mb-4">{item.step}</div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">{item.title}</h3>
                  <p className="text-gray-600">{item.desc}</p>
                </div>
                {index < 2 && <div className="hidden md:block"><ArrowRight className="w-8 h-8 text-primary" /></div>}
              </React.Fragment>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Real-Time Status Tracking</h2>
            <p className="text-xl text-gray-600">Monitor your complaint progress with our intuitive status system</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            {[
              { status: 'Pending', color: 'status-pending', bg: 'status-pending-bg' },
              { status: 'In Progress', color: 'status-progress', bg: 'status-progress-bg' },
              { status: 'Urgent', color: 'status-urgent', bg: 'status-urgent-bg' },
              { status: 'Medium Priority', color: 'status-medium', bg: 'status-medium-bg' },
              { status: 'Resolved', color: 'status-resolved', bg: 'status-resolved-bg' }
            ].map((item, index) => (
              <div key={index} className={`bg-${item.bg} border-2 border-${item.color} rounded-xl p-6 text-center hover:shadow-lg transition-all duration-300`}>
                <div className={`text-${item.color} font-bold text-lg`}>{item.status}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="impact" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-primary to-primary-light">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Ready to Transform Governance?</h2>
          <p className="text-xl text-white/90 mb-10">Join thousands of citizens and departments using our platform</p>
          <button onClick={() => handleNavigation('/signup')} className="inline-flex items-center gap-2 px-8 py-4 bg-accent-green hover:bg-accent-green-light text-white rounded-xl hover:shadow-2xl transition-all duration-300 font-semibold text-lg group">
            Create Your Account
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </section>

      <footer className="bg-gray-900 text-gray-300 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center overflow-hidden">
                <img src="/CivicLink_logo.png" alt="CivicLink Logo" className="w-full h-full object-contain" />
              </div>
              <span className="text-xl font-bold text-white">CivicLink</span>
            </div>
            <p className="text-sm">Empowering transparent governance through efficient complaint management.</p>
          </div>

          <div>
            <h4 className="font-bold text-white mb-4">Platform</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
              <li><a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a></li>
              <li><a href="#impact" className="hover:text-white transition-colors">Impact</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white mb-4">Support</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white mb-4">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Cookie Policy</a></li>
            </ul>
          </div>
        </div>

        <div className="max-w-7xl mx-auto mt-8 pt-8 border-t border-gray-800 text-center text-sm">
          © 2025 CivicLink. All rights reserved.
        </div>
      </footer>

      {showChatbot && !isMinimized && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-custom z-[9998] animate-[fadeIn_0.3s_ease-in-out]"
          onClick={closeChatbot}
          style={{ animation: 'fadeIn 0.3s ease-in-out' }}
        />
      )}

      {!showChatbot && (
        <button
          onClick={openChatbot}
          className="fixed bottom-6 right-6 w-16 h-16 sm:w-20 sm:h-20 bg-white rounded-full shadow-2xl chatbot-icon-shadow hover:shadow-3xl transition-all duration-300 flex items-center justify-center z-50 group chatbot-icon-float border-4 border-blue-100"
          aria-label="Open chat"
        >
          <img 
            src="https://w7.pngwing.com/pngs/567/444/png-transparent-robotics-chatbot-technology-robot-education-electronics-computer-program-humanoid-robot.png"
            alt="AI Assistant"
            className="w-12 h-12 sm:w-14 sm:h-14 object-contain group-hover:scale-110 transition-transform duration-300"
          />
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-green-400 to-green-500 rounded-full animate-pulse border-2 border-white shadow-lg flex items-center justify-center">
            <span className="w-2 h-2 bg-white rounded-full"></span>
          </span>
        </button>
      )}

      {showChatbot && (
        <div 
          className={`fixed z-[9999] transition-all duration-300 animate-[slideUp_0.3s_ease-out]
            ${isMinimized ? 'bottom-6 right-6 w-80' : 'bottom-6 right-6 w-[90vw] max-w-md sm:w-96'}
          `}
          style={{ animation: 'slideUp 0.3s ease-out' }}
        >
          <div className={`bg-white overflow-hidden flex flex-col shadow-2xl border-2 border-blue-100 ${isMinimized ? 'h-16 rounded-2xl' : 'h-[70vh] max-h-[600px] rounded-2xl'}`}>
            <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 p-4 text-white flex-shrink-0 border-b-4 border-blue-800">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 bg-white rounded-full flex items-center justify-center shadow-lg relative overflow-hidden">
                    <img 
                      src="https://w7.pngwing.com/pngs/567/444/png-transparent-robotics-chatbot-technology-robot-education-electronics-computer-program-humanoid-robot.png"
                      alt="AI Assistant"
                      className="w-9 h-9 object-contain"
                    />
                    <span className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></span>
                  </div>
                  {!isMinimized && (
                    <div>
                      <h3 className="font-bold text-base sm:text-lg flex items-center gap-2">
                        CivicLink Assistant
                        <span className="text-xs bg-green-400 text-green-900 px-2 py-0.5 rounded-full font-semibold">Online</span>
                      </h3>
                      <p className="text-xs text-blue-100">Aapki madad ke liye!</p>
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={toggleMinimize} className="p-2 hover:bg-white/20 rounded-lg transition-colors" aria-label={isMinimized ? "Maximize" : "Minimize"}>
                    <Minimize2 className="w-4 h-4" />
                  </button>
                  <button onClick={closeChatbot} className="p-2 hover:bg-white/20 rounded-lg transition-colors" aria-label="Close chat">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {!isMinimized && (
              <>
                <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 sm:space-y-4 bg-gradient-to-b from-gray-50 to-blue-50">
                  {chatMessages.map((message, index) => (
                    <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[85%] rounded-2xl p-3 shadow-md ${
                        message.role === 'user'
                          ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white'
                          : 'bg-white border-2 border-blue-100 text-gray-800'
                      }`}>
                        {message.role === 'assistant' && (
                          <div className="flex items-center gap-2 mb-2 pb-2 border-b border-blue-100">
                            <div className="w-5 h-5 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                              <Bot className="w-3 h-3 text-white" />
                            </div>
                            <span className="text-xs font-bold text-blue-700">AI Assistant</span>
                          </div>
                        )}
                        <p className="text-sm whitespace-pre-wrap leading-relaxed">{message.content}</p>
                        <p className={`text-xs mt-2 ${message.role === 'user' ? 'text-blue-100' : 'text-gray-400'}`}>
                          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  ))}
                  
                  {isChatLoading && (
                    <div className="flex justify-start">
                      <div className="bg-white border-2 border-blue-100 rounded-2xl p-3 shadow-md">
                        <div className="flex items-center gap-2">
                          <Loader className="w-4 h-4 text-blue-600 animate-spin" />
                          <span className="text-sm text-gray-600 font-medium">Soch raha hoon...</span>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div ref={chatEndRef} />
                </div>

                <div className="p-3 sm:p-4 bg-white border-t-2 border-blue-100 flex-shrink-0">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      onKeyPress={handleChatKeyPress}
                      placeholder="CivicLink ke baare mein poochein..."
                      className="flex-1 px-4 py-3 border-2 border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm transition-all"
                      disabled={isChatLoading}
                    />
                    <button
                      onClick={sendChatMessage}
                      disabled={!chatInput.trim() || isChatLoading}
                      className="px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg hover:shadow-xl"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-2 text-center flex items-center justify-center gap-1">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                    CivicLink AI • Enter dabaayein
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
    </>
  );
}