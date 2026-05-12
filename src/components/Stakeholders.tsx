import React, { useState } from 'react';
import { Plus, Search, Mail, Phone, MoreVertical, Trash2, Edit2, X } from 'lucide-react';
import { useData } from '../contexts/DataContext';

export function Stakeholders() {
  const { stakeholders, setStakeholders } = useData();
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newStakeholder, setNewStakeholder] = useState({ name: '', role: '', organization: '', email: '', phone: '', status: 'Active' as 'Active' | 'Inactive' });

  const handleAddStakeholder = (e: React.FormEvent) => {
    e.preventDefault();
    const id = Math.max(...stakeholders.map(s => s.id), 0) + 1;
    setStakeholders([...stakeholders, { ...newStakeholder, id }]);
    setIsAddModalOpen(false);
    setNewStakeholder({ name: '', role: '', organization: '', email: '', phone: '', status: 'Active' });
  };

  const filteredStakeholders = stakeholders.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.organization.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = (id: number) => {
    setStakeholders(stakeholders.filter(s => s.id !== id));
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-slate-800">Stakeholder Management</h1>
          <p className="text-sm md:text-base text-slate-500 mt-1">Manage emergency contacts and alert recipients.</p>
        </div>
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="w-full md:w-auto bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors flex items-center justify-center gap-2 font-medium"
        >
          <Plus size={18} />
          Add Stakeholder
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input 
              type="text" 
              placeholder="Search stakeholders..." 
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
              <tr>
                <th className="px-4 md:px-6 py-4">Name</th>
                <th className="px-4 md:px-6 py-4">Role & Organization</th>
                <th className="px-4 md:px-6 py-4">Contact Info</th>
                <th className="px-4 md:px-6 py-4">Status</th>
                <th className="px-4 md:px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStakeholders.map((stakeholder) => (
                <tr key={stakeholder.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 md:px-6 py-4">
                    <div className="font-medium text-slate-900">{stakeholder.name}</div>
                  </td>
                  <td className="px-4 md:px-6 py-4">
                    <div className="text-slate-900">{stakeholder.role}</div>
                    <div className="text-slate-500 text-xs">{stakeholder.organization}</div>
                  </td>
                  <td className="px-4 md:px-6 py-4">
                    <div className="flex items-center gap-2 text-slate-600 mb-1">
                      <Mail size={14} className="shrink-0" /> <span className="truncate max-w-[120px] md:max-w-none">{stakeholder.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-600">
                      <Phone size={14} className="shrink-0" /> <span className="whitespace-nowrap">{stakeholder.phone}</span>
                    </div>
                  </td>
                  <td className="px-4 md:px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      stakeholder.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-slate-100 text-slate-800'
                    }`}>
                      {stakeholder.status}
                    </span>
                  </td>
                  <td className="px-4 md:px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1 md:gap-2">
                      <button className="p-1.5 md:p-2 text-slate-400 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-colors">
                        <Edit2 size={16} />
                      </button>
                      <button 
                        onClick={() => handleDelete(stakeholder.id)}
                        className="p-1.5 md:p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredStakeholders.length === 0 && (
          <div className="p-12 text-center text-slate-500">
            No stakeholders found matching your search.
          </div>
        )}
      </div>

      {/* Add Stakeholder Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
              <h3 className="font-bold text-slate-800">Add New Stakeholder</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleAddStakeholder} className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Name</label>
                <input required type="text" value={newStakeholder.name} onChange={e => setNewStakeholder({...newStakeholder, name: e.target.value})} className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-teal-500 outline-none" placeholder="Jane Doe" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Role</label>
                  <input required type="text" value={newStakeholder.role} onChange={e => setNewStakeholder({...newStakeholder, role: e.target.value})} className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-teal-500 outline-none" placeholder="Coordinator" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Organization</label>
                  <input required type="text" value={newStakeholder.organization} onChange={e => setNewStakeholder({...newStakeholder, organization: e.target.value})} className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-teal-500 outline-none" placeholder="Red Cross" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                  <input required type="email" value={newStakeholder.email} onChange={e => setNewStakeholder({...newStakeholder, email: e.target.value})} className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-teal-500 outline-none" placeholder="jane@example.com" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Phone</label>
                  <input required type="tel" value={newStakeholder.phone} onChange={e => setNewStakeholder({...newStakeholder, phone: e.target.value})} className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-teal-500 outline-none" placeholder="+91 98765 43210" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
                <select value={newStakeholder.status} onChange={e => setNewStakeholder({...newStakeholder, status: e.target.value as 'Active' | 'Inactive'})} className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-teal-500 outline-none">
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button type="button" onClick={() => setIsAddModalOpen(false)} className="px-4 py-2 text-slate-600 font-medium hover:bg-slate-100 rounded-lg transition-colors">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-teal-600 text-white font-medium hover:bg-teal-700 rounded-lg transition-colors">Add Stakeholder</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
