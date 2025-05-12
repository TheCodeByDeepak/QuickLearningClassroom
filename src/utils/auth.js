export const isAuthenticated = () => {
    // For now, we’ll just use a dummy check. This will later be replaced with a backend check.
    return localStorage.getItem('auth') === 'true';
  };
  
  export const login = () => {
    // Simulate logging in by setting auth to true in localStorage
    localStorage.setItem('auth', 'true');
  };
  
  export const logout = () => {
    // Log out by removing the auth token
    localStorage.removeItem('auth');
  };
  