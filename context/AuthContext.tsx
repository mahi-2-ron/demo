import React, { createContext, useContext, useState, useEffect } from 'react';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'donor' | 'admin';
  avatar?: string;
  bloodGroup?: string;
  location?: string;
  phone?: string;
  lastDonation?: string;
  isEligible?: boolean;
  coordinates?: [number, number];
  donations?: number;
}

export interface AppNotification {
    id: string;
    type: 'email' | 'alert';
    title: string;
    message: string;
    timestamp: string;
    read: boolean;
    sender?: string;
}

export interface EmailNotification {
  id: string;
  sender: string;
  subject: string;
  preview: string;
  timestamp: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (data: any) => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  loading: boolean;
  emailNotification: EmailNotification | null;
  closeEmail: () => void;
  notifications: AppNotification[];
  markNotificationsAsRead: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [emailNotification, setEmailNotification] = useState<EmailNotification | null>(null);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);

  // Load user from local storage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('rakhtsetu_current_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Failed to parse user data", error);
        localStorage.removeItem('rakhtsetu_current_user');
      }
    }
    
    // Load notifications if any (mock persistence)
    const storedNotifs = localStorage.getItem('rakhtsetu_notifications');
    if (storedNotifs) {
        setNotifications(JSON.parse(storedNotifs));
    }
    
    setLoading(false);
  }, []);

  // Save notifications to local storage whenever they change
  useEffect(() => {
      localStorage.setItem('rakhtsetu_notifications', JSON.stringify(notifications));
  }, [notifications]);

  const sendMockEmail = (sender: string, subject: string, preview: string) => {
    // Simulate a short network delay for realism
    setTimeout(() => {
        const newNotification: AppNotification = {
            id: Date.now().toString(),
            type: 'email',
            title: subject,
            message: preview,
            sender: sender,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            read: false
        };

        // Add to persistent list
        setNotifications(prev => [newNotification, ...prev]);

        // Trigger Toast
        setEmailNotification({
            id: newNotification.id,
            sender,
            subject,
            preview,
            timestamp: 'Just now'
        });
        
        // Auto-dismiss toast after 8 seconds
        setTimeout(() => {
            setEmailNotification(prev => prev && prev.id === newNotification.id ? null : prev);
        }, 8000);
    }, 1500);
  };

  const closeEmail = () => setEmailNotification(null);

  const markNotificationsAsRead = () => {
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const login = async (email: string, password: string) => {
     return new Promise<boolean>((resolve, reject) => {
         setTimeout(() => {
             // 1. Check for Hardcoded Admin
             if (email === 'admin@rakhtsetu.com' && password === 'admin') {
                 const adminUser: User = {
                     id: 'admin_1',
                     name: 'System Admin',
                     email: 'admin@rakhtsetu.com',
                     role: 'admin',
                     avatar: 'https://ui-avatars.com/api/?name=Admin&background=dc2626&color=fff',
                     location: 'Central HQ'
                 };
                 setUser(adminUser);
                 localStorage.setItem('rakhtsetu_current_user', JSON.stringify(adminUser));
                 resolve(true);
                 return;
             }

             // 2. Check Local Storage "Database"
             const users = JSON.parse(localStorage.getItem('rakhtsetu_users') || '[]');
             const foundUser = users.find((u: any) => u.email.toLowerCase() === email.toLowerCase() && u.password === password);

             if (foundUser) {
                 // Remove password from session state
                 const { password, ...safeUser } = foundUser;
                 setUser(safeUser as User);
                 localStorage.setItem('rakhtsetu_current_user', JSON.stringify(safeUser));
                 resolve(true);
             } else {
                 reject(new Error('Invalid email or password'));
             }
         }, 800);
     });
  };

  const register = async (userData: any) => {
      return new Promise<void>((resolve, reject) => {
          setTimeout(() => {
              const users = JSON.parse(localStorage.getItem('rakhtsetu_users') || '[]');
              
              if (users.find((u: any) => u.email.toLowerCase() === userData.email.toLowerCase())) {
                  reject(new Error('User with this email already exists'));
                  return;
              }

              const newUser = {
                  id: `user_${Date.now()}`,
                  name: userData.fullName,
                  email: userData.email,
                  password: userData.password, 
                  role: 'donor',
                  bloodGroup: userData.bloodGroup,
                  location: userData.location,
                  phone: userData.phone,
                  avatar: userData.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.fullName)}&background=random&color=fff`,
                  lastDonation: userData.lastDonation || 'Never',
                  isEligible: userData.isEligible,
                  coordinates: userData.coordinates || null, // [lat, lng]
                  donations: 0
              };

              // Save to "DB"
              users.push(newUser);
              localStorage.setItem('rakhtsetu_users', JSON.stringify(users));

              // Auto Login
              const { password, ...safeUser } = newUser;
              setUser(safeUser as User);
              localStorage.setItem('rakhtsetu_current_user', JSON.stringify(safeUser));

              // Trigger Simulated Email
              sendMockEmail(
                  "RakhtSetu Team", 
                  "Welcome to RakhtSetu!", 
                  `Hi ${userData.fullName}, thank you for joining our community of lifesavers. Your account is now active and you can start donating.`
              );

              resolve();
          }, 1000);
      });
  };

  const updateProfile = async (data: Partial<User>) => {
     return new Promise<void>((resolve) => {
         setTimeout(() => {
             if (user) {
                 const updatedUser = { ...user, ...data };
                 setUser(updatedUser);
                 localStorage.setItem('rakhtsetu_current_user', JSON.stringify(updatedUser));
                 
                 // Update in users list too (simulate DB update)
                 const users = JSON.parse(localStorage.getItem('rakhtsetu_users') || '[]');
                 const updatedUsers = users.map((u: any) => u.email === user.email ? { ...u, ...data } : u);
                 localStorage.setItem('rakhtsetu_users', JSON.stringify(updatedUsers));
             }
             resolve();
         }, 500);
     });
  };

  const forgotPassword = async (email: string) => {
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        // Trigger Simulated Email
        sendMockEmail(
            "RakhtSetu Security", 
            "Reset Your Password", 
            "We received a request to reset your password. If this was you, please use the verification code: 849201 to proceed."
        );
        resolve();
      }, 1000);
    });
  };

  const logout = () => {
      setUser(null);
      setNotifications([]);
      localStorage.removeItem('rakhtsetu_current_user');
  };

  return (
    <AuthContext.Provider value={{ 
        user, 
        login, 
        register, 
        updateProfile, 
        forgotPassword, 
        logout, 
        isAuthenticated: !!user, 
        loading, 
        emailNotification, 
        closeEmail,
        notifications,
        markNotificationsAsRead
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};