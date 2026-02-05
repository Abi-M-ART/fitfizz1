
import { User as UserType } from '../types';

const USERS_KEY = 'fitfizz_users_table';
const SESSION_KEY = 'fitfizz_session_active';

export const authService = {
  // Register a new user with a unique ID
  register: (username: string, password: string): { success: boolean; message: string } => {
    const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
    if (users.find((u: any) => u.username === username)) {
      return { success: false, message: 'Username already exists' };
    }
    
    const newUser = { 
      id: crypto.randomUUID(), // Generate a proper unique ID
      username, 
      password,
      createdAt: new Date().toISOString()
    };
    
    users.push(newUser);
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    return { success: true, message: 'Registration successful' };
  },

  // Login a user and establish a linked session
  login: (username: string, password: string): { success: boolean; user?: UserType; message: string } => {
    const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
    const user = users.find((u: any) => u.username === username && u.password === password);
    
    if (user) {
      const sessionUser: UserType = { 
        id: user.id, 
        username: user.username, 
        isLoggedIn: true 
      };
      localStorage.setItem(SESSION_KEY, JSON.stringify(sessionUser));
      return { success: true, user: sessionUser, message: 'Login successful' };
    }
    
    return { success: false, message: 'Invalid username or password' };
  },

  // Logout a user
  logout: () => {
    localStorage.removeItem(SESSION_KEY);
  },

  // Check current session
  getCurrentUser: (): UserType | null => {
    const session = localStorage.getItem(SESSION_KEY);
    return session ? JSON.parse(session) : null;
  }
};
