// Utility function to decode JWT token and get user info
const decodeToken = (token) => {
  if (!token) return null;
  
  try {
    const payload = token.split('.')[1];
    const decodedPayload = atob(payload);
    return JSON.parse(decodedPayload);
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
};

// Utility function to get user ID from token
const getUserId = (token) => {
  const decoded = decodeToken(token);
  return decoded?.userId || decoded?.sub || null;
};

// Utility function to get username from token
const getUsername = (token) => {
  const decoded = decodeToken(token);
  return decoded?.username || decoded?.sub || null;
};

// Utility function to get user roles from token
const getUserRoles = (token) => {
  const decoded = decodeToken(token);
  return decoded?.roles || [];
};

// Utility function to check if user is admin
const isAdmin = (token) => {
  const roles = getUserRoles(token);
  return roles.includes('ROLE_ADMIN');
};

// Utility function to check if user is logged in
const isLoggedIn = (token) => {
  return !!token && token.trim() !== '';
};

export { decodeToken, getUserId, getUsername, getUserRoles, isAdmin, isLoggedIn };