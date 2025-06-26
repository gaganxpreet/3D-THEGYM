// src/models/nutrition-model.js
import fs from 'fs';
import path from 'path';

// In a real application, this would be replaced with a database connection
class NutritionModel {
  constructor() {
    // Create data directory if it doesn't exist
    this.dataDir = path.join(process.cwd(), 'data');
    this.goalsFile = path.join(this.dataDir, 'nutrition-goals.json');
    
    try {
      if (!fs.existsSync(this.dataDir)) {
        fs.mkdirSync(this.dataDir, { recursive: true });
      }
      
      if (!fs.existsSync(this.goalsFile)) {
        fs.writeFileSync(this.goalsFile, JSON.stringify({}));
      }
    } catch (error) {
      console.error('Error initializing nutrition model:', error);
    }
  }

  // Get nutrition goals for a user
  async getGoals(userId) {
    try {
      const data = await this._readData();
      
      // Return default goals if user doesn't have any saved
      if (!data[userId]) {
        return {
          calories: 2000,
          protein: 150,
          carbs: 200,
          fat: 65,
          macroRatios: {
            protein: 30,
            carbs: 40,
            fat: 30
          }
        };
      }
      
      return data[userId];
    } catch (error) {
      console.error('Error getting nutrition goals:', error);
      throw new Error('Failed to get nutrition goals');
    }
  }

  // Update nutrition goals for a user
  async updateGoals(userId, goals) {
    try {
      const data = await this._readData();
      
      // Merge with existing goals or create new entry
      data[userId] = {
        ...data[userId] || {},
        ...goals,
        updatedAt: new Date().toISOString()
      };
      
      await this._writeData(data);
      
      return data[userId];
    } catch (error) {
      console.error('Error updating nutrition goals:', error);
      throw new Error('Failed to update nutrition goals');
    }
  }

  // Update macro ratios for a user
  async updateMacroRatios(userId, macroRatios) {
    try {
      const data = await this._readData();
      
      // Ensure user exists in data
      if (!data[userId]) {
        data[userId] = {
          calories: 2000,
          protein: 150,
          carbs: 200,
          fat: 65,
          macroRatios: {
            protein: 30,
            carbs: 40,
            fat: 30
          }
        };
      }
      
      // Update macro ratios
      data[userId].macroRatios = {
        ...data[userId].macroRatios || {},
        ...macroRatios
      };
      
      data[userId].updatedAt = new Date().toISOString();
      
      await this._writeData(data);
      
      return data[userId];
    } catch (error) {
      console.error('Error updating macro ratios:', error);
      throw new Error('Failed to update macro ratios');
    }
  }

  // Private method to read data from file
  async _readData() {
    try {
      const data = fs.readFileSync(this.goalsFile, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      console.error('Error reading nutrition data:', error);
      return {};
    }
  }

  // Private method to write data to file
  async _writeData(data) {
    try {
      fs.writeFileSync(this.goalsFile, JSON.stringify(data, null, 2));
    } catch (error) {
      console.error('Error writing nutrition data:', error);
      throw new Error('Failed to write nutrition data');
    }
  }
}

// Create a singleton instance
const nutritionModel = new NutritionModel();

export default nutritionModel;