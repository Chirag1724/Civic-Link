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

  // Intersection Observer for counter animation
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

  // Animated counter effect with easing
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

    // Animate 24/7 separately
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

    // Start animations with slight delays
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

  // Initialize chatbot with welcome message
  const openChatbot = () => {
    setShowChatbot(true);
    setIsMinimized(false);
    if (chatMessages.length === 0) {
      setChatMessages([
        {
          role: 'assistant',
          content: `👋 Hi there! Welcome to CivicLink!\n\nI'm your AI assistant. I can help you with:\n\n✨ Understanding how CivicLink works\n📝 Learning about complaint filing\n🎯 Exploring features\n💡 Getting started guide\n❓ Any questions about the platform\n\nHow can I help you today?`,
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

  // Smart response system for landing page
  const getSmartResponse = (question) => {
    const q = question.toLowerCase();
    
    // Greetings
    if (q.match(/^(hi|hello|hey|hii|hiii|namaste)/)) {
      return `Hello! 👋 Welcome to CivicLink - your digital solution for transparent governance!\n\nI'm here to help you understand how our platform works. What would you like to know?`;
    }
    
    // What is CivicLink
    if (q.includes('what is') || q.includes('about') || q.includes('civiclink') || q.includes('platform')) {
      return `**CivicLink** is a Digital Complaint Tracker System that:\n\n🎯 **Empowers Citizens**: File and track complaints easily\n🏛️ **Improves Governance**: Streamlines department workflows\n📊 **Ensures Transparency**: Real-time tracking and updates\n⚡ **Speeds Resolution**: Automated routing to right departments\n\nWe bridge the gap between citizens and civic authorities for better community service!`;
    }
    
    // How it works
    if (q.includes('how') && (q.includes('work') || q.includes('use') || q.includes('process'))) {
      return `Here's how CivicLink works:\n\n**1️⃣ Submit Complaint**\n• Choose type (Water/Electricity/Road)\n• Add location and description\n• Set priority level\n\n**2️⃣ Track Progress**\n• Real-time status updates\n• Worker assignment notifications\n• Timeline view of progress\n\n**3️⃣ Get Resolution**\n• Department reviews and acts\n• Worker completes the task\n• You receive confirmation\n\nSimple, transparent, and efficient! 🚀`;
    }
    
    // Features
    if (q.includes('feature') || q.includes('what can') || q.includes('capabilities')) {
      return `CivicLink offers powerful features:\n\n**For Citizens:**\n✅ Easy complaint filing\n✅ Real-time tracking\n✅ Status notifications\n✅ Complaint history\n\n**For Departments:**\n📊 Analytics dashboard\n👥 Worker management\n📈 Performance metrics\n🔄 Automated routing\n\n**For Everyone:**\n🔒 Secure & encrypted\n🌐 24/7 availability\n📱 Mobile-friendly\n\nWant to know more about any specific feature?`;
    }
    
    // Signup/Register
    if (q.includes('sign up') || q.includes('register') || q.includes('create account') || q.includes('join') || q.includes('get started')) {
      return `Getting started with CivicLink is easy!\n\n**Step 1**: Click the "Get Started" button at the top\n**Step 2**: Choose your role:\n• 👤 Citizen (File & track complaints)\n• 🏛️ Department (Manage complaints)\n• 👷 Worker (Resolve issues)\n\n**Step 3**: Fill in your details\n**Step 4**: Start using the platform!\n\nIt takes less than 2 minutes to sign up! Ready to begin? 🎯`;
    }
    
    // Login
    if (q.includes('login') || q.includes('sign in') || q.includes('log in')) {
      return `Already have an account? Great!\n\n**To Login:**\n1. Click the "Login" button at the top\n2. Enter your email and password\n3. Access your dashboard instantly\n\n**Forgot Password?**\nUse the password recovery option on the login page.\n\nNeed help logging in? Let me know! 🔐`;
    }
    
    // Complaint types
    if (q.includes('type') || q.includes('category') || q.includes('kind') || q.includes('complaint')) {
      return `We handle **3 main complaint types**:\n\n💧 **Water Issues**\n• Water leaks\n• Supply problems\n• Drainage issues\n• Water quality concerns\n\n⚡ **Electricity Problems**\n• Power outages\n• Faulty connections\n• Street light issues\n• Meter problems\n\n🚧 **Road Maintenance**\n• Potholes\n• Damaged roads\n• Construction debris\n• Traffic issues\n\nEach type is routed to the appropriate department automatically!`;
    }
    
    // Status/Tracking
    if (q.includes('status') || q.includes('track') || q.includes('progress') || q.includes('update')) {
      return `Track your complaints with our **5-stage status system**:\n\n🟡 **Pending**: Complaint received, awaiting review\n🔵 **In Progress**: Worker assigned, actively resolving\n🔴 **Urgent**: High priority, immediate attention\n🟠 **Medium**: Important, scheduled resolution\n🟢 **Resolved**: Issue fixed successfully\n\nYou get notifications at every stage! Plus, view detailed timeline of all actions taken. 📊`;
    }
    
    // Security/Privacy
    if (q.includes('secure') || q.includes('safe') || q.includes('privacy') || q.includes('data') || q.includes('encrypt')) {
      return `Your security is our priority! 🔒\n\n**Security Features:**\n✅ End-to-end encryption\n✅ Secure user authentication\n✅ Protected data storage\n✅ Privacy compliance\n✅ Regular security audits\n\n**Your Data:**\n• Only accessible to you and authorized departments\n• Never shared with third parties\n• Encrypted in transit and at rest\n\nYou can trust CivicLink with your information!`;
    }
    
    // Pricing/Cost
    if (q.includes('price') || q.includes('cost') || q.includes('free') || q.includes('paid') || q.includes('fee')) {
      return `Great news! 🎉\n\n**CivicLink is FREE for:**\n✅ All citizens\n✅ Filing unlimited complaints\n✅ Real-time tracking\n✅ Status notifications\n\n**For Departments:**\nContact us for institutional pricing and custom features.\n\nOur mission is to make civic engagement accessible to everyone!`;
    }
    
    // Mobile/App
    if (q.includes('mobile') || q.includes('app') || q.includes('phone') || q.includes('android') || q.includes('ios')) {
      return `CivicLink is fully mobile-responsive! 📱\n\n**Access from:**\n✅ Any web browser on your phone\n✅ Tablets and iPads\n✅ Desktop computers\n✅ Laptops\n\nNo app download needed! Just visit our website from any device and log in. The interface automatically adjusts for the best mobile experience.\n\nNative mobile apps coming soon! 🚀`;
    }
    
    // Departments
    if (q.includes('department') || q.includes('authority') || q.includes('government') || q.includes('who handles')) {
      return `CivicLink connects you with relevant departments:\n\n🏛️ **Municipal Departments:**\n• Water Supply Department\n• Electricity Board\n• Public Works Department (Roads)\n\n**How it works:**\n1. You file a complaint\n2. System auto-routes to correct department\n3. Department assigns available worker\n4. Worker resolves the issue\n5. You get notified\n\nNo more running from office to office! 🎯`;
    }
    
    // Time/Speed
    if (q.includes('how long') || q.includes('time') || q.includes('fast') || q.includes('quick') || q.includes('speed')) {
      return `Resolution times vary by priority:\n\n⚡ **High Priority**: 24-48 hours\n🟡 **Medium Priority**: 3-5 business days\n🟢 **Low Priority**: 5-7 business days\n\n**Target Goals:**\n• 95% resolution rate\n• 24/7 system availability\n• Instant complaint registration\n• Real-time status updates\n\nWe're committed to quick, efficient service! ⏱️`;
    }
    
    // Contact/Support
    if (q.includes('contact') || q.includes('support') || q.includes('help') || q.includes('email') || q.includes('phone')) {
      return `Need additional support?\n\n📧 **Email**: support@civiclink.com\n📞 **Phone**: 1800-CIVIC-LINK\n⏰ **Hours**: 24/7 Support Available\n\n**Other Resources:**\n📚 Help Center (detailed guides)\n📖 Documentation (for departments)\n💬 Live chat (right here!)\n\nI'm always here to answer your questions! 😊`;
    }
    
    // Benefits/Why use
    if (q.includes('why') || q.includes('benefit') || q.includes('advantage') || q.includes('better')) {
      return `Why choose CivicLink?\n\n**For Citizens:**\n✨ No more office visits\n✨ Track everything online\n✨ Transparent process\n✨ Quick resolutions\n✨ Historical records\n\n**For Government:**\n📊 Better accountability\n📈 Performance metrics\n🎯 Efficient resource allocation\n💰 Cost savings\n🤝 Improved citizen satisfaction\n\n**For Community:**\n🌟 Stronger trust in governance\n🏘️ Better maintained infrastructure\n🚀 Modern, digital approach\n\nEveryone wins with CivicLink! 🎉`;
    }
    
    // Statistics
    if (q.includes('stats') || q.includes('statistics') || q.includes('number') || q.includes('how many')) {
      return `CivicLink by the numbers:\n\n🎯 **Target Capacity**: 10,000+ complaints\n✅ **Resolution Goal**: 95% success rate\n⏰ **Availability**: 24/7 system uptime\n🏛️ **Departments**: 3 major departments supported\n\n**Vision:**\nWe're building a platform that can serve entire cities efficiently!\n\nWant to be part of this transformation? Sign up today! 🚀`;
    }
    
    // Demo/Trial
    if (q.includes('demo') || q.includes('trial') || q.includes('test') || q.includes('try')) {
      return `Want to see CivicLink in action?\n\n**Try it now:**\n1. Sign up for a free account\n2. Submit a test complaint\n3. Explore the dashboard\n4. Experience real-time tracking\n\nNo credit card required! No time limits!\n\n**For Departments:**\nContact us for a personalized demo and onboarding session.\n\nReady to get started? Click "Get Started" above! 🎯`;
    }
    
    // Default helpful response
    return `I'm here to help! I can tell you about:\n\n🔹 **Platform**: What CivicLink is and how it works\n🔹 **Features**: All the powerful capabilities\n🔹 **Getting Started**: How to sign up and use\n🔹 **Complaint Types**: Water, Electricity, Road issues\n🔹 **Tracking**: How to monitor your complaints\n🔹 **Security**: How we protect your data\n🔹 **Support**: How to get help\n\nWhat would you like to know more about? Just ask! 😊\n\nOr click "Get Started" to create your account now!`;
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

    try {
      // We are using Claude API first
      const systemPrompt = `You are a helpful AI assistant for CivicLink's landing page. CivicLink is a Digital Complaint Tracker System for transparent governance. 

Your role is to:
- Welcome visitors and explain what CivicLink is
- Help them understand the platform features
- Guide them through the signup process
- Answer questions about complaint types (Water, Electricity, Road)
- Explain how the tracking system works
- Address security and privacy concerns
- Be enthusiastic and encouraging about the platform

Keep responses concise, friendly, and helpful. Use emojis occasionally. Encourage visitors to sign up.`;

      const conversationHistory = chatMessages
        .filter(m => m.role !== 'system')
        .map(m => ({
          role: m.role,
          content: m.content
        }));

      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "anthropic-version": "2023-06-01"
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 800,
          system: systemPrompt,
          messages: [
            ...conversationHistory,
            { role: "user", content: currentInput }
          ],
        })
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.content && data.content.length > 0) {
        const assistantText = data.content
          .filter(block => block.type === 'text')
          .map(block => block.text)
          .join('\n');
        
        if (assistantText) {
          const assistantMessage = {
            role: 'assistant',
            content: assistantText,
            timestamp: new Date()
          };
          setChatMessages(prev => [...prev, assistantMessage]);
        } else {
          throw new Error('No text content');
        }
      } else {
        throw new Error('Invalid response');
      }
    } catch (error) {
      console.error('Chat error:', error);
      
      // Use smart fallback response
      const smartResponse = getSmartResponse(currentInput);
      
      const assistantMessage = {
        role: 'assistant',
        content: smartResponse,
        timestamp: new Date()
      };
      setChatMessages(prev => [...prev, assistantMessage]);
    } finally {
      setIsChatLoading(false);
    }
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
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
        }
        
        .animate-pulse-once {
          animation: pulse-once 0.6s ease-in-out;
        }
        
        @keyframes countUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
      
      <div className="min-h-screen bg-gradient-to-b from-bg-primary to-bg-secondary">
      {/* Navigation */}
      <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-bg-secondary/95 backdrop-blur-lg shadow-lg' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center overflow-hidden">
    <img 
      src="/CivicLink_logo.png" 
      alt="CivicLink Logo" 
      className="w-full h-full object-contain"
    />
  </div>
              <span className="text-2xl font-bold text-gray-900">CivicLink</span>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-gray-700 hover:text-primary transition-colors font-medium">Features</a>
              <a href="#how-it-works" className="text-gray-700 hover:text-primary transition-colors font-medium">How It Works</a>
              <a href="#impact" className="text-gray-700 hover:text-primary transition-colors font-medium">Impact</a>
              <button onClick={() => handleNavigation('/login')} className="text-gray-700 hover:text-primary transition-colors font-medium">
                Login
              </button>
              <button onClick={() => handleNavigation('/signup')} className="px-6 py-2.5 bg-primary hover:bg-primary-light text-white rounded-lg hover:shadow-lg transition-all duration-300 font-medium">
                Get Started
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden p-2 rounded-lg hover:bg-gray-100">
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden py-4 space-y-4 border-t border-bg-tertiary bg-bg-secondary/95 backdrop-blur-lg">
              <a href="#features" className="block py-2 text-gray-700 hover:text-primary font-medium">Features</a>
              <a href="#how-it-works" className="block py-2 text-gray-700 hover:text-primary font-medium">How It Works</a>
              <a href="#impact" className="block py-2 text-gray-700 hover:text-primary font-medium">Impact</a>
              <button onClick={() => handleNavigation('/login')} className="block w-full text-left py-2 text-gray-700 hover:text-primary font-medium">
                Login
              </button>
              <button onClick={() => handleNavigation('/signup')} className="block w-full px-6 py-2.5 bg-primary hover:bg-primary-light text-white rounded-lg text-center font-medium">
                Get Started
              </button>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
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

      {/* Stats Section */}
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
              <div className={`relative text-4xl md:text-5xl font-bold mb-2 transition-all duration-300 ${
                statsInView ? 'animate-pulse-once' : ''
              }`}>
                <span className={`bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
                  {stat.number}
                </span>
                {statsInView && (
                  <div className="absolute inset-0 blur-xl opacity-30 bg-gradient-to-r from-primary to-accent-green animate-pulse"></div>
                )}
              </div>
              <div className="text-gray-600 font-medium text-sm md:text-base">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
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

      {/* How It Works Section */}
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
                {index < 2 && (
                  <div className="hidden md:block">
                    <ArrowRight className="w-8 h-8 text-primary" />
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </section>

      {/* Status Overview Section */}
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

      {/* CTA Section */}
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

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center overflow-hidden">
    <img 
      src="/CivicLink_logo.png" 
      alt="CivicLink Logo" 
      className="w-full h-full object-contain"
    />
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

      {/* AI Chatbot - Bottom Right Corner */}
      {!showChatbot && (
        <button
          onClick={openChatbot}
          className="fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 flex items-center justify-center z-50 group animate-bounce"
          aria-label="Open chat"
        >
          <MessageCircle className="w-7 h-7 group-hover:scale-110 transition-transform" />
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full animate-pulse"></span>
        </button>
      )}

      {/* AI Chatbot Window */}
      {showChatbot && (
        <div className={`fixed bottom-6 right-6 z-50 transition-all duration-300 ${isMinimized ? 'w-80' : 'w-96'}`}>
          <div className={`bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col ${isMinimized ? 'h-16' : 'h-[600px]'}`}>
            {/* Chat Header */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                    <Bot className="w-5 h-5" />
                  </div>
                  {!isMinimized && (
                    <div>
                      <h3 className="font-bold">CivicLink Assistant</h3>
                      <p className="text-xs text-blue-100">Ask me anything!</p>
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={toggleMinimize}
                    className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
                    aria-label={isMinimized ? "Maximize" : "Minimize"}
                  >
                    <Minimize2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={closeChatbot}
                    className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
                    aria-label="Close chat"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {!isMinimized && (
              <>
                {/* Chat Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                  {chatMessages.map((message, index) => (
                    <div
                      key={index}
                      className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[85%] rounded-2xl p-3 ${
                          message.role === 'user'
                            ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white'
                            : 'bg-white border border-gray-200 text-gray-800 shadow-sm'
                        }`}
                      >
                        {message.role === 'assistant' && (
                          <div className="flex items-center gap-2 mb-2">
                            <Bot className="w-3 h-3 text-blue-600" />
                            <span className="text-xs font-semibold text-blue-600">AI Assistant</span>
                          </div>
                        )}
                        <p className="text-sm whitespace-pre-wrap leading-relaxed">{message.content}</p>
                        <p className={`text-xs mt-2 ${
                          message.role === 'user' ? 'text-blue-100' : 'text-gray-400'
                        }`}>
                          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  ))}
                  
                  {isChatLoading && (
                    <div className="flex justify-start">
                      <div className="bg-white border border-gray-200 rounded-2xl p-3 shadow-sm">
                        <div className="flex items-center gap-2">
                          <Loader className="w-4 h-4 text-blue-600 animate-spin" />
                          <span className="text-sm text-gray-600">Thinking...</span>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div ref={chatEndRef} />
                </div>

                {/* Chat Input */}
                <div className="p-3 bg-white border-t border-gray-200">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      onKeyPress={handleChatKeyPress}
                      placeholder="Ask about CivicLink..."
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
                      disabled={isChatLoading}
                    />
                    <button
                      onClick={sendChatMessage}
                      disabled={!chatInput.trim() || isChatLoading}
                      className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-2 text-center">
                    Powered by AI • Press Enter to send
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