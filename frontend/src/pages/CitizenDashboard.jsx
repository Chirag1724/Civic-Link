import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api';
import { 
  FileText, Droplet, Zap, Construction, MapPin, AlertCircle, Clock, CheckCircle, XCircle, 
  Filter, Plus, LogOut, User, TrendingUp, Search, Users, Eye, Phone, Mail, UserCheck,
  Calendar, MessageSquare, ArrowRight, Package, Truck, CheckCircle2, X, Send, Bot, Loader, Minimize2
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
  
  // AI Support Chat States - Updated
  const [showSupportChat, setShowSupportChat] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
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

  // AI Support Chat Functions - Updated with better responses
  const openSupportChat = () => {
    setShowSupportChat(true);
    setIsMinimized(false);
    if (chatMessages.length === 0) {
      setChatMessages([
        {
          role: 'assistant',
          content: `Namaste ${user?.name}! 👋\n\nMain aapka AI Support Assistant hoon. Main aapki madad kar sakta hoon:\n\n✨ Complaint status samajhne mein\n📊 Apne complaints track karne mein\n⏰ Resolution process ke baare mein\n❓ System ke kisi bhi sawal mein\n\n${myComplaints.length > 0 ? `Aapke paas currently **${myComplaints.length}** complaint${myComplaints.length !== 1 ? 's' : ''} hai:\n• Pending: ${myComplaints.filter(c => c.status === 'Pending').length}\n• In Progress: ${myComplaints.filter(c => c.status === 'In Progress').length}\n• Resolved: ${myComplaints.filter(c => c.status === 'Resolved').length}` : 'Aapne abhi tak koi complaint register nahi ki.'}\n\nKaise madad kar sakta hoon?`,
          timestamp: new Date()
        }
      ]);
    }
  };

  const closeSupportChat = () => {
    setShowSupportChat(false);
  };

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  // Enhanced smart fallback response system - NO BACKEND NEEDED
  const getSmartResponse = (question) => {
    const q = question.toLowerCase();
    
    // Greetings
    if (q.match(/^(hi|hello|hey|hii|hiii|namaste|namaskar)/)) {
      return `Namaste ${user?.name}! 🙏\n\nMain yahan hoon aapki help ke liye. Aap apne complaints ke baare mein kuch bhi pooch sakte hain!\n\n${myComplaints.length > 0 ? `Aapke **${myComplaints.length}** complaint${myComplaints.length !== 1 ? 's' : ''} hain dashboard pe.` : ''}`;
    }
    
    // Status inquiries
    if (q.includes('status') || q.includes('kya hai') || q.includes('explain') || q.includes('samjhao')) {
      if (selectedComplaint) {
        const status = selectedComplaint.status;
        if (status === 'Pending') {
          return `Aapki **${selectedComplaint.type}** complaint **Pending** status mein hai:\n\n✅ Complaint successfully register ho gayi\n⏳ Department review kar raha hai\n👀 24 hours ke andar action lega\n\nAapko notification milegi jab status change hoga!`;
        } else if (status === 'In Progress') {
          return `Bahut acchi khabar! Aapki **${selectedComplaint.type}** complaint **In Progress** hai:\n\n✅ Worker assign ho gaya hai\n🔧 Issue resolve ho raha hai\n📍 Location: ${selectedComplaint.location}\n\n${selectedComplaint.assignedTo ? `Assigned Worker: **${selectedComplaint.assignedTo}**\n\n` : ''}Usually 2-3 din lagta hai. Timeline mein real-time progress dekh sakte hain!`;
        } else if (status === 'Resolved') {
          return `Excellent! Aapki **${selectedComplaint.type}** complaint **Resolved** ho gayi! 🎉\n\n✅ Issue fix ho gaya\n✅ Worker ne kaam complete kiya\n${selectedComplaint.resolvedAt ? `✅ Resolved Date: ${new Date(selectedComplaint.resolvedAt).toLocaleString()}` : ''}\n\nCivicLink use karne ke liye shukriya!`;
        } else if (status === 'Rejected') {
          return `Aapki **${selectedComplaint.type}** complaint **Rejected** ho gayi. Possible reasons:\n\n• Information incomplete thi\n• Hamari jurisdiction mein nahi aata\n• Duplicate complaint\n\nAap zyada details ke saath naya complaint register kar sakte hain!`;
        }
      }
      return `Complaint statuses:\n\n🟡 **Pending**: Complaint receive ho gayi, review pending\n🔵 **In Progress**: Worker assign, actively resolving\n🟢 **Resolved**: Issue successfully fix ho gaya\n🔴 **Rejected**: Process nahi ho saka\n\n${myComplaints.length > 0 ? `\nAapke complaints:\n• Total: ${myComplaints.length}\n• Pending: ${myComplaints.filter(c => c.status === 'Pending').length}\n• In Progress: ${myComplaints.filter(c => c.status === 'In Progress').length}\n• Resolved: ${myComplaints.filter(c => c.status === 'Resolved').length}` : ''}`;
    }
    
    // Worker inquiries
    if (q.includes('worker') || q.includes('assigned') || q.includes('kaun') || q.includes('who')) {
      if (selectedComplaint && selectedComplaint.assignedTo) {
        return `Aapki complaint assign hui hai:\n\n👷 **${selectedComplaint.assignedTo}**\n📋 Department: ${selectedComplaint.type}\n📍 Zone: ${selectedComplaint.assignedWorkers?.[0]?.location || 'Not specified'}\n\nWorker actively kaam kar raha hai. Details "Assigned Worker" card mein dekh sakte hain!`;
      } else if (selectedComplaint) {
        return `Abhi tak worker assign nahi hua:\n\n⏳ Complaint review ho raha hai\n👀 Best worker dhund rahe hain\n⚡ 24-48 hours mein assign hoga\n\nNotification milegi jab worker assign hoga!`;
      }
      return `Workers assign hote hain based on:\n\n📍 Aapka location\n⚡ Complaint priority\n🔧 Worker availability\n\n${myComplaints.length > 0 ? `Aapke ${myComplaints.filter(c => c.assignedTo).length} complaints mein workers assign ho chuke hain.` : ''}`;
    }
    
    // Time/Duration inquiries
    if (q.includes('kitna time') || q.includes('how long') || q.includes('when') || q.includes('kab') || q.includes('duration')) {
      const priority = selectedComplaint?.priority;
      let timeframe = '3-5 din';
      let timeframeEng = '3-5 business days';
      if (priority === 'High') {
        timeframe = '24-48 ghante';
        timeframeEng = '24-48 hours';
      } else if (priority === 'Low') {
        timeframe = '5-7 din';
        timeframeEng = '5-7 business days';
      }
      
      return `Resolution time priority par depend karta hai:\n\n🔴 **High Priority**: 24-48 ghante\n🟡 **Medium Priority**: 3-5 din\n🟢 **Low Priority**: 5-7 din\n\n${selectedComplaint ? `Aapki complaint **${priority} Priority** hai, toh **${timeframe}** mein resolve hogi.` : ''}\n\nComplex issues mein time zyada lag sakta hai. Real-time progress track kar sakte hain!`;
    }
    
    // Location inquiries
    if (q.includes('location') || q.includes('area') || q.includes('kaha') || q.includes('where') || q.includes('jagah')) {
      if (selectedComplaint) {
        return `Aapki complaint ka location:\n\n📍 **${selectedComplaint.location}**\n\nYeh location help karta hai nearest worker assign karne mein. Accurate location se faster service milti hai!`;
      }
      return `Location important hai kyunki:\n\n✅ Nearby workers assign hote hain\n✅ Fast response milta hai\n✅ Accurate service delivery\n\nComplaint register karte waqt complete address dena zaroori hai!`;
    }
    
    // Priority inquiries
    if (q.includes('priority') || q.includes('urgent') || q.includes('important') || q.includes('zaruri')) {
      return `Complaint priorities:\n\n🔴 **High**: Urgent issues (water leak, bijli ka issue, major road damage)\n🟡 **Medium**: Important lekin critical nahi\n🟢 **Low**: Minor issues jo wait kar sakte hain\n\n${selectedComplaint ? `Aapki complaint **${selectedComplaint.priority} Priority** hai.` : ''}\n\n${myComplaints.length > 0 ? `\nAapke complaints:\n• High: ${myComplaints.filter(c => c.priority === 'High').length}\n• Medium: ${myComplaints.filter(c => c.priority === 'Medium').length}\n• Low: ${myComplaints.filter(c => c.priority === 'Low').length}` : ''}\n\nPriority resolution time aur worker assignment ko affect karta hai!`;
    }
    
    // Types of complaints
    if (q.includes('type') || q.includes('category') || q.includes('prakar') || q.includes('kisme')) {
      return `Teen types ke complaints handle karte hain:\n\n💧 **Water (Paani)**: Leakage, supply issues, drainage\n⚡ **Electricity (Bijli)**: Power cuts, faulty connections, street lights\n🚧 **Road (Sadak)**: Potholes, damaged roads, construction\n\n${selectedComplaint ? `Aap **${selectedComplaint.type}** complaint dekh rahe hain.` : ''}\n\n${myComplaints.length > 0 ? `\nAapke complaints:\n• Water: ${myComplaints.filter(c => c.type === 'Water').length}\n• Electricity: ${myComplaints.filter(c => c.type === 'Electricity').length}\n• Road: ${myComplaints.filter(c => c.type === 'Road').length}` : ''}\n\nSahi category choose karne se faster resolution milta hai!`;
    }
    
    // How to register
    if (q.includes('register') || q.includes('submit') || q.includes('create') || q.includes('file') || q.includes('new') || q.includes('kaise') || q.includes('banaye')) {
      return `Naya complaint register karne ke liye:\n\n1️⃣ "Register New Complaint" button click karein\n2️⃣ Type select karein (Water/Electricity/Road)\n3️⃣ Priority level choose karein (High/Medium/Low)\n4️⃣ Location details enter karein\n5️⃣ Issue describe karein\n6️⃣ Submit karein!\n\n✅ Turant confirmation milega\n✅ Real-time progress track kar sakte hain\n✅ Notifications har stage pe milenge\n\nBilkul aasan! 🎯`;
    }
    
    // Tracking inquiries
    if (q.includes('track') || q.includes('progress') || q.includes('check') || q.includes('dekhe') || q.includes('update')) {
      return `Complaints track karne ke liye:\n\n📊 **My Complaints Tab**: Apne saare complaints dekhein\n🔍 **Track Button**: Detailed timeline dekhein\n📈 **Progress Timeline**: Har step ka status\n🔔 **Notifications**: Status change pe alert\n\n${myComplaints.length > 0 ? `Aapke **${myComplaints.length}** complaint${myComplaints.length !== 1 ? 's' : ''} hain:\n• Pending: ${myComplaints.filter(c => c.status === 'Pending').length}\n• In Progress: ${myComplaints.filter(c => c.status === 'In Progress').length}\n• Resolved: ${myComplaints.filter(c => c.status === 'Resolved').length}` : 'Abhi tak koi complaint register nahi ki.'}\n\nDashboard pe real-time updates milte rahenge!`;
    }
    
    // Contact/Help
    if (q.includes('contact') || q.includes('help') || q.includes('support') || q.includes('phone') || q.includes('email') || q.includes('sampark')) {
      return `Additional help chahiye?\n\n📧 **Email**: support@civiclink.com\n📞 **Phone**: 1800-CIVIC-LINK\n⏰ **Hours**: 24/7 Support\n\n${selectedComplaint && selectedComplaint.assignedTo ? `Aapki current complaint (ID: ${selectedComplaint._id?.slice(-8)}) ke liye assigned worker bhi aapse contact kar sakta hai!` : ''}\n\nMain hamesha yahan hoon questions answer karne ke liye! 😊`;
    }
    
    // Stats/Numbers
    if (q.includes('kitne') || q.includes('how many') || q.includes('total') || q.includes('count') || q.includes('statistics')) {
      return `Aapke complaint statistics:\n\n📊 **Total Complaints**: ${myComplaints.length}\n⏳ **Pending**: ${myComplaints.filter(c => c.status === 'Pending').length}\n🔄 **In Progress**: ${myComplaints.filter(c => c.status === 'In Progress').length}\n✅ **Resolved**: ${myComplaints.filter(c => c.status === 'Resolved').length}\n${myComplaints.filter(c => c.status === 'Rejected').length > 0 ? `\n🔴 **Rejected**: ${myComplaints.filter(c => c.status === 'Rejected').length}` : ''}\n\n${myComplaints.length > 0 ? `\n**Type-wise:**\n💧 Water: ${myComplaints.filter(c => c.type === 'Water').length}\n⚡ Electricity: ${myComplaints.filter(c => c.type === 'Electricity').length}\n🚧 Road: ${myComplaints.filter(c => c.type === 'Road').length}` : ''}\n\nAap apni community mein difference la rahe hain! 🌟`;
    }
    
    // Complaint detail inquiry
    if (q.includes('detail') || q.includes('info') || q.includes('information') || q.includes('jankari')) {
      if (selectedComplaint) {
        return `Current complaint ki details:\n\n📋 **Type**: ${selectedComplaint.type}\n📍 **Location**: ${selectedComplaint.location}\n⚡ **Priority**: ${selectedComplaint.priority}\n📊 **Status**: ${selectedComplaint.status}\n📅 **Date**: ${selectedComplaint.createdAt ? new Date(selectedComplaint.createdAt).toLocaleDateString() : 'N/A'}\n${selectedComplaint.assignedTo ? `\n👷 **Worker**: ${selectedComplaint.assignedTo}` : ''}\n${selectedComplaint.description ? `\n📝 **Description**: ${selectedComplaint.description.slice(0, 100)}${selectedComplaint.description.length > 100 ? '...' : ''}` : ''}\n\n"Track" button click karke complete timeline dekh sakte hain!`;
      }
      return `Complaint details dekhne ke liye:\n\n1️⃣ "My Complaints" tab open karein\n2️⃣ Complaint pe "Track" button click karein\n3️⃣ Complete timeline aur details dekhein\n\n${myComplaints.length > 0 ? `Aapke paas ${myComplaints.length} complaint${myComplaints.length !== 1 ? 's' : ''} hai jo aap track kar sakte hain!` : 'Pehle ek complaint register karein!'}`;
    }
    
    // Dashboard features
    if (q.includes('dashboard') || q.includes('feature') || q.includes('kya kar sakte')) {
      return `Dashboard pe aap yeh kar sakte hain:\n\n✨ **Register Complaints**: Naye complaints submit karein\n📊 **Track Progress**: Real-time status updates\n👀 **View All**: Apne saare complaints dekhein\n🔍 **Search & Filter**: Status aur type se filter karein\n📈 **View Stats**: Quick overview of your complaints\n💬 **AI Support**: Mujhse kuch bhi poochein!\n\n**My Complaints Tab**: Sirf aapke complaints\n**All Complaints Tab**: Sabke complaints dekh sakte hain\n\nKya aur kuch jaanna hai? 😊`;
    }
    
    // Thank you / appreciation
    if (q.includes('thank') || q.includes('thanks') || q.includes('shukriya') || q.includes('dhanyavaad')) {
      return `Aapka swagat hai ${user?.name}! 🙏\n\nMain yahan hoon aapki help ke liye. Koi bhi sawal ho toh poochiye!\n\n${myComplaints.length > 0 ? `Aapne ${myComplaints.filter(c => c.status === 'Resolved').length > 0 ? `already ${myComplaints.filter(c => c.status === 'Resolved').length} complaint${myComplaints.filter(c => c.status === 'Resolved').length !== 1 ? 's' : ''} resolve karwaya hai - ` : ''}CivicLink use karne ke liye aapka shukriya! 🌟` : ''}`;
    }
    
    // Default helpful response
    return `Main yahan hoon aapki madad ke liye! 😊\n\nAap pooch sakte hain:\n\n✨ **Status**: Complaint ka current status\n👷 **Workers**: Kaun assigned hai\n⏰ **Time**: Kitna time lagega\n📝 **Register**: Naya complaint kaise register karein\n📊 **Track**: Complaints kaise track karein\n🔍 **Details**: Kisi bhi complaint ki details\n\n${selectedComplaint ? `Aap currently **${selectedComplaint.type}** complaint dekh rahe hain (Status: **${selectedComplaint.status}**).` : `Aapke **${myComplaints.length}** total complaint${myComplaints.length !== 1 ? 's' : ''} hain.`}\n\nKya jaanna chahte hain? Poochiye! 🎯`;
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

    // Simulate thinking delay for better UX
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
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes slideUp {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }

        .chatbot-icon-float {
          animation: float 3s ease-in-out infinite;
        }

        .chatbot-icon-shadow {
          box-shadow: 0 10px 40px rgba(59, 130, 246, 0.4);
        }

        .backdrop-blur-custom {
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
        }
      `}</style>

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
                      Questions about this complaint? Chat with our AI assistant for instant help.
                    </p>
                    <button 
                      onClick={openSupportChat}
                      className="w-full px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg text-sm font-medium transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                    >
                      <MessageSquare className="w-4 h-4" />
                      Chat Now
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

      {/* Backdrop Overlay when chatbot is open - MOBILE ONLY */}
      {showSupportChat && !isMinimized && (
        <div 
          className="md:hidden fixed inset-0 bg-black/50 backdrop-blur-custom z-[9998] animate-[fadeIn_0.3s_ease-in-out]"
          onClick={closeSupportChat}
          style={{ animation: 'fadeIn 0.3s ease-in-out' }}
        />
      )}

      {/* Floating AI Chatbot Button - Landing Page Style - Mobile Responsive */}
      {!showSupportChat && (
        <button
          onClick={openSupportChat}
          className="fixed bottom-4 right-4 md:bottom-6 md:right-6 w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 bg-white rounded-full shadow-2xl chatbot-icon-shadow hover:shadow-3xl transition-all duration-300 flex items-center justify-center z-50 group chatbot-icon-float border-4 border-blue-100"
          aria-label="Open AI Support"
        >
          <img 
            src="https://w7.pngwing.com/pngs/567/444/png-transparent-robotics-chatbot-technology-robot-education-electronics-computer-program-humanoid-robot.png"
            alt="AI Support"
            className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 object-contain group-hover:scale-110 transition-transform duration-300"
          />
          <span className="absolute -top-0.5 -right-0.5 md:-top-1 md:-right-1 w-4 h-4 md:w-5 md:h-5 bg-gradient-to-r from-green-400 to-green-500 rounded-full animate-pulse border-2 border-white shadow-lg flex items-center justify-center">
            <span className="w-1.5 h-1.5 md:w-2 md:h-2 bg-white rounded-full"></span>
          </span>
        </button>
      )}

      {/* AI Support Chat Window - Landing Page Style - Mobile Responsive */}
      {showSupportChat && (
        <div 
          className={`fixed z-[9999] transition-all duration-300 animate-[slideUp_0.3s_ease-out]
            ${isMinimized 
              ? 'bottom-4 right-4 md:bottom-6 md:right-6 w-72 sm:w-80' 
              : 'inset-x-0 bottom-0 md:bottom-6 md:right-6 md:left-auto md:inset-x-auto w-full md:w-96'
            }
          `}
          style={{ animation: 'slideUp 0.3s ease-out' }}
        >
          <div className={`bg-white overflow-hidden flex flex-col shadow-2xl ${
            isMinimized 
              ? 'h-14 md:h-16 rounded-2xl border-2 border-blue-100' 
              : 'h-[100dvh] md:h-[70vh] md:max-h-[600px] md:rounded-2xl md:border-2 md:border-blue-100'
          }`}>
            {/* Chat Header - Professional Design */}
            <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 p-3 md:p-4 text-white flex-shrink-0 border-b-4 border-blue-800">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 md:gap-3">
                  <div className="w-9 h-9 md:w-11 md:h-11 bg-white rounded-full flex items-center justify-center shadow-lg relative overflow-hidden">
                    <img 
                      src="https://w7.pngwing.com/pngs/567/444/png-transparent-robotics-chatbot-technology-robot-education-electronics-computer-program-humanoid-robot.png"
                      alt="AI Assistant"
                      className="w-7 h-7 md:w-9 md:h-9 object-contain"
                    />
                    <span className="absolute -bottom-0.5 -right-0.5 md:-bottom-1 md:-right-1 w-2.5 h-2.5 md:w-3 md:h-3 bg-green-400 rounded-full border-2 border-white"></span>
                  </div>
                  {!isMinimized && (
                    <div>
                      <h3 className="font-bold text-sm md:text-base lg:text-lg flex items-center gap-1 md:gap-2">
                        AI Support
                        <span className="text-[10px] md:text-xs bg-green-400 text-green-900 px-1.5 md:px-2 py-0.5 rounded-full font-semibold">Online</span>
                      </h3>
                      <p className="text-[10px] md:text-xs text-blue-100">Madad ke liye!</p>
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-1 md:gap-2">
                  <button
                    onClick={toggleMinimize}
                    className="p-1.5 md:p-2 hover:bg-white/20 rounded-lg transition-colors"
                    aria-label={isMinimized ? "Maximize" : "Minimize"}
                  >
                    <Minimize2 className="w-3.5 h-3.5 md:w-4 md:h-4" />
                  </button>
                  <button
                    onClick={closeSupportChat}
                    className="p-1.5 md:p-2 hover:bg-white/20 rounded-lg transition-colors"
                    aria-label="Close chat"
                  >
                    <X className="w-3.5 h-3.5 md:w-4 md:h-4" />
                  </button>
                </div>
              </div>
            </div>

            {!isMinimized && (
              <>
                {/* Chat Messages */}
                <div className="flex-1 overflow-y-auto p-3 md:p-4 space-y-3 md:space-y-4 bg-gradient-to-b from-gray-50 to-blue-50">
                  {chatMessages.map((message, index) => (
                    <div
                      key={index}
                      className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[85%] rounded-2xl p-2.5 md:p-3 shadow-md ${
                          message.role === 'user'
                            ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white'
                            : 'bg-white border-2 border-blue-100 text-gray-800'
                        }`}
                      >
                        {message.role === 'assistant' && (
                          <div className="flex items-center gap-2 mb-2 pb-2 border-b border-blue-100">
                            <div className="w-4 h-4 md:w-5 md:h-5 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                              <Bot className="w-2.5 h-2.5 md:w-3 md:h-3 text-white" />
                            </div>
                            <span className="text-[10px] md:text-xs font-bold text-blue-700">AI Assistant</span>
                          </div>
                        )}
                        <p className="text-xs md:text-sm whitespace-pre-wrap leading-relaxed">{message.content}</p>
                        <p className={`text-[10px] md:text-xs mt-1.5 md:mt-2 ${
                          message.role === 'user' ? 'text-blue-100' : 'text-gray-400'
                        }`}>
                          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  ))}
                  
                  {isChatLoading && (
                    <div className="flex justify-start">
                      <div className="bg-white border-2 border-blue-100 rounded-2xl p-2.5 md:p-3 shadow-md">
                        <div className="flex items-center gap-2">
                          <Loader className="w-3.5 h-3.5 md:w-4 md:h-4 text-blue-600 animate-spin" />
                          <span className="text-xs md:text-sm text-gray-600 font-medium">Soch raha hoon...</span>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div ref={chatEndRef} />
                </div>

                {/* Chat Input - Professional Design */}
                <div className="p-3 md:p-4 bg-white border-t-2 border-blue-100 flex-shrink-0 safe-area-bottom">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      onKeyPress={handleChatKeyPress}
                      placeholder="Apna sawal poochein..."
                      className="flex-1 px-3 md:px-4 py-2.5 md:py-3 border-2 border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-xs md:text-sm transition-all"
                      disabled={isChatLoading}
                    />
                    <button
                      onClick={sendChatMessage}
                      disabled={!chatInput.trim() || isChatLoading}
                      className="px-3 md:px-4 py-2.5 md:py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg hover:shadow-xl"
                    >
                      <Send className="w-3.5 h-3.5 md:w-4 md:h-4" />
                    </button>
                  </div>
                  <p className="text-[10px] md:text-xs text-gray-500 mt-2 text-center flex items-center justify-center gap-1">
                    <span className="w-1.5 h-1.5 md:w-2 md:h-2 bg-green-500 rounded-full animate-pulse"></span>
                    CivicLink AI • Enter dabaayein
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}