import React, { useState, useEffect } from 'react';
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
  XCircle,
  Filter,
  Plus,
  LogOut,
  User,
  TrendingUp,
  Search
} from 'lucide-react';

export default function CitizenDashboard() {
  const [form, setForm] = useState({ type: 'Water', description: '', location: '', priority: 'Medium' });
  const [list, setList] = useState([]);
  const [filteredList, setFilteredList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  const nav = useNavigate();

  useEffect(() => { fetchList(); }, []);
  
  useEffect(() => {
    let filtered = list;
    
    // Filter by status
    if (filterStatus !== 'all') {
      filtered = filtered.filter(c => c.status === filterStatus);
    }
    
    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(c => 
        c.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    setFilteredList(filtered);
  }, [list, filterStatus, searchTerm]);

  async function fetchList() {
    try {
      const res = await api.get('/complaints');
      setList(res.data.list || []);
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
      fetchList();
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

  const stats = [
    { label: 'Total Complaints', value: list.length, color: 'primary' },
    { label: 'Pending', value: list.filter(c => c.status === 'Pending').length, color: 'status-pending' },
    { label: 'In Progress', value: list.filter(c => c.status === 'In Progress').length, color: 'status-progress' },
    { label: 'Resolved', value: list.filter(c => c.status === 'Resolved').length, color: 'status-resolved' }
  ];

  return (
    <div className="min-h-screen bg-bg-primary">
      {/* Top Navigation */}
      <nav className="bg-bg-secondary border-b border-bg-tertiary shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary-dark rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">CivicLink</h1>
                <p className="text-xs text-gray-500">Track and manage your complaints</p>
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

            <form onSubmit={submit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Type Field */}
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

              {/* Priority Field */}
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

              {/* Location Field */}
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

              {/* Description Field */}
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

              {/* Submit Button */}
              <div className="md:col-span-2">
                <button
                  type="submit"
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
            </form>
          </div>
        )}

        {/* Complaints List */}
        <div className="bg-bg-secondary rounded-xl shadow-lg border border-bg-tertiary p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <h3 className="text-2xl font-bold text-gray-900">Your Complaints</h3>
            
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

              {/* Filter */}
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

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-bg-tertiary">
                  <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700">Type</th>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700">Location</th>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700">Priority</th>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700">Status</th>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700">Date</th>
                </tr>
              </thead>
              <tbody>
                {filteredList.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center py-12 text-gray-500">
                      <FileText className="w-12 h-12 mx-auto mb-3 opacity-20" />
                      <p className="text-lg font-medium">No complaints found</p>
                      <p className="text-sm">Try adjusting your filters or create a new complaint</p>
                    </td>
                  </tr>
                ) : (
                  filteredList.map(c => (
                    <tr key={c._id} className="border-b border-bg-tertiary hover:bg-bg-primary transition-colors">
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
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}