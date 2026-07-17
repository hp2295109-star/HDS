import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Users, Calendar, Globe, Mail, BarChart3, Search, 
  Trash2, CheckCircle2, AlertCircle, Loader2, Download, 
  Filter, Phone, Shield, Lock, FileSpreadsheet, PlusCircle, RefreshCw
} from 'lucide-react';
import { supabaseService } from '../services/supabaseService';
import PageTransition from '../components/PageTransition';
import { Lead, WebsiteAudit, ContactMessage, Newsletter, BookedCall } from '../types/supabase';

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  
  // CRM Data States
  const [activeTab, setActiveTab] = useState<'leads' | 'audits' | 'messages' | 'newsletters' | 'calls'>('leads');
  const [leads, setLeads] = useState<Lead[]>([]);
  const [audits, setAudits] = useState<WebsiteAudit[]>([]);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [newsletters, setNewsletters] = useState<Newsletter[]>([]);
  const [calls, setCalls] = useState<BookedCall[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Filtering & Search
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [cityFilter, setCityFilter] = useState('all');

  // Edit notes state
  const [editingNotesId, setEditingNotesId] = useState<string | null>(null);
  const [tempNotes, setTempNotes] = useState('');

  // Password Verification for sandbox (or Supabase Auth link)
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'admin123' || password === 'harsh496001') {
      setIsAuthenticated(true);
      setLoginError('');
      localStorage.setItem('hds_admin_session', 'active');
    } else {
      setLoginError('Invalid access PIN/Password. Please check the credentials.');
    }
  };

  useEffect(() => {
    const session = localStorage.getItem('hds_admin_session');
    if (session === 'active') {
      setIsAuthenticated(true);
    }
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [leadsData, auditsData, msgsData, newsData, callsData] = await Promise.all([
        supabaseService.getAllLeads(),
        supabaseService.getAllAudits(),
        supabaseService.getAllMessages(),
        supabaseService.getAllNewsletterSubscribers(),
        supabaseService.getAllBookedCalls()
      ]);

      // Typesafe casting as fallback if needed
      setLeads(leadsData as Lead[]);
      setAudits(auditsData as WebsiteAudit[]);
      setMessages(msgsData as ContactMessage[]);
      setNewsletters(newsData as any[]);
      setCalls(callsData as BookedCall[]);
    } catch (err) {
      console.error('Error loading CRM records:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated]);

  // Lead Operations
  const handleUpdateLeadStatus = async (id: string, currentStatus: string) => {
    const statuses = ['New', 'Contacted', 'Converted', 'Lost'];
    const nextIdx = (statuses.indexOf(currentStatus) + 1) % statuses.length;
    const nextStatus = statuses[nextIdx];
    
    const success = await supabaseService.updateLeadStatus(id, nextStatus);
    if (success) {
      setLeads(prev => prev.map(l => l.id === id ? { ...l, status: nextStatus } : l));
    }
  };

  const handleUpdateNotes = async (id: string) => {
    const success = await supabaseService.updateLeadNotes(id, tempNotes);
    if (success) {
      setLeads(prev => prev.map(l => l.id === id ? { ...l, notes: tempNotes } : l));
      setEditingNotesId(null);
    }
  };

  const handleDeleteLead = async (id: string) => {
    if (confirm('Are you sure you want to delete this lead?')) {
      const success = await supabaseService.deleteLead(id);
      if (success) {
        setLeads(prev => prev.filter(l => l.id !== id));
      }
    }
  };

  // Audit Operations
  const handleToggleAuditStatus = async (id: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'New' ? 'Audited' : 'New';
    const success = await supabaseService.updateAuditStatus(id, nextStatus);
    if (success) {
      setAudits(prev => prev.map(a => a.id === id ? { ...a, status: nextStatus } : a));
    }
  };

  const handleDeleteAudit = async (id: string) => {
    if (confirm('Are you sure you want to delete this audit request?')) {
      const success = await supabaseService.deleteAudit(id);
      if (success) {
        setAudits(prev => prev.filter(a => a.id !== id));
      }
    }
  };

  // Message Operations
  const handleToggleMessageStatus = async (id: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'New' ? 'Read' : 'New';
    const success = await supabaseService.updateMessageStatus(id, nextStatus);
    if (success) {
      setMessages(prev => prev.map(m => m.id === id ? { ...m, status: nextStatus } : m));
    }
  };

  const handleDeleteMessage = async (id: string) => {
    if (confirm('Are you sure you want to delete this contact message?')) {
      const success = await supabaseService.deleteMessage(id);
      if (success) {
        setMessages(prev => prev.filter(m => m.id !== id));
      }
    }
  };

  // Newsletter operations
  const handleDeleteNewsletter = async (id: string) => {
    if (confirm('Are you sure you want to remove this subscriber?')) {
      const success = await supabaseService.deleteNewsletterSubscriber(id);
      if (success) {
        setNewsletters(prev => prev.filter(n => n.id !== id));
      }
    }
  };

  // Booked call operations
  const handleDeleteBookedCall = async (id: string) => {
    if (confirm('Are you sure you want to remove this call booking?')) {
      const success = await supabaseService.deleteBookedCall(id);
      if (success) {
        setCalls(prev => prev.filter(c => c.id !== id));
      }
    }
  };

  // Sandbox data injector
  const injectSampleLead = async () => {
    const randomNames = ['Amit Keshri', 'Ritu Baghel', 'Suraj Yadav', 'Neha Gabel', 'Sunil Agrawal'];
    const randomBusinesses = ['Keshri Sweets & Bakery', 'Baghel Medical Clinic', 'Yadav Automobile Store', 'Rhythm Classes Raigarh', 'Agrawal Showroom'];
    const randomServices = ['Business Website Design', 'Local SEO', 'Google Business Profile Optimization', 'Meta Ads', 'Website Redesign'];
    const randomCities = ['Raigarh', 'Tamnar', 'Kharsia'];
    const randomBudgets = ['Under ₹10k', '₹10k - ₹25k', '₹25k - ₹50k', 'Above ₹50k'];

    const pick = (arr: any[]) => arr[Math.floor(Math.random() * arr.length)];
    const city = pick(randomCities);
    const busName = pick(randomBusinesses);
    const name = pick(randomNames);

    const sampleLead = {
      id: 'lead-' + Date.now(),
      created_at: new Date().toISOString(),
      name: name,
      email: `${name.toLowerCase().replace(' ', '.')}@gmail.com`,
      phone: '+91 ' + Math.floor(7000000000 + Math.random() * 2999999999),
      business_name: busName,
      service: pick(randomServices),
      budget: pick(randomBudgets),
      message: `Simulated request for ${busName} located in ${city}. Looking to grow local foot traffic.`,
      status: 'New',
      source: '/admin-test-trigger',
      city: city,
      notes: ''
    };

    const existingLeads = JSON.parse(localStorage.getItem('hds_leads') || '[]');
    localStorage.setItem('hds_leads', JSON.stringify([sampleLead, ...existingLeads]));
    await fetchData();
  };

  const handleLogout = () => {
    localStorage.removeItem('hds_admin_session');
    setIsAuthenticated(false);
  };

  // Filter logic
  const filteredLeads = leads.filter(lead => {
    const matchesSearch = 
      lead.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.business_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.phone?.includes(searchTerm) ||
      (lead as any).city?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || lead.status === statusFilter;
    const matchesCity = cityFilter === 'all' || (lead as any).city === cityFilter;

    return matchesSearch && matchesStatus && matchesCity;
  });

  // Calculate statistics
  const stats = {
    totalLeads: leads.length,
    convertedLeads: leads.filter(l => l.status === 'Converted').length,
    conversionRate: leads.length ? Math.round((leads.filter(l => l.status === 'Converted').length / leads.length) * 100) : 0,
    totalCalls: calls.length,
    totalAudits: audits.length,
    totalNewsletters: newsletters.length,
    totalMessages: messages.length,
  };

  // CSV Export
  const exportToCSV = (type: string) => {
    let csvContent = "data:text/csv;charset=utf-8,";
    
    if (type === 'leads') {
      csvContent += "Date,Name,Email,Phone,Business Name,Service,Budget,Status,City,Notes\n";
      filteredLeads.forEach(l => {
        csvContent += `"${l.created_at || ''}","${l.name || ''}","${l.email || ''}","${l.phone || ''}","${l.business_name || ''}","${l.service || ''}","${l.budget || ''}","${l.status || ''}","${(l as any).city || ''}","${l.notes || ''}"\n`;
      });
    } else if (type === 'audits') {
      csvContent += "Date,Website,Business Name,Contact Name,Phone,Email,Status\n";
      audits.forEach(a => {
        csvContent += `"${a.created_at || ''}","${a.website || ''}","${a.business_name || ''}","${a.name || ''}","${a.phone || ''}","${a.email || ''}","${a.status || ''}"\n`;
      });
    } else {
      csvContent += "Email,Date Joined\n";
      newsletters.forEach(n => {
        csvContent += `"${n.email}","${n.created_at || ''}"\n`;
      });
    }

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `hds_crm_${type}_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!isAuthenticated) {
    return (
      <PageTransition>
        <div className="min-h-[80vh] flex items-center justify-center px-4 py-16">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md bg-[#0B0F19] border border-white/10 rounded-[32px] p-8 md:p-10 shadow-[0_0_50px_rgba(0,240,255,0.15)] relative"
          >
            {/* Ambient Background Light */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-accent/10 rounded-full blur-3xl" />
            
            <div className="flex flex-col items-center text-center mb-8">
              <div className="w-16 h-16 bg-accent/10 border border-accent/20 rounded-2xl flex items-center justify-center mb-4 text-accent">
                <Shield className="w-8 h-8" />
              </div>
              <h1 className="text-2xl font-bold font-heading text-white">Harsh Patel Portfolio CRM</h1>
              <p className="text-gray-400 text-sm mt-1">Access the secure administrative control center.</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-5">
              {loginError && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start text-red-400 text-xs">
                  <AlertCircle className="w-4.5 h-4.5 mr-2 shrink-0 mt-0.5" />
                  <span>{loginError}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Access Key / PIN</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-3.5 w-4.5 h-4.5 text-gray-500" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter access code (e.g. admin123)"
                    className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/50 text-white"
                  />
                </div>
                <p className="text-[10px] text-gray-500 mt-2">Default PIN: <strong className="text-accent/80">admin123</strong> for testing convenience.</p>
              </div>

              <button
                type="submit"
                className="w-full mt-6 premium-button flex items-center justify-center py-4 bg-gradient-to-r from-accent to-secondary text-black font-bold text-sm rounded-xl cursor-pointer"
              >
                Unlock Dashboard
              </button>
            </form>
          </motion.div>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header Block */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 pb-6 border-b border-white/5 gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <Shield className="w-5 h-5 text-accent" />
              <span className="text-xs uppercase font-bold text-gray-400 tracking-widest font-mono">HDS.CRM SECURE ACCESS</span>
            </div>
            <h1 className="text-3xl font-bold font-heading text-white mt-1">Harsh Patel CRM Lead Command</h1>
            <p className="text-gray-400 text-sm mt-1">Track conversions, website audits, booked calls, and local marketing prospects in real-time.</p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={injectSampleLead}
              className="px-4 py-2.5 bg-accent/15 border border-accent/20 hover:bg-accent/25 text-accent text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all"
              title="Add a test local lead to verify sorting, filters, notes, and metrics"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Simulate Lead</span>
            </button>
            
            <button
              onClick={fetchData}
              disabled={loading}
              className="p-2.5 bg-white/5 border border-white/10 text-gray-400 hover:text-white rounded-xl transition-all"
              title="Refresh database records"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>

            <button
              onClick={handleLogout}
              className="px-4 py-2.5 bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 text-red-400 text-xs font-bold rounded-xl transition-all"
            >
              Sign Out
            </button>
          </div>
        </div>

        {/* Stats Metrics Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3 text-gray-400">
              <span className="text-xs font-bold uppercase tracking-wider">Total Enquiries</span>
              <Users className="w-4.5 h-4.5 text-accent" />
            </div>
            <p className="text-3xl font-bold text-white">{stats.totalLeads}</p>
            <div className="text-[10px] text-gray-400 font-medium mt-1">Prospect pipeline size</div>
          </div>

          <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3 text-gray-400">
              <span className="text-xs font-bold uppercase tracking-wider">Conversion Rate</span>
              <BarChart3 className="w-4.5 h-4.5 text-secondary" />
            </div>
            <p className="text-3xl font-bold text-white">{stats.conversionRate}%</p>
            <div className="text-[10px] text-emerald-400 font-semibold mt-1">
              {stats.convertedLeads} Deals closed
            </div>
          </div>

          <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3 text-gray-400">
              <span className="text-xs font-bold uppercase tracking-wider">Free Site Audits</span>
              <Globe className="w-4.5 h-4.5 text-[#0080FF]" />
            </div>
            <p className="text-3xl font-bold text-white">{stats.totalAudits}</p>
            <div className="text-[10px] text-gray-400 font-medium mt-1">SEO & speed assessments</div>
          </div>

          <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3 text-gray-400">
              <span className="text-xs font-bold uppercase tracking-wider">Strategy Calls</span>
              <Calendar className="w-4.5 h-4.5 text-pink-400" />
            </div>
            <p className="text-3xl font-bold text-white">{stats.totalCalls}</p>
            <div className="text-[10px] text-gray-400 font-medium mt-1">Scheduled bookings</div>
          </div>
        </div>

        {/* Tab Selection */}
        <div className="flex items-center space-x-1.5 border-b border-white/5 mb-6 overflow-x-auto pb-px scrollbar-none">
          {[
            { id: 'leads', label: `Leads (${leads.length})`, icon: Users },
            { id: 'audits', label: `Website Audits (${audits.length})`, icon: Globe },
            { id: 'messages', label: `Contact Messages (${messages.length})`, icon: Mail },
            { id: 'calls', label: `Bookings (${calls.length})`, icon: Calendar },
            { id: 'newsletters', label: `Newsletter (${newsletters.length})`, icon: Mail }
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-3 rounded-t-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 border-b-2 transition-all cursor-pointer ${
                  activeTab === tab.id 
                    ? 'border-accent text-accent bg-accent/5' 
                    : 'border-transparent text-gray-400 hover:text-white hover:bg-white/[0.02]'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Content Box */}
        <div className="bg-[#0B0F19] border border-white/5 rounded-3xl p-6 shadow-sm overflow-hidden min-h-[400px]">
          
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="w-8 h-8 text-accent animate-spin mb-3" />
              <p className="text-gray-400 text-sm">Fetching cloud records securely...</p>
            </div>
          ) : (
            <>
              {/* LEADS TAB */}
              {activeTab === 'leads' && (
                <div>
                  {/* Search and Filters Bar */}
                  <div className="flex flex-col lg:flex-row items-center gap-3 mb-6">
                    <div className="relative w-full lg:flex-1">
                      <Search className="absolute left-3.5 top-3.5 w-4.5 h-4.5 text-gray-500" />
                      <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search leads by name, company, email, phone, or target city (Raigarh, Tamnar, Kharsia)..."
                        className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-xs focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/50 text-white"
                      />
                    </div>

                    <div className="flex items-center gap-3 w-full lg:w-auto shrink-0">
                      <div className="relative flex-1 lg:flex-none">
                        <select
                          value={statusFilter}
                          onChange={(e) => setStatusFilter(e.target.value)}
                          className="w-full lg:w-40 px-3 py-3 bg-[#0B0F19] border border-white/10 rounded-xl text-xs text-gray-300 focus:outline-none"
                        >
                          <option value="all">All Statuses</option>
                          <option value="New">New</option>
                          <option value="Contacted">Contacted</option>
                          <option value="Converted">Converted</option>
                          <option value="Lost">Lost</option>
                        </select>
                      </div>

                      <div className="relative flex-1 lg:flex-none">
                        <select
                          value={cityFilter}
                          onChange={(e) => setCityFilter(e.target.value)}
                          className="w-full lg:w-40 px-3 py-3 bg-[#0B0F19] border border-white/10 rounded-xl text-xs text-gray-300 focus:outline-none"
                        >
                          <option value="all">All Locations</option>
                          <option value="Raigarh">Raigarh</option>
                          <option value="Tamnar">Tamnar</option>
                          <option value="Kharsia">Kharsia</option>
                        </select>
                      </div>

                      <button
                        onClick={() => exportToCSV('leads')}
                        className="p-3 bg-white/5 border border-white/10 hover:bg-white/10 text-gray-300 rounded-xl transition-all shrink-0"
                        title="Export filtered list as Excel/CSV"
                      >
                        <FileSpreadsheet className="w-4.5 h-4.5" />
                      </button>
                    </div>
                  </div>

                  {/* Leads List Grid */}
                  {filteredLeads.length === 0 ? (
                    <div className="text-center py-16">
                      <Users className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                      <p className="text-gray-400 text-sm">No lead records found matching the query.</p>
                      <button 
                        onClick={injectSampleLead}
                        className="mt-4 text-xs font-bold text-accent hover:underline"
                      >
                        Simulate a new lead now
                      </button>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="border-b border-white/5 text-[10px] uppercase font-bold text-gray-500 tracking-wider">
                            <th className="py-3 px-4">Contact & Business</th>
                            <th className="py-3 px-4">Requirement</th>
                            <th className="py-3 px-4">Budget / City</th>
                            <th className="py-3 px-4">Status / Action</th>
                            <th className="py-3 px-4">Internal Notes</th>
                            <th className="py-3 px-4 text-right">Action</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                          {filteredLeads.map(lead => (
                            <tr key={lead.id} className="text-xs hover:bg-white/[0.01] transition-all">
                              <td className="py-4 px-4">
                                <div className="font-bold text-white text-sm">{lead.name}</div>
                                <div className="text-gray-400 font-mono mt-0.5">{lead.email}</div>
                                <div className="text-gray-500 font-mono flex items-center mt-0.5">
                                  <Phone className="w-3 h-3 mr-1" /> {lead.phone}
                                </div>
                              </td>
                              <td className="py-4 px-4">
                                <div className="text-accent font-semibold">{lead.service}</div>
                                <div className="text-gray-400 text-[11px] mt-1 max-w-[220px] line-clamp-2" title={lead.message}>
                                  {lead.message}
                                </div>
                              </td>
                              <td className="py-4 px-4">
                                <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-[10px] font-bold">
                                  {lead.budget || 'Standard'}
                                </span>
                                <div className="text-gray-400 text-[10px] mt-1.5 flex items-center">
                                  📍 <span className="font-semibold ml-0.5">{ (lead as any).city || 'Raigarh' }</span>
                                </div>
                              </td>
                              <td className="py-4 px-4">
                                <button
                                  onClick={() => handleUpdateLeadStatus(lead.id, lead.status || 'New')}
                                  className={`px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase transition-colors flex items-center gap-1 cursor-pointer ${
                                    lead.status === 'Converted' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                                    lead.status === 'Contacted' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                                    lead.status === 'Lost' ? 'bg-gray-500/10 text-gray-400 border border-gray-500/20' :
                                    'bg-accent/10 text-accent border border-accent/20'
                                  }`}
                                  title="Click to cycle status"
                                >
                                  <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                                  <span>{lead.status || 'New'}</span>
                                </button>
                              </td>
                              <td className="py-4 px-4 max-w-[200px]">
                                {editingNotesId === lead.id ? (
                                  <div className="flex items-center gap-1.5">
                                    <input
                                      type="text"
                                      value={tempNotes}
                                      onChange={(e) => setTempNotes(e.target.value)}
                                      className="px-2 py-1 bg-white/5 border border-white/20 rounded text-xs text-white focus:outline-none"
                                    />
                                    <button
                                      onClick={() => handleUpdateNotes(lead.id)}
                                      className="px-2 py-1 bg-accent text-black font-bold rounded text-[10px]"
                                    >
                                      Save
                                    </button>
                                  </div>
                                ) : (
                                  <div 
                                    onClick={() => {
                                      setEditingNotesId(lead.id);
                                      setTempNotes(lead.notes || '');
                                    }}
                                    className="cursor-pointer hover:bg-white/5 p-1 rounded text-gray-400 hover:text-white transition-colors min-h-[24px] italic"
                                    title="Click to add/edit administrative CRM notes"
                                  >
                                    {lead.notes || '+ Add Notes'}
                                  </div>
                                )}
                              </td>
                              <td className="py-4 px-4 text-right">
                                <button
                                  onClick={() => handleDeleteLead(lead.id)}
                                  className="p-2 text-red-500 hover:text-white hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer"
                                  title="Delete Lead"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {/* WEBSITE AUDITS TAB */}
              {activeTab === 'audits' && (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-sm font-bold uppercase tracking-wider text-gray-400">Website Audits Queue</h2>
                    <button
                      onClick={() => exportToCSV('audits')}
                      className="px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-xs font-bold flex items-center gap-1 text-white"
                    >
                      <Download className="w-4 h-4" /> Export CSV
                    </button>
                  </div>

                  {audits.length === 0 ? (
                    <div className="text-center py-16">
                      <Globe className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                      <p className="text-gray-400 text-sm">No website audit requests logged.</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="border-b border-white/5 text-[10px] uppercase font-bold text-gray-500 tracking-wider">
                            <th className="py-3 px-4">Company & Website</th>
                            <th className="py-3 px-4">Requestor Info</th>
                            <th className="py-3 px-4">Date</th>
                            <th className="py-3 px-4">Status</th>
                            <th className="py-3 px-4 text-right">Action</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                          {audits.map(audit => (
                            <tr key={audit.id} className="text-xs hover:bg-white/[0.01]">
                              <td className="py-4 px-4">
                                <div className="font-bold text-white text-sm">{audit.business_name}</div>
                                <a 
                                  href={`https://${audit.website.replace(/^(https?:\/\/)?(www\.)?/, '')}`} 
                                  target="_blank" 
                                  rel="noopener noreferrer" 
                                  className="text-accent font-mono hover:underline mt-0.5 block"
                                >
                                  {audit.website}
                                </a>
                                {audit.notes && (
                                  <div className="text-gray-500 italic mt-1 max-w-[280px] truncate">{audit.notes}</div>
                                )}
                              </td>
                              <td className="py-4 px-4">
                                <div className="text-white">{audit.name}</div>
                                <div className="text-gray-400 mt-0.5">{audit.email}</div>
                                <div className="text-gray-500 mt-0.5">{audit.phone}</div>
                              </td>
                              <td className="py-4 px-4 text-gray-400">
                                {audit.created_at ? new Date(audit.created_at).toLocaleDateString() : 'N/A'}
                              </td>
                              <td className="py-4 px-4">
                                <button
                                  onClick={() => handleToggleAuditStatus(audit.id, audit.status || 'New')}
                                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                                    audit.status === 'Audited' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                                  }`}
                                >
                                  {audit.status || 'New'}
                                </button>
                              </td>
                              <td className="py-4 px-4 text-right">
                                <button
                                  onClick={() => handleDeleteAudit(audit.id)}
                                  className="p-2 text-red-500 hover:text-white hover:bg-red-500/10 rounded-lg transition-colors"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {/* CONTACT MESSAGES TAB */}
              {activeTab === 'messages' && (
                <div>
                  <h2 className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-4">Contact Form Submissions</h2>

                  {messages.length === 0 ? (
                    <div className="text-center py-16">
                      <Mail className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                      <p className="text-gray-400 text-sm">No contact messages received.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {messages.map(msg => (
                        <div key={msg.id} className="p-5 bg-white/[0.01] border border-white/5 rounded-2xl flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                          <div>
                            <div className="flex items-center gap-3">
                              <span className="font-bold text-white text-base">{msg.name}</span>
                              <span className="text-[10px] text-gray-500 font-mono">{msg.created_at ? new Date(msg.created_at).toLocaleDateString() : ''}</span>
                              <button
                                onClick={() => handleToggleMessageStatus(msg.id, msg.status || 'New')}
                                className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-widest ${
                                  msg.status === 'Read' ? 'bg-gray-500/10 text-gray-400' : 'bg-accent/10 text-accent animate-pulse'
                                }`}
                              >
                                {msg.status || 'New'}
                              </button>
                            </div>
                            <div className="text-gray-400 font-mono mt-1 text-xs">{msg.email} | {msg.phone}</div>
                            <div className="text-accent font-semibold mt-3 text-xs">Subject: {msg.subject}</div>
                            <p className="text-gray-300 mt-2 text-sm max-w-3xl leading-relaxed bg-white/5 p-3 rounded-xl border border-white/5">{msg.message}</p>
                          </div>
                          
                          <button
                            onClick={() => handleDeleteMessage(msg.id)}
                            className="px-3 py-2 bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 text-red-400 rounded-xl text-xs flex items-center gap-1 shrink-0 self-end md:self-start transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" /> Delete
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* BOOKINGS TAB */}
              {activeTab === 'calls' && (
                <div>
                  <h2 className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-4">Booked Strategy Calls</h2>

                  {calls.length === 0 ? (
                    <div className="text-center py-16">
                      <Calendar className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                      <p className="text-gray-400 text-sm">No booked consult calls recorded.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {calls.map(call => (
                        <div key={call.id} className="p-5 bg-white/[0.01] border border-white/5 rounded-2xl flex flex-col justify-between">
                          <div>
                            <div className="flex items-center justify-between mb-3">
                              <span className="font-bold text-white text-base">{call.name}</span>
                              <span className="px-2 py-0.5 rounded bg-pink-500/10 text-pink-400 text-[10px] font-bold">
                                {call.meeting_time}
                              </span>
                            </div>
                            
                            <div className="space-y-1.5 text-xs text-gray-400">
                              <div className="flex items-center gap-1.5">
                                📅 <span className="font-semibold text-white">{call.meeting_date}</span>
                              </div>
                              <div className="flex items-center gap-1.5">
                                📧 <span className="font-mono">{call.email}</span>
                              </div>
                              <div className="flex items-center gap-1.5">
                                📞 <span className="font-mono">{call.phone}</span>
                              </div>
                              <div className="flex items-center gap-1.5">
                                🛠 <span className="text-accent font-semibold">{call.service}</span>
                              </div>
                            </div>

                            {call.notes && (
                              <p className="text-gray-500 italic mt-3 text-xs border-t border-white/5 pt-2.5">
                                Notes: {call.notes}
                              </p>
                            )}
                          </div>

                          <div className="flex items-center justify-between border-t border-white/5 pt-3.5 mt-4">
                            <a 
                              href={`https://wa.me/${call.phone.replace(/[^0-9]/g, '')}`} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className="text-xs text-[#25D366] hover:underline font-semibold flex items-center gap-1"
                            >
                              💬 Connect on WhatsApp
                            </a>

                            <button
                              onClick={() => handleDeleteBookedCall(call.id)}
                              className="text-red-500 hover:text-white hover:bg-red-500/10 p-1.5 rounded"
                              title="Cancel & Delete Booking"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* NEWSLETTER SIGNUPS TAB */}
              {activeTab === 'newsletters' && (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-sm font-bold uppercase tracking-wider text-gray-400">Newsletter Subscribers</h2>
                    <button
                      onClick={() => exportToCSV('newsletters')}
                      className="px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-xs font-bold flex items-center gap-1 text-white"
                    >
                      <Download className="w-4 h-4" /> Export CSV
                    </button>
                  </div>

                  {newsletters.length === 0 ? (
                    <div className="text-center py-16">
                      <Mail className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                      <p className="text-gray-400 text-sm">No newsletter subscribers logged.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                      {newsletters.map(item => (
                        <div key={item.id} className="p-4 bg-white/[0.01] border border-white/5 rounded-xl flex items-center justify-between">
                          <div className="min-w-0">
                            <div className="text-white font-mono truncate text-xs">{item.email}</div>
                            <div className="text-[10px] text-gray-500 mt-1">
                              Joined: {item.created_at ? new Date(item.created_at).toLocaleDateString() : 'N/A'}
                            </div>
                          </div>

                          <button
                            onClick={() => handleDeleteNewsletter(item.id)}
                            className="p-1.5 text-gray-500 hover:text-red-400 transition-colors cursor-pointer"
                            title="Remove Subscriber"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </>
          )}

        </div>
      </div>
    </PageTransition>
  );
}
