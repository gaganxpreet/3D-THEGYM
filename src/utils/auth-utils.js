// src/utils/auth-utils.js
import { cookies } from 'next/headers';
import userModel from '@/models/user-model';

/**
 * Get the current user ID from the session token in cookies
 * @returns {Promise<string|null>} The user ID or null if not authenticated
 */
export async function getCurrentUserId() {
  const sessionToken = cookies().get('session_token')?.value;
  
  if (!sessionToken) {
    return null;
  }
  
  // In a real application, you would verify the session token against a database
  // For now, we'll just use the session token as the user ID
  return sessionToken;
}

/**
 * Get the current user from the session token in cookies
 * @returns {Promise<Object|null>} The user object or null if not authenticated
 */
export async function getCurrentUser() {
  const userId = await getCurrentUserId();
  
  if (!userId) {
    return null;
  }
  
  try {
    const user = await userModel.getUser(userId);
    
    if (!user) {
      return null;
    }
    
    // Remove sensitive information
    const { password, ...profile } = user;
    
    return profile;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
}

/**
 * Check if the current user is authenticated
 * @returns {Promise<boolean>} True if authenticated, false otherwise
 */
export async function isAuthenticated() {
  const userId = await getCurrentUserId();
  return userId !== null;
}

/**
 * Require authentication for an API route
 * @param {Function} handler The API route handler
 * @returns {Function} A new handler that checks for authentication
 */
export function requireAuth(handler) {
  return async (request, context) => {
    const userId = await getCurrentUserId();
    
    if (!userId) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Add the user ID to the request object
    request.userId = userId;
    
    return handler(request, context);
  };
}