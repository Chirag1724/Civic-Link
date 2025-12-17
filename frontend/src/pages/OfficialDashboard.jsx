import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api';
import { 
  FileText, 
  Droplet, 
  Zap, 
  Construction, 
  MapPin, 
  AlertCircle, 
  Clock,
  CheckCircle,
  TrendingUp,
  Users,
  LogOut,
  User,
  Search,
  Filter,
  UserCheck,
  Flag,
  BarChart3,
  Activity,
  XCircle,
  Eye
} from 'lucide-react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';

export default function OfficialDashboard() {
  const [list, setList] = useState([]);
  const [filteredList, setFilteredList] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedWorker, setSelectedWorker] = useState('');
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  const nav = useNavigate();

  // Workers data with names and departments
  const workers = {
    'Water Department': [
      { name: 'Rajesh Kumar', phone: '+91 98765 43210', email: 'rajesh.kumar@civic.gov.in', location: 'Zone A' },
      { name: 'Priya Sharma', phone: '+91 98765 43211', email: 'priya.sharma@civic.gov.in', location: 'Zone B' },
      { name: 'Amit Patel', phone: '+91 98765 43212', email: 'amit.patel@civic.gov.in', location: 'Zone C' }
    ],
    'Electricity Department': [
      { name: 'Suresh Reddy', phone: '+91 98765 43213', email: 'suresh.reddy@civic.gov.in', location: 'Zone A' },
      { name: 'Deepa Singh', phone: '+91 98765 43214', email: 'deepa.singh@civic.gov.in', location: 'Zone B' },
      { name: 'Vikram Malhotra', phone: '+91 98765 43215', email: 'vikram.malhotra@civic.gov.in', location: 'Zone C' }
    ],
    'Road Department': [
      { name: 'Ramesh Gupta', phone: '+91 98765 43216', email: 'ramesh.gupta@civic.gov.in', location: 'Zone A' },
      { name: 'Sneha Iyer', phone: '+91 98765 43217', email: 'sneha.iyer@civic.gov.in', location: 'Zone B' },
      { name: 'Arjun Verma', phone: '+91 98765 43218', email: 'arjun.verma@civic.gov.in', location: 'Zone C' }
    ]
  };

  const getDepartmentByType = (type) => {
    return `${type} Department`;
  };

  const getWorkerDetails = () => {
    if (!selectedWorker || !selectedComplaint) return null;
    const dept = getDepartmentByType(selectedComplaint.type);
    return workers[dept]?.find(w => w.name === selectedWorker);
  };

  useEffect(() => { fetch(); }, []);
  
  useEffect(() => {
    let filtered = list;
    
    if (filterStatus !== 'all') {
      filtered = filtered.filter(c => c.status === filterStatus);
    }
    
    if (filterPriority !== 'all') {
      filtered = filtered.filter(c => c.priority === filterPriority);
    }
    
    if (searchTerm) {
      filtered = filtered.filter(c => 
        c.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.citizenId?.name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    setFilteredList(filtered);
  }, [list, filterStatus, filterPriority, searchTerm]);

  async function fetch() {
    setLoading(true);
    try {
      const r1 = await api.get('/complaints/all');
      setList(r1.data.list || []);
      const s = await api.get('/stats/summary');
      setStats(s.data || {});
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  function openAssignModal(c) {
    setSelectedComplaint(c);
    setSelectedWorker('');
    setShowAssignModal(true);
  }

  async function confirmAssign() {
    if (!selectedWorker) {
      alert('Please select a worker');
      return;
    }
    
    const dept = getDepartmentByType(selectedComplaint.type);
    const workersList = workers[dept].map(w => ({ name: w.name, location: w.location }));
    
    try {
      const res = await api.post(`/complaints/${selectedComplaint._id}/assign`, { workers: workersList });
      alert('Assigned to: ' + selectedWorker);
      setShowAssignModal(false);
      setSelectedWorker('');
      fetch();
    } catch (err) {
      alert(err.response?.data?.error || err.message);
    }
  }

  async function resolve(c) {
    try {
      await api.put(`/complaints/${c._id}/status`, { status: 'Resolved' });
      alert('Complaint resolved successfully!');
      fetch();
    } catch (err) {
      console.error(err);
      alert('Failed to resolve complaint');
    }
  }

  async function reject(c) {
    try {
      await api.put(`/complaints/${c._id}/status`, { status: 'Rejected' });
      alert('Complaint rejected');
      fetch();
    } catch (err) {
      console.error(err);
      alert('Failed to reject complaint');
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    nav('/login');
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

  // Chart Data
  const statusData = [
    { name: 'Pending', value: list.filter(c => c.status === 'Pending').length, color: '#f59e0b' },
    { name: 'In Progress', value: list.filter(c => c.status === 'In Progress').length, color: '#3b82f6' },
    { name: 'Resolved', value: list.filter(c => c.status === 'Resolved').length, color: '#10b981' },
    { name: 'Rejected', value: list.filter(c => c.status === 'Rejected').length, color: '#ef4444' }
  ];

  const typeData = [
    { name: 'Water', count: list.filter(c => c.type === 'Water').length },
    { name: 'Electricity', count: list.filter(c => c.type === 'Electricity').length },
    { name: 'Road', count: list.filter(c => c.type === 'Road').length }
  ];

  const priorityData = [
    { name: 'High', value: list.filter(c => c.priority === 'High').length, color: '#ef4444' },
    { name: 'Medium', value: list.filter(c => c.priority === 'Medium').length, color: '#f59e0b' },
    { name: 'Low', value: list.filter(c => c.priority === 'Low').length, color: '#10b981' }
  ];

  const statCards = [
    { 
      label: 'Total Complaints', 
      value: list.length, 
      icon: <BarChart3 className="w-8 h-8" />,
      color: 'primary',
      bgColor: 'bg-primary/10'
    },
    { 
      label: 'Pending', 
      value: list.filter(c => c.status === 'Pending').length, 
      icon: <Clock className="w-8 h-8" />,
      color: 'status-pending',
      bgColor: 'bg-status-pending-bg'
    },
    { 
      label: 'In Progress', 
      value: list.filter(c => c.status === 'In Progress').length, 
      icon: <Activity className="w-8 h-8" />,
      color: 'status-progress',
      bgColor: 'bg-status-progress-bg'
    },
    { 
      label: 'Resolved', 
      value: list.filter(c => c.status === 'Resolved').length, 
      icon: <CheckCircle className="w-8 h-8" />,
      color: 'status-resolved',
      bgColor: 'bg-status-resolved-bg'
    }
  ];

  return (
    <div className="min-h-screen bg-bg-primary">
      {/* Top Navigation */}
      <nav className="bg-bg-secondary border-b border-bg-tertiary shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center overflow-hidden">
                  <img 
                    src="/CivicLink_logo.png" 
                    alt="CivicLink Logo" 
                    className="w-full h-full object-contain"
                  />
                </div>
                <div>
                <h1 className="text-xl font-bold text-gray-900">Admin Dashboard</h1>
                <p className="text-xs text-gray-500">Manage and resolve complaints</p>
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
          {statCards.map((stat, index) => (
            <div key={index} className="bg-bg-secondary rounded-xl shadow-sm border border-bg-tertiary p-6 hover:shadow-md transition-all">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                  <p className={`text-3xl font-bold text-${stat.color}`}>{stat.value}</p>
                </div>
                <div className={`${stat.bgColor} p-3 rounded-xl text-${stat.color}`}>
                  {stat.icon}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Status Distribution */}
          <div className="bg-bg-secondary rounded-xl shadow-lg border border-bg-tertiary p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-primary" />
              Status Distribution
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Complaint Types */}
          <div className="bg-bg-secondary rounded-xl shadow-lg border border-bg-tertiary p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Activity className="w-5 h-5 text-primary" />
              Complaints by Type
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={typeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#6366f1" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Priority Distribution */}
          <div className="bg-bg-secondary rounded-xl shadow-lg border border-bg-tertiary p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Flag className="w-5 h-5 text-primary" />
              Priority Levels
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={priorityData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {priorityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Recent Activity */}
          <div className="bg-bg-secondary rounded-xl shadow-lg border border-bg-tertiary p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              Recent Activity
            </h3>
            <div className="space-y-3 max-h-[250px] overflow-y-auto">
              {list.slice(0, 5).map((c, idx) => (
                <div key={idx} className="flex items-center gap-3 p-3 bg-bg-primary rounded-lg">
                  <div className="p-2 bg-primary/10 rounded-lg text-primary">
                    {getTypeIcon(c.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{c.type} - {c.location}</p>
                    <p className="text-xs text-gray-500">By: {c.citizenId?.name || 'Unknown'}</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(c.status)}`}>
                    {c.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Complaints Management */}
        <div className="bg-bg-secondary rounded-xl shadow-lg border border-bg-tertiary p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Users className="w-7 h-7 text-primary" />
              All Complaints Management
            </h3>
            
            <div className="flex flex-col sm:flex-row gap-3">
              {/* Search */}
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

              {/* Status Filter */}
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

              {/* Priority Filter */}
              <div className="flex items-center gap-2">
                <Flag className="w-5 h-5 text-gray-500" />
                <select
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none"
                  value={filterPriority}
                  onChange={e => setFilterPriority(e.target.value)}
                >
                  <option value="all">All Priority</option>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>
            </div>
          </div>

          {/* Loading State */}
          {loading ? (
            <div className="text-center py-12">
              <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">Loading complaints...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-bg-tertiary">
                    <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700">Citizen</th>
                    <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700">Type</th>
                    <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700">Location</th>
                    <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700">Priority</th>
                    <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700">Status</th>
                    <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700">Assigned</th>
                    <th className="text-center py-4 px-4 text-sm font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredList.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="text-center py-12 text-gray-500">
                        <FileText className="w-12 h-12 mx-auto mb-3 opacity-20" />
                        <p className="text-lg font-medium">No complaints found</p>
                        <p className="text-sm">Try adjusting your filters</p>
                      </td>
                    </tr>
                  ) : (
                    filteredList.map(c => (
                      <tr key={c._id} className="border-b border-bg-tertiary hover:bg-bg-primary transition-colors">
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                              <User className="w-4 h-4 text-primary" />
                            </div>
                            <div>
                              <p className="font-medium text-gray-900 text-sm">{c.citizenId?.name || 'Unknown'}</p>
                              <p className="text-xs text-gray-500">{c.citizenId?.email || ''}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2">
                            <div className="p-2 bg-primary/10 rounded-lg text-primary">
                              {getTypeIcon(c.type)}
                            </div>
                            <span className="font-medium text-gray-900">{c.type}</span>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2 text-gray-700">
                            <MapPin className="w-4 h-4 text-gray-400" />
                            <span className="text-sm">{c.location}</span>
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
                        <td className="py-4 px-4">
                          {c.assignedTo ? (
                            <div className="flex items-center gap-2">
                              <UserCheck className="w-4 h-4 text-accent-green" />
                              <span className="text-sm text-gray-700">{c.assignedTo}</span>
                            </div>
                          ) : (
                            <span className="text-sm text-gray-400 italic">Unassigned</span>
                          )}
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => {
                                setSelectedComplaint(c);
                                setShowDetailModal(true);
                              }}
                              className="p-2 bg-primary/10 hover:bg-primary/20 text-primary rounded-lg transition-all"
                              title="View Details"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => openAssignModal(c)}
                              disabled={c.status === 'Resolved' || c.status === 'Rejected'}
                              className="p-2 bg-primary hover:bg-primary-light text-white rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                              title="Assign Worker"
                            >
                              <UserCheck className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => resolve(c)}
                              disabled={c.status === 'Resolved' || c.status === 'Rejected'}
                              className="p-2 bg-accent-green hover:bg-accent-green-light text-white rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                              title="Resolve"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => reject(c)}
                              disabled={c.status === 'Resolved' || c.status === 'Rejected'}
                              className="p-2 bg-status-urgent hover:bg-red-600 text-white rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                              title="Reject"
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* Results Count */}
          {!loading && filteredList.length > 0 && (
            <div className="mt-4 text-sm text-gray-600 text-center">
              Showing {filteredList.length} of {list.length} complaints
            </div>
          )}
        </div>
      </div>

      {/* Detail Modal */}
      {showDetailModal && selectedComplaint && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-bg-secondary rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-bg-tertiary flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-900">Complaint Details</h3>
              <button
                onClick={() => setShowDetailModal(false)}
                className="p-2 hover:bg-bg-tertiary rounded-lg transition-colors"
              >
                <XCircle className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Citizen</p>
                <div className="flex items-center gap-2 mt-1">
                  <User className="w-4 h-4 text-primary" />
                  <p className="font-medium text-gray-900">{selectedComplaint.citizenId?.name || 'Unknown'}</p>
                  <span className="text-sm text-gray-500">({selectedComplaint.citizenId?.email})</span>
                </div>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-500">Type</p>
                <div className="flex items-center gap-2 mt-1">
                  {getTypeIcon(selectedComplaint.type)}
                  <p className="text-gray-900">{selectedComplaint.type}</p>
                </div>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-500">Location</p>
                <div className="flex items-center gap-2 mt-1">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <p className="text-gray-900">{selectedComplaint.location}</p>
                </div>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-500">Description</p>
                <p className="mt-1 text-gray-900 bg-bg-primary p-3 rounded-lg">{selectedComplaint.description}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Priority</p>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border mt-1 ${getPriorityColor(selectedComplaint.priority)}`}>
                    {selectedComplaint.priority}
                  </span>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-gray-500">Status</p>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border mt-1 ${getStatusColor(selectedComplaint.status)}`}>
                    {selectedComplaint.status}
                  </span>
                </div>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-500">Assigned To</p>
                <p className="mt-1 text-gray-900">{selectedComplaint.assignedTo || 'Not assigned yet'}</p>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-500">Created At</p>
                <div className="flex items-center gap-2 mt-1">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <p className="text-gray-900">{new Date(selectedComplaint.createdAt).toLocaleString()}</p>
                </div>
              </div>
              
              {selectedComplaint.resolvedAt && (
                <div>
                  <p className="text-sm font-medium text-gray-500">Resolved At</p>
                  <p className="mt-1 text-gray-900">{new Date(selectedComplaint.resolvedAt).toLocaleString()}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Assign Worker Modal */}
      {showAssignModal && selectedComplaint && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-bg-secondary rounded-xl shadow-2xl max-w-2xl w-full">
            <div className="p-6 border-b border-bg-tertiary flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-900">Assign Worker</h3>
              <button
                onClick={() => {
                  setShowAssignModal(false);
                  setSelectedWorker('');
                }}
                className="p-2 hover:bg-bg-tertiary rounded-lg transition-colors"
              >
                <XCircle className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Complaint Info */}
              <div className="bg-bg-primary p-4 rounded-lg">
                <div className="flex items-center gap-3 mb-2">
                  {getTypeIcon(selectedComplaint.type)}
                  <h4 className="font-semibold text-gray-900">{selectedComplaint.type} Issue</h4>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MapPin className="w-4 h-4" />
                  <span>{selectedComplaint.location}</span>
                </div>
              </div>

              {/* Department & Worker Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Department
                </label>
                <div className="px-4 py-3 bg-primary/10 border border-primary/20 rounded-lg">
                  <p className="font-semibold text-primary">{getDepartmentByType(selectedComplaint.type)}</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Worker *
                </label>
                <select
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none"
                  value={selectedWorker}
                  onChange={e => setSelectedWorker(e.target.value)}
                >
                  <option value="">-- Choose a worker --</option>
                  {workers[getDepartmentByType(selectedComplaint.type)]?.map((worker, idx) => (
                    <option key={idx} value={worker.name}>
                      {worker.name} ({worker.location})
                    </option>
                  ))}
                </select>
              </div>

              {/* Worker Details (Auto-filled) */}
              {getWorkerDetails() && (
                <div className="bg-accent-green/10 border border-accent-green/20 rounded-lg p-4 space-y-3">
                  <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                    <UserCheck className="w-5 h-5 text-accent-green" />
                    Worker Details
                  </h4>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex items-start gap-2">
                      <span className="font-medium text-gray-600 min-w-[80px]">Name:</span>
                      <span className="text-gray-900">{getWorkerDetails().name}</span>
                    </div>
                    
                    <div className="flex items-start gap-2">
                      <span className="font-medium text-gray-600 min-w-[80px]">Phone:</span>
                      <a href={`tel:${getWorkerDetails().phone}`} className="text-primary hover:underline">
                        {getWorkerDetails().phone}
                      </a>
                    </div>
                    
                    <div className="flex items-start gap-2">
                      <span className="font-medium text-gray-600 min-w-[80px]">Email:</span>
                      <a href={`mailto:${getWorkerDetails().email}`} className="text-primary hover:underline">
                        {getWorkerDetails().email}
                      </a>
                    </div>
                    
                    <div className="flex items-start gap-2">
                      <span className="font-medium text-gray-600 min-w-[80px]">Zone:</span>
                      <span className="text-gray-900">{getWorkerDetails().location}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => {
                    setShowAssignModal(false);
                    setSelectedWorker('');
                  }}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-bg-tertiary transition-all font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmAssign}
                  disabled={!selectedWorker}
                  className="flex-1 px-6 py-3 bg-primary hover:bg-primary-light text-white rounded-lg transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <UserCheck className="w-5 h-5" />
                  Confirm Assignment
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}