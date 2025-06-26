// src/models/meal-model.js
import fs from 'fs';
import path from 'path';

// In a real application, this would be replaced with a database connection
class MealModel {
  constructor() {
    // Create data directory if it doesn't exist
    this.dataDir = path.join(process.cwd(), 'data');
    this.mealsFile = path.join(this.dataDir, 'meals.json');
    
    try {
      if (!fs.existsSync(this.dataDir)) {
        fs.mkdirSync(this.dataDir, { recursive: true });
      }
      
      if (!fs.existsSync(this.mealsFile)) {
        fs.writeFileSync(this.mealsFile, JSON.stringify({}));
      }
    } catch (error) {
      console.error('Error initializing meal model:', error);
    }
  }

  // Get all meals for a user
  async getMeals(userId) {
    try {
      const data = await this._readData();
      return data[userId] || [];
    } catch (error) {
      console.error('Error getting meals:', error);
      throw new Error('Failed to get meals');
    }
  }

  // Get meals for a specific date
  async getMealsByDate(userId, date) {
    try {
      const meals = await this.getMeals(userId);
      return meals.filter(meal => meal.date === date);
    } catch (error) {
      console.error('Error getting meals by date:', error);
      throw new Error('Failed to get meals by date');
    }
  }

  // Add a new meal
  async addMeal(userId, meal) {
    try {
      const data = await this._readData();
      
      if (!data[userId]) {
        data[userId] = [];
      }
      
      // Add ID and timestamp if not provided
      const newMeal = {
        ...meal,
        id: meal.id || Date.now(),
        createdAt: meal.createdAt || new Date().toISOString()
      };
      
      data[userId].push(newMeal);
      await this._writeData(data);
      
      return newMeal;
    } catch (error) {
      console.error('Error adding meal:', error);
      throw new Error('Failed to add meal');
    }
  }

  // Update a meal
  async updateMeal(userId, mealId, updatedMeal) {
    try {
      const data = await this._readData();
      
      if (!data[userId]) {
        throw new Error('User not found');
      }
      
      const mealIndex = data[userId].findIndex(meal => meal.id === mealId);
      
      if (mealIndex === -1) {
        throw new Error('Meal not found');
      }
      
      // Update the meal
      data[userId][mealIndex] = {
        ...data[userId][mealIndex],
        ...updatedMeal,
        id: mealId, // Ensure ID doesn't change
        updatedAt: new Date().toISOString()
      };
      
      await this._writeData(data);
      
      return data[userId][mealIndex];
    } catch (error) {
      console.error('Error updating meal:', error);
      throw new Error('Failed to update meal');
    }
  }

  // Delete a meal
  async deleteMeal(userId, mealId) {
    try {
      const data = await this._readData();
      
      if (!data[userId]) {
        throw new Error('User not found');
      }
      
      const mealIndex = data[userId].findIndex(meal => meal.id === mealId);
      
      if (mealIndex === -1) {
        throw new Error('Meal not found');
      }
      
      // Remove the meal
      data[userId].splice(mealIndex, 1);
      
      await this._writeData(data);
      
      return { success: true };
    } catch (error) {
      console.error('Error deleting meal:', error);
      throw new Error('Failed to delete meal');
    }
  }

  // Private method to read data from file
  async _readData() {
    try {
      const data = fs.readFileSync(this.mealsFile, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      console.error('Error reading meals data:', error);
      return {};
    }
  }

  // Private method to write data to file
  async _writeData(data) {
    try {
      fs.writeFileSync(this.mealsFile, JSON.stringify(data, null, 2));
    } catch (error) {
      console.error('Error writing meals data:', error);
      throw new Error('Failed to write meals data');
    }
  }
}

// Create a singleton instance
const mealModel = new MealModel();

export default mealModel;