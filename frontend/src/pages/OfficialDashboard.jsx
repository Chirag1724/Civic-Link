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
  Activity
} from 'lucide-react';

export default function OfficialDashboard() {
  const [list, setList] = useState([]);
  const [filteredList, setFilteredList] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  const nav = useNavigate();

  useEffect(() => { fetch(); }, []);
  
  useEffect(() => {
    let filtered = list;
    
    // Filter by status
    if (filterStatus !== 'all') {
      filtered = filtered.filter(c => c.status === filterStatus);
    }
    
    // Filter by priority
    if (filterPriority !== 'all') {
      filtered = filtered.filter(c => c.priority === filterPriority);
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
  }, [list, filterStatus, filterPriority, searchTerm]);

  async function fetch() {
    setLoading(true);
    try {
      const r1 = await api.get('/complaints');
      setList(r1.data.list || []);
      const s = await api.get('/stats/summary');
      setStats(s.data || {});
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function assign(c) {
    const workers = [
      { name: 'Worker A', location: 'ZoneA' }, 
      { name: 'Worker B', location: 'ZoneB' }
    ];
    try {
      const res = await api.post(`/complaints/${c._id}/assign`, { workers });
      alert('Assigned to: ' + res.data.assignedTo.name);
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

  const statCards = [
    { 
      label: 'Total Complaints', 
      value: stats.total || 0, 
      icon: <BarChart3 className="w-8 h-8" />,
      color: 'primary',
      bgColor: 'bg-primary/10'
    },
    { 
      label: 'Pending', 
      value: stats.pending || 0, 
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
      value: stats.resolved || 0, 
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
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary-dark rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-white" />
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

        {/* Complaints Management */}
        <div className="bg-bg-secondary rounded-xl shadow-lg border border-bg-tertiary p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Users className="w-7 h-7 text-primary" />
              Complaint Management
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
                  placeholder="Search complaints..."
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
                    <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700">Type</th>
                    <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700">Location</th>
                    <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700">Priority</th>
                    <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700">Status</th>
                    <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700">Assigned To</th>
                    <th className="text-center py-4 px-4 text-sm font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredList.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="text-center py-12 text-gray-500">
                        <FileText className="w-12 h-12 mx-auto mb-3 opacity-20" />
                        <p className="text-lg font-medium">No complaints found</p>
                        <p className="text-sm">Try adjusting your filters</p>
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
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2 text-gray-700">
                            {c.assignedTo ? (
                              <>
                                <UserCheck className="w-4 h-4 text-accent-green" />
                                <span className="text-sm">{c.assignedTo}</span>
                              </>
                            ) : (
                              <span className="text-sm text-gray-400 italic">Unassigned</span>
                            )}
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => assign(c)}
                              disabled={c.status === 'Resolved'}
                              className="px-4 py-2 bg-primary hover:bg-primary-light text-white text-sm font-medium rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                            >
                              <UserCheck className="w-4 h-4" />
                              Assign
                            </button>
                            <button
                              onClick={() => resolve(c)}
                              disabled={c.status === 'Resolved'}
                              className="px-4 py-2 bg-accent-green hover:bg-accent-green-light text-white text-sm font-medium rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                            >
                              <CheckCircle className="w-4 h-4" />
                              Resolve
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
    </div>
  );
}