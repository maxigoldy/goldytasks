import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'family_member';
  isFamilyMember: boolean;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  users: User[];
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  updateUser: (id: string, updates: Partial<User>) => Promise<void>;
  deleteUser: (id: string) => Promise<void>;
  assignFamilyMembership: (userId: string) => Promise<void>;
  removeFamilyMembership: (userId: string) => Promise<void>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate checking for existing session
    const savedUser = localStorage.getItem('goldtasks_user');
    const savedUsers = localStorage.getItem('goldtasks_users');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    if (savedUsers) {
      setUsers(JSON.parse(savedUsers));
    } else {
      // Initialize with default admin user
      const defaultUsers = [
        {
          id: '1',
          email: 'admin@family.com',
          name: 'Admin',
          role: 'admin' as const,
          isFamilyMember: true,
        }
      ];
      setUsers(defaultUsers);
      localStorage.setItem('goldtasks_users', JSON.stringify(defaultUsers));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Find user in users list or create new one
    let foundUser = users.find(u => u.email === email);
    if (!foundUser) {
      foundUser = {
        id: Date.now().toString(),
        email,
        name: email.split('@')[0],
        role: 'family_member',
        isFamilyMember: false,
      };
      const updatedUsers = [...users, foundUser];
      setUsers(updatedUsers);
      localStorage.setItem('goldtasks_users', JSON.stringify(updatedUsers));
    }
    
    setUser(foundUser);
    localStorage.setItem('goldtasks_user', JSON.stringify(foundUser));
  };

  const register = async (email: string, password: string, name: string) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const mockUser: User = {
      id: Date.now().toString(),
      email,
      name,
      role: 'family_member',
      isFamilyMember: false,
    };
    
    const updatedUsers = [...users, mockUser];
    setUsers(updatedUsers);
    localStorage.setItem('goldtasks_users', JSON.stringify(updatedUsers));
    
    setUser(mockUser);
    localStorage.setItem('goldtasks_user', JSON.stringify(mockUser));
  };

  const updateUser = async (id: string, updates: Partial<User>) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const updatedUsers = users.map(u => u.id === id ? { ...u, ...updates } : u);
    setUsers(updatedUsers);
    localStorage.setItem('goldtasks_users', JSON.stringify(updatedUsers));
    
    if (user?.id === id) {
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
      localStorage.setItem('goldtasks_user', JSON.stringify(updatedUser));
    }
  };

  const deleteUser = async (id: string) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const updatedUsers = users.filter(u => u.id !== id);
    setUsers(updatedUsers);
    localStorage.setItem('goldtasks_users', JSON.stringify(updatedUsers));
  };

  const assignFamilyMembership = async (userId: string) => {
    await updateUser(userId, { isFamilyMember: true });
  };

  const removeFamilyMembership = async (userId: string) => {
    await updateUser(userId, { isFamilyMember: false });
  };

  const changePassword = async (currentPassword: string, newPassword: string) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    // In a real app, this would validate the current password and update it
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('goldtasks_user');
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      users, 
      login, 
      register, 
      updateUser, 
      deleteUser, 
      assignFamilyMembership, 
      removeFamilyMembership, 
      changePassword, 
      logout, 
      loading 
    }}>
      {children}
    </AuthContext.Provider>
  );
};