// src/app/api/user/change-password/route.js
import { NextResponse } from 'next/server';
import userModel from '@/models/user-model';
import { getCurrentUserId } from '@/utils/auth-utils';
import { userDataCache } from '@/utils/api-cache';

// Change the authenticated user's password
export async function POST(request) {
  try {
    // Get user ID from session token
    const userId = await getCurrentUserId();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Parse the request body
    const { currentPassword, newPassword } = await request.json();
    
    if (!currentPassword || !newPassword) {
      return NextResponse.json({ 
        error: 'Current password and new password are required' 
      }, { status: 400 });
    }
    
    // Validate new password
    if (newPassword.length < 8) {
      return NextResponse.json({ 
        error: 'New password must be at least 8 characters long' 
      }, { status: 400 });
    }
    
    try {
      // Verify current password
      const user = await userModel.getUser(userId);
      
      if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }
      
      // Verify the current password
      const isValid = await userModel.verifyPassword(user, currentPassword);
      
      if (!isValid) {
        return NextResponse.json({ error: 'Current password is incorrect' }, { status: 401 });
      }
      
      // Update the password
      await userModel.updatePassword(userId, newPassword);
      
      // Clear user cache
      userDataCache.delete(`user-profile-${userId}`);
      
      return NextResponse.json({ message: 'Password updated successfully' });
    } catch (error) {
      if (error.message === 'User not found') {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }
      throw error;
    }
  } catch (error) {
    console.error('Error in change password API route:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ message: 'This endpoint only accepts POST requests' }, { status: 405 });
}