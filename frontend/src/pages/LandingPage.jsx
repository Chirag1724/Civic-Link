import React, { useState, useEffect } from 'react';
import { FileText, CheckCircle, TrendingUp, Shield, Users, Clock, ArrowRight, Menu, X } from 'lucide-react';

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavigation = (path) => {
    window.location.href = path;
  };

  const features = [
    {
      icon: <FileText className="w-8 h-8" />,
      title: "Easy Filing",
      description: "Submit complaints effortlessly with our intuitive interface and track them in real-time."
    },
    {
      icon: <Clock className="w-8 h-8" />,
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
      icon: <CheckCircle className="w-8 h-8" />,
      title: "Status Updates",
      description: "Automatic notifications keep citizens informed at every stage."
    }
  ];

  const stats = [
    { number: "10K+", label: "Target Capacity" },
    { number: "95%", label: "Resolution Goal" },
    { number: "24/7", label: "System Availability" },
    { number: "50+", label: "Departments Supported" }
  ];

  return (
    <div className="min-h-screen bg-bg-primary">
      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-bg-secondary shadow-lg' : 'bg-transparent'}`}>
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
              <span className="text-2xl font-bold text-primary">
                CivicLink
              </span>
            </div>
            
            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-gray-700 hover:text-primary transition-colors font-medium">Features</a>
              <a href="#how-it-works" className="text-gray-700 hover:text-primary transition-colors font-medium">How It Works</a>
              <a href="#stats" className="text-gray-700 hover:text-primary transition-colors font-medium">Impact</a>
              <button onClick={() => handleNavigation('/login')} className="text-gray-700 hover:text-primary transition-colors font-medium">
                Login
              </button>
              <button onClick={() => handleNavigation('/signup')} className="px-6 py-2.5 bg-primary hover:bg-primary-light text-white rounded-lg hover:shadow-lg transition-all duration-300 font-medium">
                Get Started
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-bg-secondary border-t">
            <div className="px-4 py-4 space-y-3">
              <a href="#features" className="block py-2 text-gray-700 hover:text-primary font-medium">Features</a>
              <a href="#how-it-works" className="block py-2 text-gray-700 hover:text-primary font-medium">How It Works</a>
              <a href="#stats" className="block py-2 text-gray-700 hover:text-primary font-medium">Impact</a>
              <button onClick={() => handleNavigation('/login')} className="block w-full text-left py-2 text-gray-700 hover:text-primary font-medium">
                Login
              </button>
              <button onClick={() => handleNavigation('/signup')} className="block w-full px-6 py-2.5 bg-primary hover:bg-primary-light text-white rounded-lg text-center font-medium">
                Get Started
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent-green-light/10 border border-accent-green-light/20 rounded-full text-accent-green text-sm font-medium mb-6">
              <span className="w-2 h-2 bg-accent-green rounded-full animate-pulse"></span>
              Empowering Transparent Governance
            </div>
            
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
              Digital Complaint
              <span className="block text-primary">
                Tracker System
              </span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
              Streamline citizen grievances, enhance accountability, and build trust through our comprehensive complaint management platform.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button onClick={() => handleNavigation('/signup')} className="group px-8 py-4 bg-primary hover:bg-primary-light text-white rounded-xl hover:shadow-2xl transition-all duration-300 font-semibold text-lg flex items-center gap-2">
                Start Tracking Now
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button onClick={() => handleNavigation('/login')} className="px-8 py-4 bg-bg-secondary text-gray-700 rounded-xl hover:shadow-lg transition-all duration-300 font-semibold text-lg border-2 border-bg-tertiary hover:border-primary">
                Sign In
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div id="stats" className="py-16 px-4 sm:px-6 lg:px-8 bg-bg-secondary">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl lg:text-5xl font-bold text-primary mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-bg-primary">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Powerful Features</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Everything you need to manage complaints efficiently and transparently
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="group p-8 bg-bg-secondary rounded-2xl shadow-sm hover:shadow-2xl transition-all duration-300 border border-bg-tertiary hover:border-primary hover:-translate-y-1"
              >
                <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-primary to-primary-dark text-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              Simple, efficient, and transparent complaint resolution process
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: "01", title: "Submit Complaint", desc: "File your grievance through our easy-to-use portal" },
              { step: "02", title: "Track Progress", desc: "Monitor status updates in real-time on your dashboard" },
              { step: "03", title: "Get Resolution", desc: "Receive updates and resolution from concerned departments" }
            ].map((item, index) => (
              <div key={index} className="relative">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 hover:bg-white/20 transition-all duration-300 border border-white/10">
                  <div className="text-6xl font-bold text-white/20 mb-4">{item.step}</div>
                  <h3 className="text-2xl font-bold mb-3">{item.title}</h3>
                  <p className="text-blue-100">{item.desc}</p>
                </div>
                {index < 2 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-0.5 bg-white/30"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Status Overview Section */}
      <div className="py-20 px-4 sm:px-6 lg:px-8 bg-bg-secondary">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Real-Time Status Tracking</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Monitor your complaint progress with our intuitive status system
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-6">
            {[
              { status: 'Pending', color: 'status-pending', bg: 'status-pending-bg' },
              { status: 'In Progress', color: 'status-progress', bg: 'status-progress-bg' },
              { status: 'Urgent', color: 'status-urgent', bg: 'status-urgent-bg' },
              { status: 'Medium Priority', color: 'status-medium', bg: 'status-medium-bg' },
              { status: 'Resolved', color: 'status-resolved', bg: 'status-resolved-bg' }
            ].map((item, index) => (
              <div key={index} className={`p-6 bg-${item.bg} rounded-xl border-2 border-${item.color}/20 hover:border-${item.color} transition-all duration-300 hover:shadow-lg`}>
                <div className={`w-4 h-4 rounded-full bg-${item.color} mb-3`}></div>
                <h4 className={`text-lg font-bold text-${item.color}`}>{item.status}</h4>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 px-4 sm:px-6 lg:px-8 bg-bg-primary">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-br from-primary to-primary-dark rounded-3xl p-12 shadow-2xl">
            <h2 className="text-4xl font-bold text-white mb-4">
              Ready to Transform Governance?
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Join thousands of citizens and departments using our platform
            </p>
            <button onClick={() => handleNavigation('/signup')} className="inline-flex items-center gap-2 px-8 py-4 bg-accent-green hover:bg-accent-green-light text-white rounded-xl hover:shadow-2xl transition-all duration-300 font-semibold text-lg group">
              Create Your Account
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-primary-dark text-gray-300 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center overflow-hidden">
                  <img 
                    src="/CivicLink_logo.png" 
                    alt="CivicLink Logo" 
                    className="w-full h-full object-contain"
                  />
                </div>
                <span className="text-xl font-bold text-white">CivicLink</span>
              </div>
              <p className="text-sm text-gray-400">
                Empowering transparent governance through efficient complaint management.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold text-white mb-4">Platform</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#features" className="hover:text-accent-green-light transition-colors">Features</a></li>
                <li><a href="#how-it-works" className="hover:text-accent-green-light transition-colors">How It Works</a></li>
                <li><a href="#stats" className="hover:text-accent-green-light transition-colors">Impact</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-white mb-4">Support</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-accent-green-light transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-accent-green-light transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-accent-green-light transition-colors">Documentation</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-white mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-accent-green-light transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-accent-green-light transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-accent-green-light transition-colors">Cookie Policy</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-primary pt-8 text-center text-sm text-gray-400">
            <p>&copy; 2025 CivicLink. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}