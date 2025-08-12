import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Users, 
  UserPlus, 
  Crown, 
  Shield, 
  Trash2, 
  Edit3, 
  Mail,
  MoreHorizontal,
  Check,
  X
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface UserManagementProps {
  onBack: () => void;
}

const UserManagement: React.FC<UserManagementProps> = ({ onBack }) => {
  const { users, updateUser, deleteUser, assignFamilyMembership, removeFamilyMembership } = useAuth();
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [editingUser, setEditingUser] = useState<string | null>(null);
  const [editData, setEditData] = useState({ name: '', email: '' });

  const handleEditUser = (user: any) => {
    setEditingUser(user.id);
    setEditData({ name: user.name, email: user.email });
  };

  const handleSaveEdit = async () => {
    if (!editingUser) return;
    
    try {
      await updateUser(editingUser, editData);
      setEditingUser(null);
    } catch (error) {
      console.error('Failed to update user:', error);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await deleteUser(userId);
      } catch (error) {
        console.error('Failed to delete user:', error);
      }
    }
  };

  const handleToggleFamilyMembership = async (userId: string, isFamilyMember: boolean) => {
    try {
      if (isFamilyMember) {
        await removeFamilyMembership(userId);
      } else {
        await assignFamilyMembership(userId);
      }
    } catch (error) {
      console.error('Failed to toggle family membership:', error);
    }
  };

  return (
    <div className="flex-1 overflow-auto bg-black">
      <div className="max-w-6xl mx-auto p-4 sm:p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <button
              onClick={onBack}
              className="p-2 text-gold-400 hover:text-gold-300 transition-colors mr-4"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center">
              <Users className="w-6 h-6 text-gold-500 mr-3" />
              <h1 className="text-2xl font-serif font-bold text-white">User Management</h1>
            </div>
          </div>
          
          <button className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-gold-500 to-gold-600 text-black font-semibold rounded-lg hover:from-gold-400 hover:to-gold-500 transition-all duration-200">
            <UserPlus className="w-4 h-4" />
            <span className="hidden sm:inline">Invite User</span>
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-black-800 border border-gold-600/20 rounded-lg p-4">
            <div className="flex items-center">
              <Users className="w-8 h-8 text-gold-500 mr-3" />
              <div>
                <p className="text-2xl font-bold text-white">{users.length}</p>
                <p className="text-sm text-gold-400">Total Users</p>
              </div>
            </div>
          </div>
          
          <div className="bg-black-800 border border-gold-600/20 rounded-lg p-4">
            <div className="flex items-center">
              <Crown className="w-8 h-8 text-gold-500 mr-3" />
              <div>
                <p className="text-2xl font-bold text-white">
                  {users.filter(u => u.isFamilyMember).length}
                </p>
                <p className="text-sm text-gold-400">Family Members</p>
              </div>
            </div>
          </div>
          
          <div className="bg-black-800 border border-gold-600/20 rounded-lg p-4">
            <div className="flex items-center">
              <Shield className="w-8 h-8 text-gold-500 mr-3" />
              <div>
                <p className="text-2xl font-bold text-white">
                  {users.filter(u => u.role === 'admin').length}
                </p>
                <p className="text-sm text-gold-400">Administrators</p>
              </div>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-black-800 border border-gold-600/20 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-black-700 border-b border-gold-600/20">
                <tr>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gold-400">User</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gold-400">Role</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gold-400">Status</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gold-400">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, index) => (
                  <tr 
                    key={user.id}
                    className={`border-b border-gold-600/10 hover:bg-black-700/50 transition-colors ${
                      index % 2 === 0 ? 'bg-black-800' : 'bg-black-750'
                    }`}
                  >
                    <td className="py-4 px-4">
                      {editingUser === user.id ? (
                        <div className="space-y-2">
                          <input
                            type="text"
                            value={editData.name}
                            onChange={(e) => setEditData(prev => ({ ...prev, name: e.target.value }))}
                            className="w-full px-2 py-1 bg-black-600 border border-gold-600/30 rounded text-white text-sm"
                            placeholder="Name"
                          />
                          <input
                            type="email"
                            value={editData.email}
                            onChange={(e) => setEditData(prev => ({ ...prev, email: e.target.value }))}
                            className="w-full px-2 py-1 bg-black-600 border border-gold-600/30 rounded text-white text-sm"
                            placeholder="Email"
                          />
                        </div>
                      ) : (
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-r from-gold-400 to-gold-600 rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-black text-sm font-semibold">
                              {user.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium text-white">{user.name}</p>
                            <p className="text-sm text-gold-400">{user.email}</p>
                          </div>
                        </div>
                      )}
                    </td>
                    
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-2">
                        {user.role === 'admin' ? (
                          <Shield className="w-4 h-4 text-red-400" />
                        ) : (
                          <Users className="w-4 h-4 text-blue-400" />
                        )}
                        <span className="text-sm text-white capitalize">
                          {user.role === 'admin' ? 'Administrator' : 'Family Member'}
                        </span>
                      </div>
                    </td>
                    
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleToggleFamilyMembership(user.id, user.isFamilyMember)}
                          className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${
                            user.isFamilyMember
                              ? 'bg-green-900/30 text-green-400 border border-green-500/30'
                              : 'bg-gray-900/30 text-gray-400 border border-gray-500/30'
                          }`}
                        >
                          {user.isFamilyMember ? (
                            <>
                              <Crown className="w-3 h-3 mr-1" />
                              Active
                            </>
                          ) : (
                            'Inactive'
                          )}
                        </button>
                      </div>
                    </td>
                    
                    <td className="py-4 px-4">
                      {editingUser === user.id ? (
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={handleSaveEdit}
                            className="p-1 text-green-400 hover:text-green-300 transition-colors"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setEditingUser(null)}
                            className="p-1 text-red-400 hover:text-red-300 transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleEditUser(user)}
                            className="p-1 text-gold-400 hover:text-gold-300 transition-colors"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          
                          <button
                            onClick={() => {
                              const mailto = `mailto:${user.email}?subject=Family Tasks Invitation&body=You've been invited to join our family task management system!`;
                              window.open(mailto);
                            }}
                            className="p-1 text-blue-400 hover:text-blue-300 transition-colors"
                          >
                            <Mail className="w-4 h-4" />
                          </button>
                          
                          {user.role !== 'admin' && (
                            <button
                              onClick={() => handleDeleteUser(user.id)}
                              className="p-1 text-red-400 hover:text-red-300 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                          
                          <button
                            onClick={() => setSelectedUser(selectedUser === user.id ? null : user.id)}
                            className="p-1 text-gold-400 hover:text-gold-300 transition-colors"
                          >
                            <MoreHorizontal className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;