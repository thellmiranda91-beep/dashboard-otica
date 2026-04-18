import { createContext, useContext, useState } from 'react';
import { INIT_USERS } from '../config/data.js';

const AuthCtx = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState(INIT_USERS);

  const login = (username, password) => {
    const u = users.find(u => u.username === username && u.password === password && u.active);
    if (u) { setUser(u); return { success: true }; }
    return { success: false, error: 'Usuário ou senha incorretos' };
  };

  const logout = () => setUser(null);

  const addUser = (newUser) => {
    setUsers(prev => [...prev, { ...newUser, id: Date.now(), active: true, lastLogin: '—' }]);
  };

  const toggleUser = (id) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, active: !u.active } : u));
  };

  const removeUser = (id) => {
    setUsers(prev => prev.filter(u => u.id !== id));
  };

  return (
    <AuthCtx.Provider value={{ user, users, login, logout, addUser, toggleUser, removeUser }}>
      {children}
    </AuthCtx.Provider>
  );
}

export const useAuth = () => useContext(AuthCtx);
