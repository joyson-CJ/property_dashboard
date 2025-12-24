import React, { useState, useMemo, useEffect } from 'react';
import { 
  Users, 
  Home, 
  AlertCircle, 
  Plus, 
  Search, 
  FileText, 
  ChevronRight, 
  ArrowLeft, 
  CheckCircle2, 
  XCircle, 
  UploadCloud, 
  Filter, 
  MoreHorizontal, 
  Mail,
  PieChart,
  ArrowRight,
  Download,
  CreditCard,
  Banknote,
  Calendar,
  File
} from 'lucide-react';

// --- Mock Data Generators ---

const generateId = (prefix) => `${prefix}${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;

const INITIAL_CLIENTS = [
  { id: 'CL-1024', name: 'Neville Longbottom', email: 'neville@hgv.uk', phone: '+44 7700 900001', location: 'London', status: 'Needs Action', joined: '2023-01-15' },
  { id: 'CL-1025', name: 'Luna Lovegood', email: 'luna@quibbler.co.uk', phone: '+44 7700 900002', location: 'Bristol', status: 'Good', joined: '2023-03-22' },
  { id: 'CL-1026', name: 'Arthur Weasley', email: 'arthur@ministry.gov.uk', phone: '+44 7700 900003', location: 'Devon', status: 'Good', joined: '2022-11-05' },
  { id: 'CL-1027', name: 'Draco Malfoy', email: 'draco@manor.com', phone: '+44 7700 900004', location: 'Wiltshire', status: 'Needs Action', joined: '2023-06-10' },
];

const INITIAL_PROPERTIES = [
  { id: 'PR-5001', tenantId: 'T-2001', clientId: 'CL-1024', address: '12 Grimmauld Place, London', type: 'Residential', tenant: 'Sirius Black', rent: 2500, rentStatus: 'Overdue', leaseStart: '2023-01-01', nextDue: '2025-02-01', paymentFreq: 'Monthly', lastInspection: '2024-01-15' },
  { id: 'PR-5002', tenantId: 'T-2002', clientId: 'CL-1024', address: 'Greenhouse 3, Hogwarts Grounds', type: 'Commercial', tenant: 'Pomona Sprout', rent: 800, rentStatus: 'Paid', leaseStart: '2022-09-01', nextDue: '2025-03-01', paymentFreq: 'Quarterly', lastInspection: '2024-05-20' },
  { id: 'PR-5003', tenantId: 'T-2003', clientId: 'CL-1025', address: 'The Rookery, Ottery St Catchpole', type: 'Residential', tenant: 'Xenophilius', rent: 1200, rentStatus: 'Paid', leaseStart: '2021-05-01', nextDue: '2025-02-01', paymentFreq: 'Monthly', lastInspection: '2023-12-10' },
  { id: 'PR-5004', tenantId: 'T-2004', clientId: 'CL-1027', address: 'Borgin & Burkes, Knockturn Alley', type: 'Commercial', tenant: 'Mr. Borgin', rent: 4500, rentStatus: 'Unpaid', leaseStart: '2020-02-01', nextDue: '2025-02-01', paymentFreq: 'Monthly', lastInspection: '2024-02-28' },
  { id: 'PR-5005', tenantId: 'T-EMPTY', clientId: 'CL-1027', address: 'Malfoy Manor Guest House', type: 'Residential', tenant: 'Bellatrix L.', rent: 0, rentStatus: 'Vacant', leaseStart: '', nextDue: '-', paymentFreq: 'Monthly', lastInspection: '2023-10-31' },
];

const DUMMY_LEASE_DATA = [
  { address: '221B Baker Street, London', type: 'Residential', tenant: 'Sherlock Holmes', rent: '3200', leaseStart: '2023-05-01', nextDue: '2025-06-01', paymentFreq: 'Monthly' },
  { address: 'Bag End, Hobbiton, Shire', type: 'Residential', tenant: 'Bilbo Baggins', rent: '500', leaseStart: '1937-09-21', nextDue: '2037-09-21', paymentFreq: 'Yearly' },
  { address: '10880 Malibu Point, Malibu', type: 'Residential', tenant: 'Tony Stark', rent: '15000', leaseStart: '2024-01-01', nextDue: '2025-02-01', paymentFreq: 'Monthly' },
  { address: 'Apt 20, 495 Grove St, NY', type: 'Residential', tenant: 'Monica Geller', rent: '200', leaseStart: '2020-01-01', nextDue: '2025-02-01', paymentFreq: 'Monthly' },
  { address: '308 Negra Arroyo Lane, ABQ', type: 'Residential', tenant: 'Walter White', rent: '1200', leaseStart: '2023-08-15', nextDue: '2024-08-15', paymentFreq: 'Monthly' },
];

const MOCK_CORRESPONDENCE = [
  { id: 1, from: 'Tenant', subject: 'Heating Issue', date: '2024-02-10', preview: 'The boiler is making a strange noise again...' },
  { id: 2, from: 'You', subject: 'Re: Heating Issue', date: '2024-02-11', preview: 'I have contacted the engineer, they will be there tomorrow.' },
  { id: 3, from: 'Tenant', subject: 'Rent Payment', date: '2024-01-01', preview: 'Just transferred the rent for this month.' },
];

const MOCK_DOCS = [
  { id: 1, name: 'Lease_Agreement_Signed.pdf', type: 'PDF', date: '2023-01-01' },
  { id: 2, name: 'Inventory_Checklist.pdf', type: 'PDF', date: '2023-01-01' },
  { id: 3, name: 'Gas_Safety_Cert_2024.pdf', type: 'PDF', date: '2024-01-15' },
];

const MOCK_PAYMENTS = [
  { id: 1, date: '2024-02-01', type: 'Online', amount: 2500, status: 'Completed' },
  { id: 2, date: '2024-01-01', type: 'Online', amount: 2500, status: 'Completed' },
  { id: 3, date: '2023-12-01', type: 'Cash', amount: 2500, status: 'Completed' },
];

// --- Utilities ---

const triggerDownload = (filename, mimeType) => {
  // Create dummy content
  const content = new Blob(['Dummy content for ' + filename], { type: mimeType });
  const url = window.URL.createObjectURL(content);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};

// --- Shared Components ---

const StatusBadge = ({ status }) => {
  const styles = {
    'Good': 'bg-green-100 text-green-700 border-green-200',
    'Paid': 'bg-green-100 text-green-700 border-green-200',
    'Completed': 'bg-green-100 text-green-700 border-green-200',
    'Needs Action': 'bg-red-100 text-red-700 border-red-200',
    'Overdue': 'bg-red-100 text-red-700 border-red-200',
    'Unpaid': 'bg-amber-100 text-amber-700 border-amber-200',
    'Vacant': 'bg-gray-100 text-gray-700 border-gray-200',
  };
  
  const defaultStyle = 'bg-blue-50 text-blue-700 border-blue-200';

  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${styles[status] || defaultStyle}`}>
      {status}
    </span>
  );
};

