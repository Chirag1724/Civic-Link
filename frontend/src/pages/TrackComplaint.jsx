import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../api';
import { 
  FileText, 
  MapPin, 
  User, 
  Clock, 
  AlertCircle,
  CheckCircle,
  XCircle,
  Loader,
  ArrowLeft,
  Droplet,
  Zap,
  Construction,
  Calendar,
  Flag
} from 'lucide-react';

export default function TrackComplaint() {
  const { id } = useParams();
  const nav = useNavigate();
  const [comp, setComp] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => { 
    if (id) load(); 
  }, [id]);

  async function load() {
    setLoading(true);
    setError('');
    try {
      const r = await api.get('/complaints/' + id);
      setComp(r.data.comp);
    } catch (err) {
      console.error(err);
      setError('Failed to load complaint details');
    } finally {
      setLoading(false);
    }
  }

  const getTypeIcon = (type) => {
    switch(type) {
      case 'Water': return <Droplet className="w-6 h-6" />;
      case 'Electricity': return <Zap className="w-6 h-6" />;
      case 'Road': return <Construction className="w-6 h-6" />;
      default: return <FileText className="w-6 h-6" />;
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

  const getStatusIcon = (status) => {
    switch(status) {
      case 'Pending': return <Clock className="w-5 h-5" />;
      case 'In Progress': return <Loader className="w-5 h-5 animate-spin" />;
      case 'Resolved': return <CheckCircle className="w-5 h-5" />;
      case 'Rejected': return <XCircle className="w-5 h-5" />;
      default: return <AlertCircle className="w-5 h-5" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-bg-primary flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-12 h-12 text-primary mx-auto mb-4 animate-spin" />
          <p className="text-gray-600 font-medium">Loading complaint details...</p>
        </div>
      </div>
    );
  }

  if (error || !comp) {
    return (
      <div className="min-h-screen bg-bg-primary flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-bg-secondary rounded-2xl shadow-lg border border-bg-tertiary p-8 text-center">
          <div className="w-16 h-16 bg-status-urgent-bg rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-status-urgent" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Complaint Not Found</h2>
          <p className="text-gray-600 mb-6">
            {error || 'The complaint you are looking for does not exist or has been removed.'}
          </p>
          <button
            onClick={() => nav(-1)}
            className="px-6 py-3 bg-primary hover:bg-primary-light text-white rounded-lg transition-all duration-300 font-medium"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-primary">
      {/* Header */}
      <div className="bg-bg-secondary border-b border-bg-tertiary shadow-sm">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <button
            onClick={() => nav(-1)}
            className="flex items-center gap-2 text-gray-600 hover:text-primary transition-colors mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back</span>
          </button>
          
          <div className="flex items-center gap-4">
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-primary bg-primary/10`}>
              {getTypeIcon(comp.type)}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Complaint Details</h1>
              <p className="text-gray-600 mt-1">ID: #{comp._id}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Status Timeline */}
        <div className="bg-bg-secondary rounded-2xl shadow-lg border border-bg-tertiary p-8 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Current Status</h2>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${getStatusColor(comp.status)} border-2`}>
                {getStatusIcon(comp.status)}
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Status</p>
                <p className="text-2xl font-bold text-gray-900">{comp.status}</p>
              </div>
            </div>
            
            {comp.priority && (
              <div>
                <p className="text-sm text-gray-600 mb-2 text-right">Priority Level</p>
                <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold border-2 ${getPriorityColor(comp.priority)}`}>
                  <Flag className="w-4 h-4" />
                  {comp.priority}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Main Details */}
        <div className="bg-bg-secondary rounded-2xl shadow-lg border border-bg-tertiary p-8 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Complaint Information</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            {/* Type */}
            <div className="p-4 bg-bg-primary rounded-xl border border-bg-tertiary">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-primary/10 rounded-lg text-primary">
                  {getTypeIcon(comp.type)}
                </div>
                <p className="text-sm text-gray-600 font-medium">Complaint Type</p>
              </div>
              <p className="text-lg font-bold text-gray-900">{comp.type}</p>
            </div>

            {/* Location */}
            <div className="p-4 bg-bg-primary rounded-xl border border-bg-tertiary">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-accent-green/10 rounded-lg text-accent-green">
                  <MapPin className="w-5 h-5" />
                </div>
                <p className="text-sm text-gray-600 font-medium">Location</p>
              </div>
              <p className="text-lg font-bold text-gray-900">{comp.location}</p>
            </div>

            {/* Assigned To */}
            <div className="p-4 bg-bg-primary rounded-xl border border-bg-tertiary">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-status-progress/10 rounded-lg text-status-progress">
                  <User className="w-5 h-5" />
                </div>
                <p className="text-sm text-gray-600 font-medium">Assigned To</p>
              </div>
              <p className="text-lg font-bold text-gray-900">
                {comp.assignedTo || 'Unassigned'}
              </p>
            </div>

            {/* Date */}
            {comp.createdAt && (
              <div className="p-4 bg-bg-primary rounded-xl border border-bg-tertiary">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-gray-100 rounded-lg text-gray-600">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <p className="text-sm text-gray-600 font-medium">Submitted On</p>
                </div>
                <p className="text-lg font-bold text-gray-900">
                  {new Date(comp.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Description */}
        {comp.description && (
          <div className="bg-bg-secondary rounded-2xl shadow-lg border border-bg-tertiary p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <FileText className="w-6 h-6 text-primary" />
              Description
            </h2>
            <div className="p-6 bg-bg-primary rounded-xl border border-bg-tertiary">
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                {comp.description}
              </p>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="mt-8 flex gap-4">
          <button
            onClick={() => nav(-1)}
            className="px-6 py-3 bg-bg-secondary hover:bg-bg-tertiary text-gray-700 rounded-lg border-2 border-bg-tertiary transition-all duration-300 font-medium"
          >
            Back to Dashboard
          </button>
          <button
            onClick={() => window.print()}
            className="px-6 py-3 bg-primary hover:bg-primary-light text-white rounded-lg transition-all duration-300 font-medium shadow-md hover:shadow-lg"
          >
            Print Details
          </button>
        </div>
      </div>
    </div>
  );
}