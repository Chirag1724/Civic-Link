import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api';
import { 
  FileText, Droplet, Zap, Construction, MapPin, AlertCircle, Clock, CheckCircle, XCircle, 
  Filter, Plus, LogOut, User, TrendingUp, Search, Users, Eye, Phone, Mail, UserCheck,
  Calendar, MessageSquare, ArrowRight, Package, Truck, CheckCircle2, X, Send, Bot, Loader
} from 'lucide-react';

export default function CitizenDashboard() {
  const [form, setForm] = useState({ type: 'Water', description: '', location: '', priority: 'Medium' });
  const [myComplaints, setMyComplaints] = useState([]);
  const [allComplaints, setAllComplaints] = useState([]);
  const [filteredMyList, setFilteredMyList] = useState([]);
  const [filteredAllList, setFilteredAllList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [activeTab, setActiveTab] = useState('my');
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  
  // AI Support Chat States
  const [showSupportChat, setShowSupportChat] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);
  const chatEndRef = useRef(null);
  
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  const nav = useNavigate();

  useEffect(() => { 
    fetchMyComplaints();
    fetchAllComplaints();
  }, []);
  
  useEffect(() => {
    let filtered = myComplaints;
    if (filterStatus !== 'all') {
      filtered = filtered.filter(c => c.status === filterStatus);
    }
    if (searchTerm) {
      filtered = filtered.filter(c => 
        c.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    setFilteredMyList(filtered);
  }, [myComplaints, filterStatus, searchTerm]);

  useEffect(() => {
    let filtered = allComplaints;
    if (filterStatus !== 'all') {
      filtered = filtered.filter(c => c.status === filterStatus);
    }
    if (searchTerm) {
      filtered = filtered.filter(c => 
        c.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.citizenId?.name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    setFilteredAllList(filtered);
  }, [allComplaints, filterStatus, searchTerm]);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages]);

  async function fetchMyComplaints() {
    try {
      const res = await api.get('/complaints');
      setMyComplaints(res.data.list || []);
    } catch (err) {
      console.error(err);
    }
  }

  async function fetchAllComplaints() {
    try {
      const res = await api.get('/complaints/all');
      setAllComplaints(res.data.list || []);
    } catch (err) {
      console.error(err);
    }
  }

  async function submit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      await api.post('/complaints', form);
      alert('Complaint submitted successfully!');
      setForm({ type: 'Water', description: '', location: '', priority: 'Medium' });
      setShowForm(false);
      fetchMyComplaints();
      fetchAllComplaints();
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    } finally {
      setLoading(false);
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    nav('/login');
  };

  // AI Support Chat Functions
  const openSupportChat = () => {
    setShowSupportChat(true);
    if (chatMessages.length === 0) {
      setChatMessages([
        {
          role: 'assistant',
          content: `Hello ${user?.name}! 👋 I'm your AI Support Assistant for CivicLink. I'm here to help you with:\n\n• Understanding complaint statuses\n• Tracking your complaints\n• Explaining the resolution process\n• General queries about the system\n\nHow can I assist you today?`,
          timestamp: new Date()
        }
      ]);
    }
  };

  const closeSupportChat = () => {
    setShowSupportChat(false);
  };

  // Smart fallback response system
  const getSmartResponse = (question) => {
    const q = question.toLowerCase();
    
    // Greetings
    if (q.match(/^(hi|hello|hey|hii|hiii)/)) {
      return `Hello ${user?.name}! 👋 How can I help you with your complaints today?`;
    }
    
    // Status inquiries
    if (q.includes('status') || q.includes('what is') || q.includes('explain')) {
      if (selectedComplaint) {
        const status = selectedComplaint.status;
        if (status === 'Pending') {
          return `Your ${selectedComplaint.type} complaint is currently **Pending**. This means:\n\n✅ Your complaint has been successfully registered\n⏳ It's waiting for department review\n👀 Our team will review it within 24 hours\n\nYou'll be notified once it moves to the next stage!`;
        } else if (status === 'In Progress') {
          return `Great news! Your ${selectedComplaint.type} complaint is **In Progress**. This means:\n\n✅ A worker has been assigned\n🔧 They're actively working on resolving the issue\n📍 Location: ${selectedComplaint.location}\n\nTypically, this takes 2-3 days depending on the complexity. You can track real-time progress in the timeline above!`;
        } else if (status === 'Resolved') {
          return `Excellent! Your ${selectedComplaint.type} complaint has been **Resolved**! 🎉\n\n✅ The issue has been fixed\n✅ Worker completed the task\n${selectedComplaint.resolvedAt ? `✅ Resolved on: ${new Date(selectedComplaint.resolvedAt).toLocaleString()}` : ''}\n\nThank you for using CivicLink to make our community better!`;
        } else if (status === 'Rejected') {
          return `I see your ${selectedComplaint.type} complaint was **Rejected**. This could be due to:\n\n• Insufficient information provided\n• Issue doesn't fall under our jurisdiction\n• Duplicate complaint\n\nYou can register a new complaint with more details or contact support for clarification.`;
        }
      }
      return `Let me explain our complaint statuses:\n\n🟡 **Pending**: Complaint received, waiting for review\n🔵 **In Progress**: Worker assigned, actively resolving\n🟢 **Resolved**: Issue fixed successfully\n🔴 **Rejected**: Could not be processed\n\nYou can track your complaint's journey in the timeline view!`;
    }
    
    // Worker inquiries
    if (q.includes('worker') || q.includes('assigned') || q.includes('who')) {
      if (selectedComplaint && selectedComplaint.assignedTo) {
        return `Your complaint has been assigned to: **${selectedComplaint.assignedTo}**\n\n👷 Department: ${selectedComplaint.type}\n📍 Zone: ${selectedComplaint.assignedWorkers?.[0]?.location || 'Not specified'}\n\nThe worker is actively working on resolving your issue. You can see more details in the "Assigned Worker" card on the right!`;
      } else if (selectedComplaint) {
        return `A worker hasn't been assigned to your complaint yet. Here's what's happening:\n\n⏳ Your complaint is being reviewed\n👀 Our system is finding the best worker for your area\n⚡ Assignment typically happens within 24-48 hours\n\nYou'll be notified immediately once a worker is assigned!`;
      }
      return `Workers are assigned based on:\n\n📍 Your location\n⚡ Complaint priority\n🔧 Worker availability and expertise\n\nOnce assigned, you'll see their details including name, department, and zone in the complaint tracking view!`;
    }
    
    // Time/Duration inquiries
    if (q.includes('how long') || q.includes('when') || q.includes('time') || q.includes('duration')) {
      const priority = selectedComplaint?.priority;
      let timeframe = '3-5 business days';
      if (priority === 'High') timeframe = '24-48 hours';
      else if (priority === 'Low') timeframe = '5-7 business days';
      
      return `Resolution time depends on priority level:\n\n🔴 **High Priority**: 24-48 hours\n🟡 **Medium Priority**: 3-5 business days\n🟢 **Low Priority**: 5-7 business days\n\n${selectedComplaint ? `Your complaint is **${priority} Priority**, so expect resolution within **${timeframe}**.` : ''}\n\nComplex issues may take longer, but you can track progress in real-time!`;
    }
    
    // Location/Area inquiries
    if (q.includes('location') || q.includes('area') || q.includes('where')) {
      if (selectedComplaint) {
        return `Your complaint location:\n\n📍 **${selectedComplaint.location}**\n\nThis helps us assign the nearest available worker to resolve your issue quickly. Make sure the location details are accurate for faster service!`;
      }
      return `Location is important for:\n\n✅ Assigning nearby workers\n✅ Faster response times\n✅ Accurate service delivery\n\nAlways provide complete address details when registering a complaint!`;
    }
    
    // Priority inquiries
    if (q.includes('priority') || q.includes('urgent') || q.includes('important')) {
      return `Complaint priorities:\n\n🔴 **High**: Urgent issues (water leaks, power outages, major road damage)\n🟡 **Medium**: Important but not critical issues\n🟢 **Low**: Minor issues that can wait\n\n${selectedComplaint ? `Your complaint is marked as **${selectedComplaint.priority} Priority**.` : ''}\n\nPriority affects resolution time and worker assignment!`;
    }
    
    // Types of complaints
    if (q.includes('type') || q.includes('category') || q.includes('kind')) {
      return `We handle three types of complaints:\n\n💧 **Water**: Leaks, supply issues, drainage problems\n⚡ **Electricity**: Power outages, faulty connections, street lights\n🚧 **Road**: Potholes, damaged roads, construction issues\n\n${selectedComplaint ? `You're viewing a **${selectedComplaint.type}** complaint.` : ''}\n\nChoose the right category for faster resolution!`;
    }
    
    // How to register
    if (q.includes('register') || q.includes('submit') || q.includes('create') || q.includes('file') || q.includes('new complaint')) {
      return `To register a new complaint:\n\n1️⃣ Click "Register New Complaint" button\n2️⃣ Select complaint type (Water/Electricity/Road)\n3️⃣ Choose priority level\n4️⃣ Enter location details\n5️⃣ Describe the issue\n6️⃣ Submit!\n\nYou'll get immediate confirmation and can track progress in real-time. Easy! 🎯`;
    }
    
    // Tracking inquiries
    if (q.includes('track') || q.includes('progress') || q.includes('check') || q.includes('update')) {
      return `Track your complaints easily:\n\n📊 **My Complaints Tab**: See all your complaints\n🔍 **Track Button**: View detailed timeline\n📈 **Progress Timeline**: See each step of resolution\n🔔 **Status Updates**: Get notified of changes\n\nYou currently have ${myComplaints.length} complaint${myComplaints.length !== 1 ? 's' : ''} registered. ${myComplaints.filter(c => c.status === 'Pending').length} pending, ${myComplaints.filter(c => c.status === 'In Progress').length} in progress!`;
    }
    
    // Contact/Help
    if (q.includes('contact') || q.includes('help') || q.includes('support') || q.includes('phone') || q.includes('email')) {
      return `Need more help?\n\n📧 Email: support@civiclink.com\n📞 Phone: 1800-CIVIC-LINK\n⏰ Hours: 24/7 Support\n\n${selectedComplaint ? `For your current complaint (ID: ${selectedComplaint._id?.slice(-8)}), you can also wait for the assigned worker to contact you directly!` : ''}\n\nI'm here to answer questions anytime! 😊`;
    }
    
    // Stats/Numbers
    if (q.includes('how many') || q.includes('total') || q.includes('count') || q.includes('statistics')) {
      return `Your complaint statistics:\n\n📊 **Total Complaints**: ${myComplaints.length}\n⏳ **Pending**: ${myComplaints.filter(c => c.status === 'Pending').length}\n🔄 **In Progress**: ${myComplaints.filter(c => c.status === 'In Progress').length}\n✅ **Resolved**: ${myComplaints.filter(c => c.status === 'Resolved').length}\n\nYou're making a difference in your community! 🌟`;
    }
    
    // Default helpful response
    return `I'm here to help! I can answer questions about:\n\n✨ Complaint statuses and progress\n👷 Worker assignments\n⏰ Resolution timeframes\n📝 How to register complaints\n📊 Tracking your complaints\n\n${selectedComplaint ? `You're currently viewing your **${selectedComplaint.type}** complaint (Status: **${selectedComplaint.status}**).` : `You have **${myComplaints.length}** total complaint${myComplaints.length !== 1 ? 's' : ''}.`}\n\nWhat would you like to know? 😊`;
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
      // Prepare context about user's complaints
      const complaintContext = selectedComplaint 
        ? `Current complaint being viewed: Type: ${selectedComplaint.type}, Status: ${selectedComplaint.status}, Location: ${selectedComplaint.location}, Priority: ${selectedComplaint.priority}, Description: ${selectedComplaint.description}`
        : `User has ${myComplaints.length} total complaints. ${myComplaints.filter(c => c.status === 'Pending').length} pending, ${myComplaints.filter(c => c.status === 'In Progress').length} in progress, ${myComplaints.filter(c => c.status === 'Resolved').length} resolved.`;

      const systemPrompt = `You are a helpful AI assistant for CivicLink, a civic complaint management system. You help citizens with their queries about complaints related to Water, Electricity, and Road issues.

Current context:
- User name: ${user?.name}
- ${complaintContext}

Be friendly, concise, and helpful. Provide clear answers about complaint statuses, processes, and timelines. If asked about specific complaint details, reference the context provided. Keep responses professional but warm. Use emojis occasionally to be friendly.`;

      // Build conversation history properly
      const conversationHistory = chatMessages
        .filter(m => m.role !== 'system' && !m.isError)
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
          max_tokens: 1000,
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
          throw new Error('No text content in response');
        }
      } else {
        throw new Error('Invalid response structure from AI');
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

  const getTypeIcon = (type) => {
    switch(type) {
      case 'Water': return <Droplet className="w-5 h-5" />;
      case 'Electricity': return <Zap className="w-5 h-5" />;
      case 'Road': return <Construction className="w-5 h-5" />;
      default: return <FileText className="w-5 h-5" />;
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'Pending': return 'bg-status-pending-bg text-status-pending border-status-pending';
      case 'In Progress': return 'bg-status-progress-bg text-status-progress border-status-progress';
      case 'Resolved': return 'bg-status-resolved-bg text-status-resolved border-status-resolved';
      case 'Rejected': return 'bg-status-urgent-bg text-status-urgent border-status-urgent';
      default: return 'bg-gray-100 text-gray-600 border-gray-300';
    }
  };

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'High': return 'bg-status-urgent-bg text-status-urgent border-status-urgent';
      case 'Medium': return 'bg-status-medium-bg text-status-medium border-status-medium';
      case 'Low': return 'bg-status-low-bg text-status-low border-status-low';
      default: return 'bg-gray-100 text-gray-600 border-gray-300';
    }
  };

  const getComplaintTimeline = (complaint) => {
    const timeline = [];
    
    timeline.push({
      status: 'completed',
      title: 'Complaint Registered',
      description: 'Your complaint has been successfully submitted',
      date: complaint.createdAt ? new Date(complaint.createdAt).toLocaleString() : 'N/A',
      icon: <FileText className="w-5 h-5" />
    });

    if (['In Progress', 'Resolved', 'Rejected'].includes(complaint.status)) {
      timeline.push({
        status: 'completed',
        title: 'Under Review',
        description: 'Complaint is being reviewed by the department',
        date: complaint.createdAt ? new Date(new Date(complaint.createdAt).getTime() + 3600000).toLocaleString() : 'N/A',
        icon: <Search className="w-5 h-5" />
      });
    } else {
      timeline.push({
        status: 'current',
        title: 'Under Review',
        description: 'Waiting for department review',
        date: 'In Progress',
        icon: <Search className="w-5 h-5" />
      });
    }

    if (complaint.assignedTo) {
      timeline.push({
        status: 'completed',
        title: 'Worker Assigned',
        description: `Assigned to: ${complaint.assignedTo}`,
        date: complaint.assignedAt ? new Date(complaint.assignedAt).toLocaleString() : 'Assigned',
        icon: <UserCheck className="w-5 h-5" />,
        showWorkerInfo: true
      });
    } else if (['In Progress', 'Resolved'].includes(complaint.status)) {
      timeline.push({
        status: 'current',
        title: 'Assigning Worker',
        description: 'Finding the best worker for your complaint',
        date: 'In Progress',
        icon: <UserCheck className="w-5 h-5" />
      });
    } else {
      timeline.push({
        status: 'pending',
        title: 'Worker Assignment',
        description: 'Worker will be assigned soon',
        date: 'Pending',
        icon: <UserCheck className="w-5 h-5" />
      });
    }

    if (complaint.status === 'In Progress') {
      timeline.push({
        status: 'current',
        title: 'Work in Progress',
        description: 'Worker is actively resolving the issue',
        date: 'Ongoing',
        icon: <Construction className="w-5 h-5" />
      });
    } else if (complaint.status === 'Resolved') {
      timeline.push({
        status: 'completed',
        title: 'Work Completed',
        description: 'Issue has been addressed by the worker',
        date: complaint.resolvedAt ? new Date(new Date(complaint.resolvedAt).getTime() - 1800000).toLocaleString() : 'Completed',
        icon: <Construction className="w-5 h-5" />
      });
    } else if (complaint.status === 'Rejected') {
      timeline.push({
        status: 'rejected',
        title: 'Complaint Rejected',
        description: 'Your complaint could not be processed',
        date: complaint.updatedAt ? new Date(complaint.updatedAt).toLocaleString() : 'N/A',
        icon: <XCircle className="w-5 h-5" />
      });
      return timeline;
    } else {
      timeline.push({
        status: 'pending',
        title: 'Work in Progress',
        description: 'Awaiting worker action',
        date: 'Pending',
        icon: <Construction className="w-5 h-5" />
      });
    }

    if (complaint.status === 'Resolved') {
      timeline.push({
        status: 'completed',
        title: 'Complaint Resolved',
        description: 'Your complaint has been successfully resolved',
        date: complaint.resolvedAt ? new Date(complaint.resolvedAt).toLocaleString() : 'Resolved',
        icon: <CheckCircle className="w-5 h-5" />
      });
    } else if (complaint.status !== 'Rejected') {
      timeline.push({
        status: 'pending',
        title: 'Resolution',
        description: 'Final step - complaint resolution',
        date: 'Pending',
        icon: <CheckCircle className="w-5 h-5" />
      });
    }

    return timeline;
  };

  const openDetailModal = (complaint) => {
    setSelectedComplaint(complaint);
    setShowDetailModal(true);
  };

  const currentList = activeTab === 'my' ? myComplaints : allComplaints;
  const filteredList = activeTab === 'my' ? filteredMyList : filteredAllList;

  const stats = [
    { label: 'My Total', value: myComplaints.length, color: 'primary' },
    { label: 'My Pending', value: myComplaints.filter(c => c.status === 'Pending').length, color: 'status-pending' },
    { label: 'My In Progress', value: myComplaints.filter(c => c.status === 'In Progress').length, color: 'status-progress' },
    { label: 'My Resolved', value: myComplaints.filter(c => c.status === 'Resolved').length, color: 'status-resolved' }
  ];

  return (
    <div className="min-h-screen bg-bg-primary">
      {/* Top Navigation */}
      <nav className="bg-bg-secondary border-b border-bg-tertiary shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center overflow-hidden">
                  <img 
                    src="/CivicLink_logo.png" 
                    alt="CivicLink Logo" 
                    className="w-full h-full object-contain"
                  />
                </div>
                <div>
                 <h1 className="text-xl font-bold text-gray-900">Citizen Dashboard</h1>
                <p className="text-xs text-gray-500">Register and view complaints</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-4 py-2 bg-bg-primary rounded-lg">
                <User className="w-5 h-5 text-primary" />
                <span className="text-sm font-medium text-gray-700">{user?.name}</span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-status-urgent hover:bg-status-urgent-bg rounded-lg transition-colors"
              >
                <LogOut className="w-5 h-5" />
                <span className="text-sm font-medium">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-bg-secondary rounded-xl shadow-sm border border-bg-tertiary p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                  <p className={`text-3xl font-bold text-${stat.color}`}>{stat.value}</p>
                </div>
                <TrendingUp className={`w-10 h-10 text-${stat.color} opacity-20`} />
              </div>
            </div>
          ))}
        </div>

        {/* New Complaint Button */}
        <div className="mb-6">
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary-light text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 font-medium"
          >
            <Plus className="w-5 h-5" />
            {showForm ? 'Cancel' : 'Register New Complaint'}
          </button>
        </div>

        {/* Complaint Form */}
        {showForm && (
          <div className="bg-bg-secondary rounded-xl shadow-lg border border-bg-tertiary p-8 mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <FileText className="w-6 h-6 text-primary" />
              Register New Complaint
            </h3>
            
            {error && (
              <div className="mb-6 p-4 bg-status-urgent-bg border border-status-urgent/20 rounded-lg flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-status-urgent flex-shrink-0 mt-0.5" />
                <p className="text-sm text-status-urgent">{error}</p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Complaint Type
                </label>
                <select
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none"
                  value={form.type}
                  onChange={e => setForm({ ...form, type: e.target.value })}
                >
                  <option value="Water">Water</option>
                  <option value="Electricity">Electricity</option>
                  <option value="Road">Road</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Priority Level
                </label>
                <select
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none"
                  value={form.priority}
                  onChange={e => setForm({ ...form, priority: e.target.value })}
                >
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MapPin className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none"
                    placeholder="Enter location details"
                    value={form.location}
                    onChange={e => setForm({ ...form, location: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none resize-none"
                  rows="4"
                  placeholder="Describe your complaint in detail..."
                  value={form.description}
                  onChange={e => setForm({ ...form, description: e.target.value })}
                  required
                ></textarea>
              </div>

              <div className="md:col-span-2">
                <button
                  onClick={submit}
                  disabled={loading}
                  className="w-full md:w-auto px-8 py-3 bg-primary hover:bg-primary-light text-white font-semibold rounded-lg transition-all duration-300 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Submitting...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-5 h-5" />
                      Submit Complaint
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => {
              setActiveTab('my');
              setFilterStatus('all');
              setSearchTerm('');
            }}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
              activeTab === 'my' 
                ? 'bg-primary text-white shadow-md' 
                : 'bg-bg-secondary text-gray-600 hover:bg-bg-tertiary'
            }`}
          >
            <User className="w-5 h-5" />
            My Complaints
          </button>
          <button
            onClick={() => {
              setActiveTab('all');
              setFilterStatus('all');
              setSearchTerm('');
            }}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
              activeTab === 'all' 
                ? 'bg-primary text-white shadow-md' 
                : 'bg-bg-secondary text-gray-600 hover:bg-bg-tertiary'
            }`}
          >
            <Users className="w-5 h-5" />
            All Complaints
          </button>
        </div>

        {/* Complaints List */}
        <div className="bg-bg-secondary rounded-xl shadow-lg border border-bg-tertiary p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <h3 className="text-2xl font-bold text-gray-900">
              {activeTab === 'my' ? 'Your Complaints' : 'All User Complaints'}
            </h3>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-gray-500" />
                <select
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none"
                  value={filterStatus}
                  onChange={e => setFilterStatus(e.target.value)}
                >
                  <option value="all">All Status</option>
                  <option value="Pending">Pending</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Resolved">Resolved</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-bg-tertiary">
                  {activeTab === 'all' && (
                    <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700">Citizen</th>
                  )}
                  <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700">Type</th>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700">Location</th>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700">Priority</th>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700">Status</th>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700">Date</th>
                  {activeTab === 'my' && (
                    <th className="text-center py-4 px-4 text-sm font-semibold text-gray-700">Actions</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {filteredList.length === 0 ? (
                  <tr>
                    <td colSpan={activeTab === 'my' ? "7" : "6"} className="text-center py-12 text-gray-500">
                      <FileText className="w-12 h-12 mx-auto mb-3 opacity-20" />
                      <p className="text-lg font-medium">No complaints found</p>
                      <p className="text-sm">Try adjusting your filters or create a new complaint</p>
                    </td>
                  </tr>
                ) : (
                  filteredList.map(c => (
                    <tr key={c._id} className="border-b border-bg-tertiary hover:bg-bg-primary transition-colors">
                      {activeTab === 'all' && (
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                              <User className="w-4 h-4 text-primary" />
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{c.citizenId?.name || 'Unknown'}</p>
                              <p className="text-xs text-gray-500">{c.citizenId?.email || ''}</p>
                            </div>
                          </div>
                        </td>
                      )}
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-primary/10 rounded-lg text-primary">
                            {getTypeIcon(c.type)}
                          </div>
                          <span className="font-medium text-gray-900">{c.type}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2 text-gray-700">
                          <MapPin className="w-4 h-4 text-gray-400" />
                          {c.location}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${getPriorityColor(c.priority)}`}>
                          {c.priority}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(c.status)}`}>
                          {c.status}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-gray-600 text-sm">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-gray-400" />
                          {c.createdAt ? new Date(c.createdAt).toLocaleDateString() : 'N/A'}
                        </div>
                      </td>
                      {activeTab === 'my' && (
                        <td className="py-4 px-4">
                          <div className="flex items-center justify-center">
                            <button
                              onClick={() => openDetailModal(c)}
                              className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary-light text-white rounded-lg transition-all text-sm font-medium"
                              title="Track Progress"
                            >
                              <Eye className="w-4 h-4" />
                              Track
                            </button>
                          </div>
                        </td>
                      )}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Detailed Tracking Modal */}
      {showDetailModal && selectedComplaint && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 overflow-y-auto">
          <div className="min-h-screen flex items-center justify-center p-4 py-8">
            <div className="bg-bg-secondary rounded-xl shadow-2xl max-w-4xl w-full relative">
            {/* Modal Header */}
            <div className="sticky top-0 z-10 bg-bg-secondary p-6 border-b border-bg-tertiary rounded-t-xl">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-3 bg-primary/10 rounded-xl text-primary">
                      {getTypeIcon(selectedComplaint.type)}
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900">
                        {selectedComplaint.type} Complaint
                      </h3>
                      <p className="text-sm text-gray-500">ID: {selectedComplaint._id?.slice(-8)}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 mt-4">
                    <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold border ${getStatusColor(selectedComplaint.status)}`}>
                      {selectedComplaint.status}
                    </span>
                    <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold border ${getPriorityColor(selectedComplaint.priority)}`}>
                      {selectedComplaint.priority} Priority
                    </span>
                  </div>
                </div>
                
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="p-2 hover:bg-bg-tertiary rounded-lg transition-colors"
                >
                  <X className="w-6 h-6 text-gray-500" />
                </button>
              </div>
            </div>

            <div className="p-6 max-h-[calc(100vh-250px)] overflow-y-auto">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column - Timeline */}
                <div className="lg:col-span-2">
                  <h4 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <Package className="w-5 h-5 text-primary" />
                    Progress Timeline
                  </h4>
                  
                  <div className="relative">
                    <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-bg-tertiary"></div>
                    
                    {getComplaintTimeline(selectedComplaint).map((step, index) => (
                      <div key={index} className="relative pl-16 pb-8 last:pb-0">
                        <div className={`absolute left-0 w-12 h-12 rounded-full flex items-center justify-center border-4 border-bg-secondary z-10 ${
                          step.status === 'completed' ? 'bg-accent-green text-white' :
                          step.status === 'current' ? 'bg-primary text-white animate-pulse' :
                          step.status === 'rejected' ? 'bg-status-urgent text-white' :
                          'bg-gray-300 text-gray-500'
                        }`}>
                          {step.icon}
                        </div>
                        
                        <div className={`bg-bg-primary rounded-lg p-4 border ${
                          step.status === 'completed' ? 'border-accent-green/20' :
                          step.status === 'current' ? 'border-primary/20' :
                          step.status === 'rejected' ? 'border-status-urgent/20' :
                          'border-bg-tertiary'
                        }`}>
                          <div className="flex items-start justify-between mb-2">
                            <h5 className="font-bold text-gray-900">{step.title}</h5>
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              step.status === 'completed' ? 'bg-accent-green/10 text-accent-green' :
                              step.status === 'current' ? 'bg-primary/10 text-primary' :
                              step.status === 'rejected' ? 'bg-status-urgent/10 text-status-urgent' :
                              'bg-gray-100 text-gray-500'
                            }`}>
                              {step.status === 'completed' ? 'Completed' :
                               step.status === 'current' ? 'Current' :
                               step.status === 'rejected' ? 'Rejected' :
                               'Pending'}
                            </span>
                          </div>
                          
                          <p className="text-sm text-gray-600 mb-2">{step.description}</p>
                          
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <Clock className="w-3 h-3" />
                            {step.date}
                          </div>

                          {step.showWorkerInfo && selectedComplaint.assignedWorkers && selectedComplaint.assignedWorkers.length > 0 && (
                            <div className="mt-4 p-3 bg-accent-green/10 border border-accent-green/20 rounded-lg">
                              <h6 className="text-xs font-semibold text-gray-700 mb-2 flex items-center gap-1">
                                <UserCheck className="w-3 h-3" />
                                Assigned Workers
                              </h6>
                              <div className="space-y-2">
                                {selectedComplaint.assignedWorkers.map((worker, idx) => (
                                  <div key={idx} className="text-xs text-gray-700">
                                    <p className="font-medium">{worker.name}</p>
                                    <p className="text-gray-500">Location: {worker.location}</p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right Column - Details */}
                <div className="space-y-6">
                  {/* Complaint Details Card */}
                  <div className="bg-bg-primary rounded-lg p-5 border border-bg-tertiary">
                    <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <FileText className="w-5 h-5 text-primary" />
                      Details
                    </h4>
                    
                    <div className="space-y-4">
                      <div>
                        <p className="text-xs font-medium text-gray-500 mb-1">Location</p>
                        <div className="flex items-start gap-2">
                          <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                          <p className="text-sm text-gray-900">{selectedComplaint.location}</p>
                        </div>
                      </div>
                      
                      <div>
                        <p className="text-xs font-medium text-gray-500 mb-1">Description</p>
                        <p className="text-sm text-gray-900 bg-bg-secondary p-3 rounded-lg">
                          {selectedComplaint.description}
                        </p>
                      </div>
                      
                      <div>
                        <p className="text-xs font-medium text-gray-500 mb-1">Submitted On</p>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <p className="text-sm text-gray-900">
                            {selectedComplaint.createdAt ? new Date(selectedComplaint.createdAt).toLocaleString() : 'N/A'}
                          </p>
                        </div>
                      </div>

                      {selectedComplaint.resolvedAt && (
                        <div>
                          <p className="text-xs font-medium text-gray-500 mb-1">Resolved On</p>
                          <div className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-accent-green" />
                            <p className="text-sm text-gray-900">
                              {new Date(selectedComplaint.resolvedAt).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Worker Contact Card */}
                  {selectedComplaint.assignedTo && selectedComplaint.assignedWorkers && selectedComplaint.assignedWorkers.length > 0 && (
                    <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-lg p-5 border border-primary/20">
                      <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <UserCheck className="w-5 h-5 text-primary" />
                        Assigned Worker
                      </h4>
                      
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                            <User className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">{selectedComplaint.assignedTo}</p>
                            <p className="text-xs text-gray-600">
                              {selectedComplaint.type} Department
                            </p>
                          </div>
                        </div>

                        {selectedComplaint.assignedWorkers[0] && (
                          <div className="space-y-2 pt-3 border-t border-primary/20">
                            <p className="text-xs font-medium text-gray-600">Zone</p>
                            <p className="text-sm text-gray-900 flex items-center gap-2">
                              <MapPin className="w-3 h-3" />
                              {selectedComplaint.assignedWorkers[0].location}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* AI Support Card */}
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-5 border border-blue-200">
                    <h4 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                      <Bot className="w-5 h-5 text-blue-600" />
                      AI Support Assistant
                    </h4>
                    <p className="text-xs text-gray-600 mb-3">
                      Have questions about your complaint? Chat with our AI assistant for instant help.
                    </p>
                    <button 
                      onClick={openSupportChat}
                      className="w-full px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg text-sm font-medium transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                    >
                      <MessageSquare className="w-4 h-4" />
                      Chat with AI Support
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="sticky bottom-0 p-6 border-t border-bg-tertiary bg-bg-primary/95 backdrop-blur-sm rounded-b-xl">
              <button
                onClick={() => setShowDetailModal(false)}
                className="w-full px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-medium transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
      )}

      {/* AI Support Chat Window */}
      {showSupportChat && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-[60] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl h-[600px] flex flex-col overflow-hidden">
            {/* Chat Header */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                    <Bot className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">AI Support Assistant</h3>
                    <p className="text-sm text-blue-100">Always here to help you</p>
                  </div>
                </div>
                <button
                  onClick={closeSupportChat}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50">
              {chatMessages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl p-4 ${
                      message.role === 'user'
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white'
                        : message.isError
                        ? 'bg-red-50 border border-red-200 text-red-800'
                        : 'bg-white border border-gray-200 text-gray-800 shadow-sm'
                    }`}
                  >
                    {message.role === 'assistant' && !message.isError && (
                      <div className="flex items-center gap-2 mb-2">
                        <Bot className="w-4 h-4 text-blue-600" />
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
                  <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm">
                    <div className="flex items-center gap-2">
                      <Loader className="w-4 h-4 text-blue-600 animate-spin" />
                      <span className="text-sm text-gray-600">AI is thinking...</span>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={chatEndRef} />
            </div>

            {/* Chat Input */}
            <div className="p-4 bg-white border-t border-gray-200">
              <div className="flex gap-3">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyPress={handleChatKeyPress}
                  placeholder="Type your message..."
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  disabled={isChatLoading}
                />
                <button
                  onClick={sendChatMessage}
                  disabled={!chatInput.trim() || isChatLoading}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-md hover:shadow-lg"
                >
                  <Send className="w-4 h-4" />
                  Send
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-2 text-center">
                Powered by Claude AI • Press Enter to send
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}