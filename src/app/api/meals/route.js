// src/app/api/meals/route.js
import { NextResponse } from 'next/server';
import mealModel from '@/models/meal-model';
import { userDataCache } from '@/utils/api-cache';
import { getCurrentUserId } from '@/utils/auth-utils';

// Get all meals for the authenticated user
export async function GET(request) {
  try {
    // Get user ID from session token
    const userId = await getCurrentUserId();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Check if date is provided as a query parameter
    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date');
    
    // Get meals from cache or database
    const cacheKey = date ? `meals-${userId}-${date}` : `meals-${userId}`;
    const cachedMeals = userDataCache.get(cacheKey);
    
    if (cachedMeals) {
      return NextResponse.json(cachedMeals);
    }
    
    // Get meals from database
    let meals;
    if (date) {
      meals = await mealModel.getMealsByDate(userId, date);
    } else {
      meals = await mealModel.getMeals(userId);
    }
    
    // Cache the result
    userDataCache.set(cacheKey, meals);
    
    return NextResponse.json(meals);
  } catch (error) {
    console.error('Error in meals API route:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Add a new meal for the authenticated user
export async function POST(request) {
  try {
    // Get user ID from session token
    const userId = await getCurrentUserId();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Parse the request body
    const meal = await request.json();
    
    // Validate required fields
    if (!meal.name || !meal.date || !meal.mealType) {
      return NextResponse.json({ error: 'Name, date, and meal type are required' }, { status: 400 });
    }
    
    // Add meal to database
    const newMeal = await mealModel.addMeal(userId, meal);
    
    // Clear cache for this user's meals
    userDataCache.delete(`meals-${userId}`);
    userDataCache.delete(`meals-${userId}-${meal.date}`);
    
    return NextResponse.json(newMeal);
  } catch (error) {
    console.error('Error in meals API route:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}