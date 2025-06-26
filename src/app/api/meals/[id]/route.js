// src/app/api/meals/[id]/route.js
import { NextResponse } from 'next/server';
import mealModel from '@/models/meal-model';
import { userDataCache } from '@/utils/api-cache';
import { getCurrentUserId } from '@/utils/auth-utils';

// Get a specific meal by ID
export async function GET(request, { params }) {
  try {
    const { id } = params;
    
    // Get user ID from session token
    const userId = await getCurrentUserId();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Get all meals for the user
    const meals = await mealModel.getMeals(userId);
    
    // Find the specific meal
    const meal = meals.find(m => m.id.toString() === id.toString());
    
    if (!meal) {
      return NextResponse.json({ error: 'Meal not found' }, { status: 404 });
    }
    
    return NextResponse.json(meal);
  } catch (error) {
    console.error('Error in meal API route:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Update a specific meal by ID
export async function PUT(request, { params }) {
  try {
    const { id } = params;
    
    // Get user ID from session token
    const userId = await getCurrentUserId();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Parse the request body
    const updates = await request.json();
    
    // Update meal in database
    try {
      const updatedMeal = await mealModel.updateMeal(userId, parseInt(id), updates);
      
      // Clear cache for this user's meals
      userDataCache.delete(`meals-${userId}`);
      if (updatedMeal.date) {
        userDataCache.delete(`meals-${userId}-${updatedMeal.date}`);
      }
      
      return NextResponse.json(updatedMeal);
    } catch (error) {
      if (error.message === 'Meal not found' || error.message === 'User not found') {
        return NextResponse.json({ error: error.message }, { status: 404 });
      }
      throw error;
    }
  } catch (error) {
    console.error('Error in meal API route:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Delete a specific meal by ID
export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    
    // Get user ID from session token
    const userId = await getCurrentUserId();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Get the meal first to know its date (for cache invalidation)
    const meals = await mealModel.getMeals(userId);
    const mealToDelete = meals.find(m => m.id.toString() === id.toString());
    
    // Delete meal from database
    try {
      await mealModel.deleteMeal(userId, parseInt(id));
      
      // Clear cache for this user's meals
      userDataCache.delete(`meals-${userId}`);
      if (mealToDelete?.date) {
        userDataCache.delete(`meals-${userId}-${mealToDelete.date}`);
      }
      
      return NextResponse.json({ success: true });
    } catch (error) {
      if (error.message === 'Meal not found' || error.message === 'User not found') {
        return NextResponse.json({ error: error.message }, { status: 404 });
      }
      throw error;
    }
  } catch (error) {
    console.error('Error in meal API route:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}