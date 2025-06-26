// src/app/api/nutrition/route.js
import { NextResponse } from 'next/server';
import nutritionModel from '@/models/nutrition-model';
import { userDataCache } from '@/utils/api-cache';
import { getCurrentUserId } from '@/utils/auth-utils';

// Get nutrition goals and macro ratios for the authenticated user
export async function GET(request) {
  try {
    // Get user ID from session token
    const userId = await getCurrentUserId();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Check if we want goals or macros
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'all';
    
    // Get from cache first
    const cacheKey = `nutrition-${userId}-${type}`;
    const cachedData = userDataCache.get(cacheKey);
    
    if (cachedData) {
      return NextResponse.json(cachedData);
    }
    
    // Get from database
    let data;
    if (type === 'goals') {
      data = await nutritionModel.getGoals(userId);
    } else if (type === 'macros') {
      data = await nutritionModel.getMacroRatios(userId);
    } else {
      // Get both
      const goals = await nutritionModel.getGoals(userId);
      const macros = await nutritionModel.getMacroRatios(userId);
      data = { goals, macros };
    }
    
    // Cache the result
    userDataCache.set(cacheKey, data);
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in nutrition API route:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Update nutrition goals for the authenticated user
export async function PUT(request) {
  try {
    // Get user ID from session token
    const userId = await getCurrentUserId();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Parse the request body
    const body = await request.json();
    const { type, data } = body;
    
    if (!type || !data) {
      return NextResponse.json({ error: 'Type and data are required' }, { status: 400 });
    }
    
    let result;
    if (type === 'goals') {
      // Validate goals data
      if (typeof data.calories !== 'number' || data.calories < 0) {
        return NextResponse.json({ error: 'Invalid calories value' }, { status: 400 });
      }
      
      // Update goals in database
      result = await nutritionModel.updateGoals(userId, data);
      
      // Clear cache
      userDataCache.delete(`nutrition-${userId}-goals`);
      userDataCache.delete(`nutrition-${userId}-all`);
    } else if (type === 'macros') {
      // Validate macros data
      if (typeof data.carbs !== 'number' || typeof data.protein !== 'number' || typeof data.fat !== 'number') {
        return NextResponse.json({ error: 'Invalid macro values' }, { status: 400 });
      }
      
      // Check that macros add up to 100%
      const total = data.carbs + data.protein + data.fat;
      if (Math.abs(total - 100) > 0.1) { // Allow small rounding errors
        return NextResponse.json({ error: 'Macro percentages must add up to 100%' }, { status: 400 });
      }
      
      // Update macros in database
      result = await nutritionModel.updateMacroRatios(userId, data);
      
      // Clear cache
      userDataCache.delete(`nutrition-${userId}-macros`);
      userDataCache.delete(`nutrition-${userId}-all`);
    } else {
      return NextResponse.json({ error: 'Invalid type. Must be "goals" or "macros"' }, { status: 400 });
    }
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error in nutrition API route:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}