const Header = ({ title, subtitle, action }) => (
  <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-gray-200 mb-6 gap-4">
    <div>
      <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
      {subtitle && <p className="text-gray-500 mt-1">{subtitle}</p>}
    </div>
    {action && <div>{action}</div>}
  </div>
);

const Card = ({ children, className = '' }) => (
  <div className={`bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden ${className}`}>
    {children}
  </div>
);

// --- Sub-View Components (Defined OUTSIDE App) ---

const DashboardView = ({ 
  stats, 
  filteredClients, 
  searchTerm, 
  setSearchTerm, 
  filterStatus, 
  setFilterStatus, 
  isMenuOpen, 
  setIsMenuOpen, 
  setView, 
  handleClientClick,
  properties 
}) => (
  <div className="space-y-6 animate-in fade-in duration-500">
    <Header 
      title="Dashboard" 
      subtitle="Welcome back, Northshore Legal."
      action={
        <div className="relative">
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-lg hover:bg-slate-800 transition-colors shadow-sm"
          >
            <Plus size={18} />
            <span>Add New</span>
          </button>
          {/* Dropdown Menu */}
          {isMenuOpen && (
            <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 z-10">
              <button 
                onClick={() => {
                  setView('add-client');
                  setIsMenuOpen(false);
                }}
                className="w-full text-left px-4 py-3 hover:bg-slate-50 text-gray-700 text-sm font-medium border-b border-gray-100 first:rounded-t-lg"
              >
                Add New Client
              </button>
              <button 
                onClick={() => {
                  setView('add-property');
                  setIsMenuOpen(false);
                }}
                className="w-full text-left px-4 py-3 hover:bg-slate-50 text-gray-700 text-sm font-medium last:rounded-b-lg"
              >
                Add New Property
              </button>
            </div>
          )}
        </div>
      }
    />

    {/* Stats Cards */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card className="p-6 flex items-center gap-4 border-l-4 border-l-blue-500">
        <div className="p-3 bg-blue-50 rounded-full text-blue-600">
          <Users size={24} />
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500">Total Clients</p>
          <h3 className="text-2xl font-bold text-gray-900">{stats.totalClients}</h3>
        </div>
      </Card>
      <Card className="p-6 flex items-center gap-4 border-l-4 border-l-emerald-500">
        <div className="p-3 bg-emerald-50 rounded-full text-emerald-600">
          <Home size={24} />
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500">Total Properties</p>
          <h3 className="text-2xl font-bold text-gray-900">{stats.totalProperties}</h3>
        </div>
      </Card>
      <Card className="p-6 flex items-center gap-4 border-l-4 border-l-red-500">
        <div className="p-3 bg-red-50 rounded-full text-red-600">
          <AlertCircle size={24} />
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500">Action Needed</p>
          <h3 className="text-2xl font-bold text-gray-900">{stats.actionsNeeded} Alerts</h3>
        </div>
      </Card>
    </div>

    {/* Filters & Search */}
    <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
      <div className="flex items-center gap-2 w-full md:w-auto">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Search (Type 3+ chars)..." 
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button 
          onClick={() => triggerDownload('blank_excel.xlsx', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')}
          className="flex items-center gap-2 px-3 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 text-sm font-medium transition-colors"
        >
          <Download size={16} />
          Export
        </button>
      </div>
      
      <div className="flex gap-2 w-full md:w-auto overflow-x-auto">
        {['All', 'Needs Action', 'Good'].map(status => (
          <button 
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
              filterStatus === status 
                ? 'bg-slate-900 text-white' 
                : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}
          >
            {status}
          </button>
        ))}
      </div>
    </div>

    {/* Clients Table */}
    <Card className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-200">
            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Client ID</th>
            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Client Name</th>
            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Location</th>
            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Properties</th>
            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {filteredClients.map((client) => {
            const clientProps = properties.filter(p => p.clientId === client.id).length;
            return (
              <tr 
                key={client.id} 
                onClick={() => handleClientClick(client)}
                className="hover:bg-blue-50/50 cursor-pointer transition-colors group"
              >
                <td className="px-6 py-4 text-sm font-mono text-gray-500">{client.id}</td>
                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                  <div className="flex flex-col">
                    <span>{client.name}</span>
                    <span className="text-xs text-gray-400 font-normal">{client.email}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">{client.location}</td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  <span className="bg-gray-100 px-2 py-1 rounded text-xs font-semibold">{clientProps} Units</span>
                </td>
                <td className="px-6 py-4 text-sm">
                  <StatusBadge status={client.status} />
                </td>
                <td className="px-6 py-4 text-right text-gray-400">
                  <ChevronRight className="opacity-0 group-hover:opacity-100 transition-opacity ml-auto" size={18} />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      {filteredClients.length === 0 && (
        <div className="p-8 text-center text-gray-500 text-sm">No clients found matching your search.</div>
      )}
    </Card>
  </div>
);

const ClientDetailsView = ({ client, properties, setView, setSelectedClient, handlePropertyClick }) => {
  const clientProperties = properties.filter(p => p.clientId === client.id);
  const [propSearch, setPropSearch] = useState('');

  const filteredProps = clientProperties.filter(p => 
    p.address.toLowerCase().includes(propSearch.toLowerCase()) || 
    p.tenant.toLowerCase().includes(propSearch.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
      <button 
        onClick={() => { setView('dashboard'); setSelectedClient(null); }}
        className="flex items-center text-sm text-gray-500 hover:text-slate-900 transition-colors"
      >
        <ArrowLeft size={16} className="mr-1" /> Back to Dashboard
      </button>

      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{client.name}</h1>
          <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-500">
            <span className="flex items-center gap-1"><Mail size={14}/> {client.email}</span>
            <span className="flex items-center gap-1"><Users size={14}/> ID: {client.id}</span>
            <span className="flex items-center gap-1"><Home size={14}/> {clientProperties.length} Properties</span>
          </div>
        </div>
        <StatusBadge status={client.status} />
      </div>

      <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-800">Properties Portfolio</h2>
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input 
              type="text" 
              placeholder="Search properties..." 
              className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-slate-500"
              value={propSearch}
              onChange={(e) => setPropSearch(e.target.value)}
            />
          </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProps.map(property => (
          <Card key={property.id} className="flex flex-col h-full hover:shadow-md transition-shadow group">
            <div className="p-5 flex-1">
              <div className="flex justify-between items-start mb-4">
                <div className="bg-slate-100 p-2 rounded-lg text-slate-600">
                  <Home size={20} />
                </div>
                <StatusBadge status={property.rentStatus} />
              </div>
              
              <h3 className="font-semibold text-gray-900 mb-1 truncate" title={property.address}>
                {property.address}
              </h3>
              <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                  <span>{property.type}</span>
                  <span>•</span>
                  <span className="font-mono text-xs bg-gray-100 px-1.5 py-0.5 rounded">ID: {property.id}</span>
              </div>
              
              <div className="space-y-3 text-sm border-t border-gray-100 pt-4">
                <div className="flex justify-between">
                  <span className="text-gray-500">Tenant</span>
                  <div className="text-right">
                      <div className="font-medium text-gray-900">{property.tenant || 'Vacant'}</div>
                      <div className="text-xs text-gray-400">{property.tenantId}</div>
                  </div>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Rent</span>
                  <div className="text-right">
                      <div className="font-medium text-gray-900">£{property.rent}</div>
                      <div className="text-xs text-gray-400">{property.paymentFreq}</div>
                  </div>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Next Due</span>
                  <span className="font-medium text-slate-700">{property.nextDue || '-'}</span>
                </div>
              </div>
            </div>
            
            <div 
              onClick={() => handlePropertyClick(property)}
              className="bg-gray-50 px-5 py-3 border-t border-gray-200 flex justify-between items-center cursor-pointer hover:bg-slate-100 transition-colors"
            >
               <span className="text-xs font-medium text-slate-600 group-hover:text-slate-900">
                 View Details
               </span>
               <ArrowRight size={16} className="text-slate-400 group-hover:text-slate-800 transition-colors"/>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

const PropertyDetailsView = ({ property, client, setView, payments, setPayments }) => {
  const [activeTab, setActiveTab] = useState('Correspondence');
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [newPayment, setNewPayment] = useState({ 
    type: 'Online', 
    amount: property.rent || '', 
    date: '', 
    dueDate: property.nextDue || '' 
  });

  const handleAddPayment = (e) => {
    e.preventDefault();
    const payment = {
      id: Date.now(),
      ...newPayment,
      status: 'Completed'
    };
    setPayments([payment, ...payments]);
    setShowPaymentForm(false);
  };

  return (
    <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
      <button 
        onClick={() => { setView('client-details'); }}
        className="flex items-center text-sm text-gray-500 hover:text-slate-900 transition-colors"
      >
        <ArrowLeft size={16} className="mr-1" /> Back to Client
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Sidebar: Contract Details & Info */}
          <div className="lg:col-span-1 space-y-6">
              <Card className="p-6">
                  <div className="flex justify-between items-start mb-6">
                      <h3 className="font-semibold text-gray-900">Contract Details</h3>
                      <StatusBadge status={property.rentStatus} />
                  </div>
                  
                  <div className="space-y-6">
                      <div className="flex items-start gap-3">
                          <div className="mt-1 text-gray-400"><Home size={18} /></div>
                          <div>
                              <p className="text-xs text-gray-500 uppercase tracking-wide">Property Address</p>
                              <p className="font-medium text-gray-900">{property.address}</p>
                              <p className="text-xs text-gray-400 mt-0.5">ID: {property.id}</p>
                          </div>
                      </div>

                      <div className="flex items-start gap-3">
                          <div className="mt-1 text-gray-400"><Banknote size={18} /></div>
                          <div>
                              <p className="text-xs text-gray-500 uppercase tracking-wide">Monthly Rent</p>
                              <p className="font-medium text-gray-900">£{property.rent}</p>
                          </div>
                      </div>

                      <div className="flex items-start gap-3">
                          <div className="mt-1 text-gray-400"><Calendar size={18} /></div>
                          <div>
                              <p className="text-xs text-gray-500 uppercase tracking-wide">Lease Started</p>
                              <p className="font-medium text-gray-900">{property.leaseStart}</p>
                          </div>
                      </div>

                       <div className="flex items-start gap-3">
                          <div className="mt-1 text-gray-400"><Users size={18} /></div>
                          <div>
                              <p className="text-xs text-gray-500 uppercase tracking-wide">Landlord Client</p>
                              <p className="font-medium text-gray-900">{client?.name}</p>
                              <p className="text-xs text-gray-400 mt-0.5">{client?.id}</p>
                          </div>
                      </div>
                  </div>
              </Card>

              <Card className="p-6">
                  <h3 className="font-semibold text-gray-900 mb-6">Tenant Information</h3>
                  <div className="space-y-4">
                       <div className="flex items-start gap-3">
                          <div className="mt-1 text-gray-400"><Users size={18} /></div>
                          <div>
                              <p className="font-medium text-gray-900">{property.tenant}</p>
                              <p className="text-xs text-gray-400 mt-0.5">ID: {property.tenantId}</p>
                          </div>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-gray-600">
                          <Mail size={16} className="text-gray-400" />
                          <span>tenant@example.com</span>
                      </div>
                  </div>
              </Card>
          </div>

          {/* Right Side: Tabs */}
          <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden min-h-[600px] flex flex-col">
                  {/* Tabs Header */}
                  <div className="flex border-b border-gray-200">
                      {['Correspondence', 'Documents', 'Payments'].map(tab => (
                          <button
                              key={tab}
                              onClick={() => setActiveTab(tab)}
                              className={`flex-1 py-4 text-sm font-medium border-b-2 transition-colors ${
                                  activeTab === tab 
                                  ? 'border-slate-900 text-slate-900' 
                                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                              }`}
                          >
                              {tab}
                          </button>
                      ))}
                  </div>

                  {/* Tabs Content */}
                  <div className="p-6 flex-1 bg-gray-50/50">
                      {activeTab === 'Correspondence' && (
                          <div className="space-y-4">
                              {MOCK_CORRESPONDENCE.map(mail => (
                                  <div key={mail.id} className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                                      <div className="flex justify-between items-start mb-2">
                                          <div className="flex items-center gap-2">
                                              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-xs font-bold">
                                                  {mail.from[0]}
                                              </div>
                                              <div>
                                                  <p className="text-sm font-medium text-gray-900">{mail.from}</p>
                                                  <p className="text-xs text-gray-500">{mail.date}</p>
                                              </div>
                                          </div>
                                      </div>
                                      <h4 className="text-sm font-semibold text-gray-800 mb-1">{mail.subject}</h4>
                                      <p className="text-sm text-gray-600 line-clamp-2">{mail.preview}</p>
                                  </div>
                              ))}
                          </div>
                      )}

                      {activeTab === 'Documents' && (
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                              {MOCK_DOCS.map(doc => (
                                  <div 
                                    key={doc.id} 
                                    onClick={() => triggerDownload('test_pdf.pdf', 'application/pdf')}
                                    className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm hover:border-blue-300 transition-colors flex flex-col items-center text-center cursor-pointer group"
                                  >
                                      <div className="w-12 h-12 bg-red-50 text-red-500 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                                          <FileText size={24} />
                                      </div>
                                      <p className="text-sm font-medium text-gray-700 truncate w-full mb-1" title={doc.name}>{doc.name}</p>
                                      <p className="text-xs text-gray-400">{doc.date}</p>
                                  </div>
                              ))}
                          </div>
                      )}

                      {activeTab === 'Payments' && (
                          <div className="space-y-4">
                              <div className="flex justify-between items-center mb-4">
                                  <h3 className="font-semibold text-gray-900">Payment History</h3>
                                  <div className="flex gap-2">
                                      <button 
                                        onClick={() => triggerDownload('blank_excel.xlsx', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')}
                                        className="flex items-center gap-1 px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-medium text-gray-600 hover:bg-gray-50"
                                      >
                                          <Download size={14} /> Export
                                      </button>
                                      <button 
                                          onClick={() => setShowPaymentForm(true)}
                                          className="flex items-center gap-1 px-3 py-1.5 bg-slate-900 text-white rounded-lg text-xs font-medium hover:bg-slate-800"
                                      >
                                          <Plus size={14} /> Add Payment
                                      </button>
                                  </div>
                              </div>

                              {/* Add Payment Form Inline */}
                              {showPaymentForm && (
                                  <div className="bg-white p-4 rounded-lg border border-blue-200 shadow-sm mb-4 animate-in fade-in slide-in-from-top-2">
                                      <h4 className="text-sm font-semibold text-gray-900 mb-3">New Payment Entry</h4>
                                      <form onSubmit={handleAddPayment} className="space-y-3">
                                          <div className="flex gap-2">
                                              <button
                                                  type="button"
                                                  onClick={() => setNewPayment({...newPayment, type: 'Online'})}
                                                  className={`flex-1 py-2 text-xs font-medium rounded-md border ${newPayment.type === 'Online' ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-white border-gray-200 text-gray-600'}`}
                                              >
                                                  <CreditCard size={14} className="inline mr-1" /> Online
                                              </button>
                                              <button
                                                  type="button"
                                                  onClick={() => setNewPayment({...newPayment, type: 'Cash'})}
                                                  className={`flex-1 py-2 text-xs font-medium rounded-md border ${newPayment.type === 'Cash' ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-white border-gray-200 text-gray-600'}`}
                                              >
                                                  <Banknote size={14} className="inline mr-1" /> Cash
                                              </button>
                                          </div>
                                          <div className="grid grid-cols-2 gap-3">
                                              <div>
                                                  <label className="text-xs text-gray-500">Amount (£)</label>
                                                  <input 
                                                      type="number" 
                                                      required
                                                      value={newPayment.amount}
                                                      onChange={e => setNewPayment({...newPayment, amount: e.target.value})}
                                                      className="w-full mt-1 p-2 border border-gray-200 rounded text-sm" 
                                                  />
                                              </div>
                                              <div>
                                                  <label className="text-xs text-gray-500">Date Paid</label>
                                                  <input 
                                                      type="date" 
                                                      required
                                                      value={newPayment.date}
                                                      onChange={e => setNewPayment({...newPayment, date: e.target.value})}
                                                      className="w-full mt-1 p-2 border border-gray-200 rounded text-sm" 
                                                  />
                                              </div>
                                          </div>
                                          <div>
                                              <label className="text-xs text-gray-500">Due Date (Autofilled)</label>
                                              <input 
                                                  type="date" 
                                                  value={newPayment.dueDate}
                                                  onChange={e => setNewPayment({...newPayment, dueDate: e.target.value})}
                                                  className="w-full mt-1 p-2 border border-gray-200 rounded text-sm bg-gray-50" 
                                              />
                                          </div>
                                          <div className="flex justify-end gap-2 pt-2">
                                              <button 
                                                  type="button" 
                                                  onClick={() => setShowPaymentForm(false)}
                                                  className="px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-100 rounded"
                                              >
                                                  Cancel
                                              </button>
                                              <button 
                                                  type="submit" 
                                                  className="px-3 py-1.5 text-xs font-medium text-white bg-slate-900 hover:bg-slate-800 rounded"
                                              >
                                                  Save Payment
                                              </button>
                                          </div>
                                      </form>
                                  </div>
                              )}

                              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                                  <table className="w-full text-sm text-left">
                                      <thead className="bg-gray-50 border-b border-gray-200 text-gray-500">
                                          <tr>
                                              <th className="px-4 py-3 font-medium">Date</th>
                                              <th className="px-4 py-3 font-medium">Type</th>
                                              <th className="px-4 py-3 font-medium">Amount</th>
                                              <th className="px-4 py-3 font-medium">Status</th>
                                          </tr>
                                      </thead>
                                      <tbody className="divide-y divide-gray-100">
                                          {payments.map(pay => (
                                              <tr key={pay.id} className="hover:bg-gray-50">
                                                  <td className="px-4 py-3 text-gray-600">{pay.date}</td>
                                                  <td className="px-4 py-3 text-gray-900">{pay.type}</td>
                                                  <td className="px-4 py-3 font-medium text-gray-900">£{pay.amount}</td>
                                                  <td className="px-4 py-3"><StatusBadge status={pay.status} /></td>
                                              </tr>
                                          ))}
                                      </tbody>
                                  </table>
                              </div>
                          </div>
                      )}
                  </div>
              </div>
          </div>
      </div>
    </div>
  );
};

const AddClientView = ({ setView, handleAddClient }) => {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', location: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    handleAddClient(formData);
  };

  return (
    <div className="max-w-2xl mx-auto animate-in fade-in zoom-in-95 duration-300">
      <button 
        onClick={() => setView('dashboard')}
        className="flex items-center text-sm text-gray-500 hover:text-slate-900 transition-colors mb-6"
      >
        <ArrowLeft size={16} className="mr-1" /> Cancel
      </button>
      
      <Card className="p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Add New Client</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Full Name</label>
              <input 
                required
                type="text" 
                className="w-full p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500 outline-none transition-all"
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Email Address</label>
              <input 
                required
                type="email" 
                className="w-full p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500 outline-none transition-all"
                value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Phone Number</label>
              <input 
                type="tel" 
                className="w-full p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500 outline-none transition-all"
                value={formData.phone}
                onChange={e => setFormData({...formData, phone: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Primary Location</label>
              <input 
                type="text" 
                className="w-full p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500 outline-none transition-all"
                value={formData.location}
                onChange={e => setFormData({...formData, location: e.target.value})}
              />
            </div>
          </div>
          
          <div className="pt-4 border-t border-gray-100 flex justify-end gap-3">
             <button 
               type="button" 
               onClick={() => setView('dashboard')}
               className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
             >
               Cancel
             </button>
             <button 
               type="submit" 
               className="px-6 py-2 text-sm font-medium text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors shadow-sm"
             >
               Create Client Record
             </button>
          </div>
        </form>
      </Card>
    </div>
  );
};

const AddPropertyView = ({ setView, clients, handleAddProperty }) => {
  const [step, setStep] = useState(1);
  const [selectedClientId, setSelectedClientId] = useState('');
  const [clientSearchTerm, setClientSearchTerm] = useState('');
  const [showClientDropdown, setShowClientDropdown] = useState(false);
  const [isProcessingFile, setIsProcessingFile] = useState(false);
  
  // Filter clients for the searchable dropdown
  const filteredClients = clients.filter(c => 
    c.name.toLowerCase().includes(clientSearchTerm.toLowerCase()) ||
    c.id.toLowerCase().includes(clientSearchTerm.toLowerCase())
  );

  const [formData, setFormData] = useState({
    address: '',
    type: 'Residential',
    tenant: '',
    rent: '',
    leaseStart: '',
    leaseEnd: ''
  });

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsProcessingFile(true);
    // Simulate API processing delay with random data selection
    setTimeout(() => {
      const randomData = DUMMY_LEASE_DATA[Math.floor(Math.random() * DUMMY_LEASE_DATA.length)];
      setFormData(randomData);
      setIsProcessingFile(false);
    }, 1500);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleAddProperty({ 
        ...formData, 
        clientId: selectedClientId, 
        rentStatus: 'Paid',
        paymentFreq: 'Monthly',
        nextDue: formData.leaseEnd // Simplified logic for demo
    });
  };

  return (
    <div className="max-w-2xl mx-auto animate-in fade-in zoom-in-95 duration-300">
       <button 
        onClick={() => setView('dashboard')}
        className="flex items-center text-sm text-gray-500 hover:text-slate-900 transition-colors mb-6"
      >
        <ArrowLeft size={16} className="mr-1" /> Cancel
      </button>

      <Card className="p-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Add New Property</h2>
          <div className="flex items-center gap-2 mt-2">
            <span className={`h-2 w-2 rounded-full ${step === 1 ? 'bg-blue-600' : 'bg-green-500'}`}></span>
            <p className="text-sm text-gray-500">Step {step} of 2: {step === 1 ? 'Select Client' : 'Property Details'}</p>
          </div>
        </div>

        {step === 1 ? (
           <div className="space-y-6">
             <div className="space-y-2 relative">
                <label className="text-sm font-medium text-gray-700">Select Landlord (Client)</label>
                
                {/* Searchable Dropdown Input */}
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                    <Search size={18} />
                  </div>
                  <input 
                    type="text"
                    placeholder="Search client by name or ID..."
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-slate-500 outline-none"
                    value={clientSearchTerm}
                    onChange={(e) => {
                      setClientSearchTerm(e.target.value);
                      setShowClientDropdown(true);
                      setSelectedClientId(''); // Clear selection if typing
                    }}
                    onFocus={() => setShowClientDropdown(true)}
                  />
                  {/* Dropdown List */}
                  {showClientDropdown && (
                    <div className="absolute w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto z-10">
                      {filteredClients.length > 0 ? (
                        filteredClients.map(c => (
                          <div 
                            key={c.id}
                            className="px-4 py-3 hover:bg-slate-50 cursor-pointer border-b border-gray-50 last:border-0"
                            onClick={() => {
                              setSelectedClientId(c.id);
                              setClientSearchTerm(c.name);
                              setShowClientDropdown(false);
                            }}
                          >
                            <div className="font-medium text-gray-900">{c.name}</div>
                            <div className="text-xs text-gray-500">ID: {c.id} • {c.location}</div>
                          </div>
                        ))
                      ) : (
                        <div className="px-4 py-3 text-sm text-gray-500">No clients found.</div>
                      )}
                    </div>
                  )}
                </div>
                {selectedClientId && (
                  <div className="mt-2 text-xs text-green-600 font-medium flex items-center gap-1">
                    <CheckCircle2 size={12} /> Client Selected: {clients.find(c => c.id === selectedClientId)?.name}
                  </div>
                )}
             </div>
             <div className="flex justify-end">
               <button 
                disabled={!selectedClientId}
                onClick={() => setStep(2)}
                className="px-6 py-2 bg-slate-900 text-white rounded-lg disabled:opacity-50 hover:bg-slate-800 transition-colors"
               >
                 Continue
               </button>
             </div>
           </div>
        ) : (
          <div className="space-y-6">
            {/* Autofill Section */}
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-6 text-center">
               <div className="flex flex-col items-center gap-3">
                 <div className="bg-white p-3 rounded-full shadow-sm text-blue-600">
                   <FileText size={24} />
                 </div>
                 <div>
                   <h3 className="font-semibold text-blue-900">Autofill with Lease Document</h3>
                   <p className="text-sm text-blue-700 mt-1 max-w-xs mx-auto">Upload a PDF lease agreement to automatically extract details.</p>
                 </div>
                 <div className="relative mt-2">
                    <input 
                      type="file" 
                      accept=".pdf" 
                      onChange={handleFileUpload}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <button className="bg-white text-blue-600 px-4 py-2 rounded-lg border border-blue-200 text-sm font-medium hover:bg-blue-50 transition-colors shadow-sm">
                      {isProcessingFile ? 'Scanning Document...' : 'Select PDF File'}
                    </button>
                 </div>
               </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Property Address</label>
                <input 
                  required
                  value={formData.address}
                  onChange={e => setFormData({...formData, address: e.target.value})}
                  type="text" 
                  className="w-full p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-slate-500 outline-none"
                  placeholder="e.g., 221B Baker Street"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Type</label>
                  <select 
                    value={formData.type}
                    onChange={e => setFormData({...formData, type: e.target.value})}
                    className="w-full p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-slate-500 outline-none bg-white"
                  >
                    <option>Residential</option>
                    <option>Commercial</option>
                    <option>Industrial</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Monthly Rent (£)</label>
                  <input 
                    required
                    value={formData.rent}
                    onChange={e => setFormData({...formData, rent: e.target.value})}
                    type="number" 
                    className="w-full p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-slate-500 outline-none"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Tenant Name</label>
                <input 
                  required
                  value={formData.tenant}
                  onChange={e => setFormData({...formData, tenant: e.target.value})}
                  type="text" 
                  className="w-full p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-slate-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                 <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Lease Start</label>
                  <input 
                    required
                    value={formData.leaseStart}
                    onChange={e => setFormData({...formData, leaseStart: e.target.value})}
                    type="date" 
                    className="w-full p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-slate-500 outline-none"
                  />
                 </div>
                 <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Lease End</label>
                  <input 
                    required
                    value={formData.leaseEnd}
                    onChange={e => setFormData({...formData, leaseEnd: e.target.value})}
                    type="date" 
                    className="w-full p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-slate-500 outline-none"
                  />
                 </div>
              </div>

              <div className="pt-4 border-t border-gray-100 flex justify-between gap-3">
                 <button 
                   type="button" 
                   onClick={() => setStep(1)}
                   className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
                 >
                   Back
                 </button>
                 <button 
                   type="submit" 
                   className="px-6 py-2 text-sm font-medium text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors shadow-sm"
                 >
                   Save Property
                 </button>
              </div>
            </form>
          </div>
        )}
      </Card>
    </div>
  );
};

// --- Main App Component ---

export default function App() {
  const [view, setView] = useState('dashboard'); // dashboard, client-details, property-details, add-client, add-property
  const [clients, setClients] = useState(INITIAL_CLIENTS);
  const [properties, setProperties] = useState(INITIAL_PROPERTIES);
  const [selectedClient, setSelectedClient] = useState(null);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [payments, setPayments] = useState(MOCK_PAYMENTS);

  // Close menu when view changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [view]);

  // --- Derived State ---
  const filteredClients = useMemo(() => {
    // Search Throttling: Only search if length >= 3 or empty
    if (searchTerm.length > 0 && searchTerm.length < 3) {
      return clients; // Return all if under 3 chars (or return empty if you prefer strict throttling)
    }

    return clients.filter(client => {
      const matchesSearch = client.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            client.location.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = filterStatus === 'All' || client.status === filterStatus;
      return matchesSearch && matchesFilter;
    });
  }, [clients, searchTerm, filterStatus]);

  const stats = useMemo(() => {
    const totalProperties = properties.length;
    const totalClients = clients.length;
    const actionsNeeded = properties.filter(p => ['Overdue', 'Unpaid', 'Vacant'].includes(p.rentStatus)).length;
    return { totalProperties, totalClients, actionsNeeded };
  }, [clients, properties]);

  // --- Actions ---
  
  const handleClientClick = (client) => {
    setSelectedClient(client);
    setView('client-details');
    setSearchTerm('');
  };

  const handlePropertyClick = (property) => {
    setSelectedProperty(property);
    setView('property-details');
  };

  const handleAddClient = (newClient) => {
    setClients([...clients, { ...newClient, id: generateId('CL-'), status: 'Good', joined: new Date().toISOString().split('T')[0] }]);
    setView('dashboard');
  };

  const handleAddProperty = (newProperty) => {
    setProperties([...properties, { ...newProperty, id: generateId('PR-'), tenantId: 'T-' + Math.floor(Math.random() * 1000), rentStatus: 'Paid' }]);
    setView('dashboard');
  };

  // --- Layout Render ---

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-gray-900">
      {/* Top Navigation */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => { setView('dashboard'); setSelectedClient(null); }}>
              <div className="bg-slate-900 text-white p-1.5 rounded-lg">
                <PieChart size={20} />
              </div>
              <span className="font-bold text-xl tracking-tight">Property Manager</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-2 text-sm text-gray-500">
                <span className="w-2 h-2 rounded-full bg-green-500"></span>
                System Operational
              </div>
              <button className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100">
                <Mail size={20} />
              </button>
              <div className="h-8 w-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-semibold text-xs border border-slate-300">
                JD
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {view === 'dashboard' && (
          <DashboardView 
            stats={stats}
            filteredClients={filteredClients}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            filterStatus={filterStatus}
            setFilterStatus={setFilterStatus}
            isMenuOpen={isMenuOpen}
            setIsMenuOpen={setIsMenuOpen}
            setView={setView}
            handleClientClick={handleClientClick}
            properties={properties}
          />
        )}
        {view === 'client-details' && selectedClient && (
          <ClientDetailsView 
            client={selectedClient}
            properties={properties}
            setView={setView}
            setSelectedClient={setSelectedClient}
            handlePropertyClick={handlePropertyClick}
          />
        )}
        {view === 'property-details' && selectedProperty && (
          <PropertyDetailsView 
            property={selectedProperty}
            client={clients.find(c => c.id === selectedProperty.clientId)}
            setView={setView}
            payments={payments}
            setPayments={setPayments}
          />
        )}
        {view === 'add-client' && (
          <AddClientView 
            setView={setView}
            handleAddClient={handleAddClient}
          />
        )}
        {view === 'add-property' && (
          <AddPropertyView 
            setView={setView}
            clients={clients}
            handleAddProperty={handleAddProperty}
          />
        )}
      </main>
    </div>
  );
}