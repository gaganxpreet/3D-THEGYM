'use client'

import { useState, useEffect } from 'react'
import { FiSearch, FiPlus, FiTrash2, FiBarChart2, FiPieChart, FiCalendar, FiClock } from 'react-icons/fi'
import { useFoodSearch } from '@/hooks/useFoodSearch'

// Sample food database with enhanced nutrition information
const foodDatabase = [
  { 
    id: 1, 
    name: 'Apple', 
    calories: 95, 
    protein: 0.5, 
    carbs: 25, 
    fat: 0.3, 
    serving: '1 medium (182g)', 
    source: 'Local',
    // Detailed macronutrients
    fiber: 4.4,
    sugars: 19,
    saturatedFat: 0.05,
    monounsaturatedFat: 0.01,
    polyunsaturatedFat: 0.09,
    transFat: 0,
    // Vitamins
    vitaminA: 5,
    vitaminC: 8.4,
    vitaminD: 0,
    vitaminE: 0.33,
    vitaminK: 4,
    vitaminB1: 0.03,
    vitaminB2: 0.05,
    vitaminB3: 0.17,
    vitaminB5: 0.11,
    vitaminB6: 0.07,
    vitaminB9: 5,
    vitaminB12: 0,
    // Minerals
    calcium: 11,
    iron: 0.22,
    magnesium: 9,
    phosphorus: 20,
    potassium: 195,
    sodium: 2,
    zinc: 0.07,
    copper: 0.05,
    manganese: 0.07,
    selenium: 0,
    // Other components
    cholesterol: 0,
    caffeine: 0,
    alcohol: 0,
    water: 156
  },
  { 
    id: 2, 
    name: 'Banana', 
    calories: 105, 
    protein: 1.3, 
    carbs: 27, 
    fat: 0.4, 
    serving: '1 medium (118g)', 
    source: 'Local',
    // Detailed macronutrients
    fiber: 3.1,
    sugars: 14.4,
    saturatedFat: 0.1,
    monounsaturatedFat: 0.04,
    polyunsaturatedFat: 0.1,
    transFat: 0,
    // Vitamins
    vitaminA: 3,
    vitaminC: 10.3,
    vitaminD: 0,
    vitaminE: 0.1,
    vitaminK: 0.6,
    vitaminB1: 0.03,
    vitaminB2: 0.07,
    vitaminB3: 0.78,
    vitaminB5: 0.4,
    vitaminB6: 0.43,
    vitaminB9: 24,
    vitaminB12: 0,
    // Minerals
    calcium: 6,
    iron: 0.31,
    magnesium: 32,
    phosphorus: 26,
    potassium: 422,
    sodium: 1,
    zinc: 0.18,
    copper: 0.09,
    manganese: 0.32,
    selenium: 1.2,
    // Other components
    cholesterol: 0,
    caffeine: 0,
    alcohol: 0,
    water: 88
  },
  { 
    id: 3, 
    name: 'Chicken Breast', 
    calories: 165, 
    protein: 31, 
    carbs: 0, 
    fat: 3.6, 
    serving: '100g (cooked)', 
    source: 'Local',
    // Detailed macronutrients
    fiber: 0,
    sugars: 0,
    saturatedFat: 1.1,
    monounsaturatedFat: 1.2,
    polyunsaturatedFat: 0.8,
    transFat: 0.1,
    // Vitamins
    vitaminA: 9,
    vitaminC: 0,
    vitaminD: 0.1,
    vitaminE: 0.3,
    vitaminK: 0.1,
    vitaminB1: 0.06,
    vitaminB2: 0.12,
    vitaminB3: 13.7,
    vitaminB5: 0.9,
    vitaminB6: 0.6,
    vitaminB9: 4,
    vitaminB12: 0.3,
    // Minerals
    calcium: 15,
    iron: 1.0,
    magnesium: 29,
    phosphorus: 228,
    potassium: 256,
    sodium: 74,
    zinc: 1.0,
    copper: 0.05,
    manganese: 0.02,
    selenium: 27.6,
    // Other components
    cholesterol: 85,
    caffeine: 0,
    alcohol: 0,
    water: 65,
    // Advanced nutrition
    aminoAcids: {
      'Tryptophan': 0.38,
      'Threonine': 1.4,
      'Isoleucine': 1.5,
      'Leucine': 2.5,
      'Lysine': 2.8,
      'Methionine': 0.85,
      'Phenylalanine': 1.3,
      'Valine': 1.6
    }
  },
  { 
    id: 4, 
    name: 'Brown Rice', 
    calories: 215, 
    protein: 5, 
    carbs: 45, 
    fat: 1.8, 
    serving: '1 cup cooked (195g)', 
    source: 'Local',
    // Detailed macronutrients
    fiber: 3.5,
    sugars: 0.7,
    saturatedFat: 0.4,
    monounsaturatedFat: 0.6,
    polyunsaturatedFat: 0.6,
    transFat: 0,
    // Vitamins
    vitaminA: 0,
    vitaminC: 0,
    vitaminD: 0,
    vitaminE: 0.1,
    vitaminK: 1.2,
    vitaminB1: 0.2,
    vitaminB2: 0.05,
    vitaminB3: 3,
    vitaminB5: 0.6,
    vitaminB6: 0.3,
    vitaminB9: 8,
    vitaminB12: 0,
    // Minerals
    calcium: 20,
    iron: 1,
    magnesium: 86,
    phosphorus: 162,
    potassium: 173,
    sodium: 10,
    zinc: 1.2,
    copper: 0.2,
    manganese: 2.1,
    selenium: 19.1,
    // Other components
    cholesterol: 0,
    caffeine: 0,
    alcohol: 0,
    water: 143
  },
  { 
    id: 5, 
    name: 'Salmon', 
    calories: 206, 
    protein: 22, 
    carbs: 0, 
    fat: 13, 
    serving: '100g (cooked)', 
    source: 'Local',
    // Detailed macronutrients
    fiber: 0,
    sugars: 0,
    saturatedFat: 3.1,
    monounsaturatedFat: 3.8,
    polyunsaturatedFat: 3.9,
    transFat: 0,
    // Vitamins
    vitaminA: 58,
    vitaminC: 3.9,
    vitaminD: 11.2,
    vitaminE: 1.1,
    vitaminK: 0.7,
    vitaminB1: 0.23,
    vitaminB2: 0.38,
    vitaminB3: 8.6,
    vitaminB5: 1.5,
    vitaminB6: 0.8,
    vitaminB9: 26,
    vitaminB12: 2.8,
    // Minerals
    calcium: 12,
    iron: 0.5,
    magnesium: 29,
    phosphorus: 252,
    potassium: 384,
    sodium: 48,
    zinc: 0.6,
    copper: 0.04,
    manganese: 0.02,
    selenium: 41.4,
    // Other components
    cholesterol: 55,
    caffeine: 0,
    alcohol: 0,
    water: 64,
    // Advanced nutrition
    fattyAcids: {
      'Omega-3': 2.2,
      'Omega-6': 0.6,
      'EPA': 0.69,
      'DHA': 0.82
    }
  },
  { 
    id: 6, 
    name: 'Egg', 
    calories: 78, 
    protein: 6, 
    carbs: 0.6, 
    fat: 5, 
    serving: '1 large (50g)', 
    source: 'Local',
    // Detailed macronutrients
    fiber: 0,
    sugars: 0.6,
    saturatedFat: 1.6,
    monounsaturatedFat: 2.0,
    polyunsaturatedFat: 0.7,
    transFat: 0,
    // Vitamins
    vitaminA: 98,
    vitaminC: 0,
    vitaminD: 1.1,
    vitaminE: 0.5,
    vitaminK: 0.3,
    vitaminB1: 0.03,
    vitaminB2: 0.23,
    vitaminB3: 0.03,
    vitaminB5: 0.77,
    vitaminB6: 0.09,
    vitaminB9: 22,
    vitaminB12: 0.45,
    // Minerals
    calcium: 28,
    iron: 0.9,
    magnesium: 6,
    phosphorus: 99,
    potassium: 69,
    sodium: 71,
    zinc: 0.6,
    copper: 0.01,
    manganese: 0.01,
    selenium: 15.4,
    // Other components
    cholesterol: 186,
    caffeine: 0,
    alcohol: 0,
    water: 37,
    // Advanced nutrition
    aminoAcids: {
      'Tryptophan': 0.08,
      'Threonine': 0.26,
      'Isoleucine': 0.34,
      'Leucine': 0.54,
      'Lysine': 0.4,
      'Methionine': 0.19,
      'Phenylalanine': 0.34,
      'Valine': 0.41
    }
  },
  // Add more foods with enhanced nutrition data as needed
  { id: 7, name: 'Avocado', calories: 240, protein: 3, carbs: 12, fat: 22, serving: '1 medium (150g)', source: 'Local' },
  { id: 8, name: 'Greek Yogurt', calories: 100, protein: 17, carbs: 6, fat: 0.4, serving: '170g (container)', source: 'Local' },
  { id: 9, name: 'Oatmeal', calories: 150, protein: 5, carbs: 27, fat: 2.5, serving: '1 cup cooked (234g)', source: 'Local' },
  { id: 10, name: 'Almonds', calories: 164, protein: 6, carbs: 6, fat: 14, serving: '28g (1 oz)', source: 'Local' },
  { id: 11, name: 'Broccoli', calories: 55, protein: 3.7, carbs: 11, fat: 0.6, serving: '1 cup (91g)', source: 'Local' },
  { id: 12, name: 'Sweet Potato', calories: 180, protein: 4, carbs: 41, fat: 0.1, serving: '1 medium (151g)', source: 'Local' },
  { id: 13, name: 'Quinoa', calories: 222, protein: 8, carbs: 39, fat: 3.6, serving: '1 cup cooked (185g)', source: 'Local' },
  { id: 14, name: 'Spinach', calories: 23, protein: 2.9, carbs: 3.6, fat: 0.4, serving: '100g (raw)', source: 'Local' },
  // Fruits
  { id: 16, name: 'Orange', calories: 62, protein: 1.2, carbs: 15.4, fat: 0.2, serving: '1 medium (154g)', source: 'Local' },
  { id: 17, name: 'Strawberries', calories: 49, protein: 1, carbs: 12, fat: 0.5, serving: '1 cup (152g)', source: 'Local' },
  { id: 18, name: 'Blueberries', calories: 84, protein: 1.1, carbs: 21, fat: 0.5, serving: '1 cup (148g)', source: 'Local' },
  { id: 19, name: 'Grapes', calories: 104, protein: 1.1, carbs: 27, fat: 0.2, serving: '1 cup (151g)', source: 'Local' },
  { id: 20, name: 'Pineapple', calories: 82, protein: 0.9, carbs: 22, fat: 0.2, serving: '1 cup chunks (165g)', source: 'Local' },
  { id: 21, name: 'Mango', calories: 107, protein: 1.4, carbs: 28, fat: 0.4, serving: '1 cup sliced (165g)', source: 'Local' },
  { id: 22, name: 'Watermelon', calories: 46, protein: 0.9, carbs: 12, fat: 0.2, serving: '1 cup (152g)', source: 'Local' },

// Vegetables
  { id: 23, name: 'Carrots', calories: 41, protein: 0.9, carbs: 10, fat: 0.2, serving: '1 cup chopped (128g)', source: 'Local' },
  { id: 24, name: 'Bell Pepper', calories: 30, protein: 1, carbs: 7, fat: 0.3, serving: '1 cup chopped (149g)', source: 'Local' },
  { id: 25, name: 'Cucumber', calories: 16, protein: 0.7, carbs: 4, fat: 0.1, serving: '1 cup sliced (119g)', source: 'Local' },
  { id: 26, name: 'Tomato', calories: 32, protein: 1.6, carbs: 7, fat: 0.4, serving: '1 medium (123g)', source: 'Local' },
  { id: 27, name: 'Lettuce', calories: 10, protein: 0.9, carbs: 2, fat: 0.2, serving: '1 cup shredded (47g)', source: 'Local' },
  { id: 28, name: 'Cauliflower', calories: 25, protein: 2, carbs: 5, fat: 0.3, serving: '1 cup chopped (107g)', source: 'Local' },
  { id: 29, name: 'Zucchini', calories: 20, protein: 1.5, carbs: 4, fat: 0.4, serving: '1 cup sliced (113g)', source: 'Local' },

// Proteins
  { id: 30, name: 'Tuna', calories: 179, protein: 39, carbs: 0, fat: 1.3, serving: '100g (canned in water)', source: 'Local' },
  { id: 31, name: 'Turkey Breast', calories: 135, protein: 30, carbs: 0, fat: 1, serving: '100g (cooked)', source: 'Local' },
  { id: 32, name: 'Cod Fish', calories: 105, protein: 23, carbs: 0, fat: 0.9, serving: '100g (cooked)', source: 'Local' },
  { id: 33, name: 'Tofu', calories: 94, protein: 10, carbs: 2.3, fat: 6, serving: '100g (firm)', source: 'Local' },
  { id: 34, name: 'Lentils', calories: 230, protein: 18, carbs: 40, fat: 0.8, serving: '1 cup cooked (198g)', source: 'Local' },
  { id: 35, name: 'Black Beans', calories: 227, protein: 15, carbs: 41, fat: 0.9, serving: '1 cup cooked (172g)', source: 'Local' },
  { id: 36, name: 'Cottage Cheese', calories: 98, protein: 11, carbs: 3.4, fat: 4.3, serving: '1/2 cup (113g)', source: 'Local' },

// Grains & Carbs
  { id: 37, name: 'White Rice', calories: 205, protein: 4.3, carbs: 45, fat: 0.4, serving: '1 cup cooked (158g)', source: 'Local' },
  { id: 38, name: 'Whole Wheat Bread', calories: 81, protein: 4, carbs: 14, fat: 1.1, serving: '1 slice (28g)', source: 'Local' },
  { id: 39, name: 'Pasta', calories: 220, protein: 8, carbs: 44, fat: 1.1, serving: '1 cup cooked (140g)', source: 'Local' },
  { id: 40, name: 'Barley', calories: 193, protein: 3.5, carbs: 44, fat: 0.7, serving: '1 cup cooked (157g)', source: 'Local' },

// Nuts & Seeds
  { id: 41, name: 'Walnuts', calories: 185, protein: 4.3, carbs: 3.9, fat: 18.5, serving: '28g (1 oz)', source: 'Local' },
  { id: 42, name: 'Cashews', calories: 157, protein: 5.2, carbs: 8.6, fat: 12.4, serving: '28g (1 oz)', source: 'Local' },
  { id: 43, name: 'Peanut Butter', calories: 188, protein: 8, carbs: 8, fat: 16, serving: '2 tbsp (32g)', source: 'Local' },
  { id: 44, name: 'Chia Seeds', calories: 138, protein: 4.7, carbs: 12, fat: 8.7, serving: '28g (1 oz)', source: 'Local' },
  { id: 45, name: 'Sunflower Seeds', calories: 165, protein: 5.8, carbs: 6.8, fat: 14, serving: '28g (1 oz)', source: 'Local' },

// Dairy
  { id: 46, name: 'Milk (2%)', calories: 122, protein: 8, carbs: 12, fat: 4.8, serving: '1 cup (244g)', source: 'Local' },
  { id: 47, name: 'Cheddar Cheese', calories: 113, protein: 7, carbs: 1, fat: 9, serving: '28g (1 oz)', source: 'Local' },
  { id: 48, name: 'Mozzarella', calories: 85, protein: 6.3, carbs: 1, fat: 6.3, serving: '28g (1 oz)', source: 'Local' },

// Healthy Fats
  { id: 49, name: 'Olive Oil', calories: 119, protein: 0, carbs: 0, fat: 13.5, serving: '1 tbsp (13.5g)', source: 'Local' },
  { id: 50, name: 'Coconut Oil', calories: 117, protein: 0, carbs: 0, fat: 13.6, serving: '1 tbsp (13.6g)', source: 'Local' }

];

// Sample meal types
const mealTypes = ['Breakfast', 'Lunch', 'Dinner', 'Snack'];

export default function CalorieCounterPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  
  // USDA API Integration
  const { 
    searchResults, 
    isLoading: isSearchLoading, 
    error: searchError,
    searchFoods, 
    clearSearch 
  } = useFoodSearch();
  
  const [selectedDate, setSelectedDate] = useState('');
  const [meals, setMeals] = useState([]);
  const [showAddFoodModal, setShowAddFoodModal] = useState(false);
  const [selectedFood, setSelectedFood] = useState(null);
  const [selectedMealType, setSelectedMealType] = useState('Breakfast');
  const [servingSize, setServingSize] = useState(1);
  const [isAddingFood, setIsAddingFood] = useState(false);
  const [dailyGoals, setDailyGoals] = useState({
    calories: 2000,
    protein: 150,
    carbs: 200,
    fat: 65
  });
  
  // Quick add food state
  const [quickAddFood, setQuickAddFood] = useState({
    name: '',
    calories: '',
    serving: '',
    protein: '',
    carbs: '',
    fat: ''
  });
  
  // State for macronutrient ratios
  const [macroRatios, setMacroRatios] = useState({
    protein: 30,
    carbs: 40,
    fat: 30
  });
  
  // State for modals
  const [showNutritionModal, setShowNutritionModal] = useState(false);
  const [showDetailedNutrition, setShowDetailedNutrition] = useState(false);
  const [showAdvancedNutrition, setShowAdvancedNutrition] = useState(false);
  
  // Temporary state for editing
  const [tempGoals, setTempGoals] = useState({...dailyGoals});
  const [tempMacroRatios, setTempMacroRatios] = useState({...macroRatios});

  // Set today's date on component mount and load saved data
  useEffect(() => {
    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0];
    setSelectedDate(formattedDate);
    
    // Load saved meals from localStorage
    const savedMeals = localStorage.getItem('calorieCounterMeals');
    if (savedMeals) {
      try {
        const parsedMeals = JSON.parse(savedMeals);
        console.log('Loaded saved meals:', parsedMeals);
        setMeals(parsedMeals);
      } catch (error) {
        console.error('Error loading saved meals:', error);
      }
    }
    
    // Load saved goals from localStorage
    const savedGoals = localStorage.getItem('calorieCounterGoals');
    if (savedGoals) {
      try {
        const parsedGoals = JSON.parse(savedGoals);
        console.log('Loaded saved goals:', parsedGoals);
        setDailyGoals(parsedGoals);
        setTempGoals(parsedGoals);
      } catch (error) {
        console.error('Error loading saved goals:', error);
      }
    }
    
    // Load saved macro ratios from localStorage
    const savedMacroRatios = localStorage.getItem('calorieCounterMacroRatios');
    if (savedMacroRatios) {
      try {
        const parsedMacroRatios = JSON.parse(savedMacroRatios);
        console.log('Loaded saved macro ratios:', parsedMacroRatios);
        setMacroRatios(parsedMacroRatios);
        setTempMacroRatios(parsedMacroRatios);
      } catch (error) {
        console.error('Error loading saved macro ratios:', error);
      }
    }
  }, []);

  // Save meals to localStorage whenever they change
  useEffect(() => {
    if (meals.length > 0) {
      localStorage.setItem('calorieCounterMeals', JSON.stringify(meals));
      console.log('Saved meals to localStorage:', meals);
    }
  }, [meals]);

  // Save macro ratios to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('calorieCounterMacroRatios', JSON.stringify(macroRatios));
    console.log('Saved macro ratios to localStorage:', macroRatios);
  }, [macroRatios]);

  // Handle search input change
  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (query.length > 2) {
      searchFoods(query);
    } else {
      clearSearch();
    }
  };

  // Select a food item
  const selectFood = (food) => {
    console.log('Selected food:', food);
    setSelectedFood(food);
    setServingSize(1);
    setShowAddFoodModal(true);
  };

  // Add food to meal with detailed nutrition information
  const addFoodToMeal = () => {
    console.log('Adding food to meal:', selectedFood, 'Serving size:', servingSize, 'Meal type:', selectedMealType);
    setIsAddingFood(true);
    
    // Helper function to calculate adjusted nutrient values
    const calculateAdjustedValue = (value) => {
      return value !== undefined ? Math.round((value * servingSize) * 10) / 10 : undefined;
    };
    
    // Calculate basic nutrients based on serving size
    const totalCalories = Math.round(selectedFood.calories * servingSize);
    const totalProtein = calculateAdjustedValue(selectedFood.protein);
    const totalCarbs = calculateAdjustedValue(selectedFood.carbs);
    const totalFat = calculateAdjustedValue(selectedFood.fat);
    
    // Create new food object with comprehensive nutrition data
    const newFood = {
      id: Date.now(),
      name: selectedFood.name,
      brand: selectedFood.brand || 'Generic',
      servingSize: servingSize,
      servingUnit: selectedFood.serving,
      date: selectedDate,
      mealType: selectedMealType,
      source: selectedFood.source || 'Local',
      
      // Basic macros
      totalCalories,
      totalProtein,
      totalCarbs,
      totalFat,
      
      // Detailed macronutrients
      totalFiber: calculateAdjustedValue(selectedFood.fiber),
      totalSugars: calculateAdjustedValue(selectedFood.sugars),
      totalSaturatedFat: calculateAdjustedValue(selectedFood.saturatedFat),
      totalMonounsaturatedFat: calculateAdjustedValue(selectedFood.monounsaturatedFat),
      totalPolyunsaturatedFat: calculateAdjustedValue(selectedFood.polyunsaturatedFat),
      totalTransFat: calculateAdjustedValue(selectedFood.transFat),
      
      // Vitamins
      totalVitaminA: calculateAdjustedValue(selectedFood.vitaminA),
      totalVitaminC: calculateAdjustedValue(selectedFood.vitaminC),
      totalVitaminD: calculateAdjustedValue(selectedFood.vitaminD),
      totalVitaminE: calculateAdjustedValue(selectedFood.vitaminE),
      totalVitaminK: calculateAdjustedValue(selectedFood.vitaminK),
      totalVitaminB1: calculateAdjustedValue(selectedFood.vitaminB1),
      totalVitaminB2: calculateAdjustedValue(selectedFood.vitaminB2),
      totalVitaminB3: calculateAdjustedValue(selectedFood.vitaminB3),
      totalVitaminB5: calculateAdjustedValue(selectedFood.vitaminB5),
      totalVitaminB6: calculateAdjustedValue(selectedFood.vitaminB6),
      totalVitaminB9: calculateAdjustedValue(selectedFood.vitaminB9),
      totalVitaminB12: calculateAdjustedValue(selectedFood.vitaminB12),
      
      // Minerals
      totalCalcium: calculateAdjustedValue(selectedFood.calcium),
      totalIron: calculateAdjustedValue(selectedFood.iron),
      totalMagnesium: calculateAdjustedValue(selectedFood.magnesium),
      totalPhosphorus: calculateAdjustedValue(selectedFood.phosphorus),
      totalPotassium: calculateAdjustedValue(selectedFood.potassium),
      totalSodium: calculateAdjustedValue(selectedFood.sodium),
      totalZinc: calculateAdjustedValue(selectedFood.zinc),
      totalCopper: calculateAdjustedValue(selectedFood.copper),
      totalManganese: calculateAdjustedValue(selectedFood.manganese),
      totalSelenium: calculateAdjustedValue(selectedFood.selenium),
      
      // Other components
      totalCholesterol: calculateAdjustedValue(selectedFood.cholesterol),
      totalCaffeine: calculateAdjustedValue(selectedFood.caffeine),
      totalAlcohol: calculateAdjustedValue(selectedFood.alcohol),
      totalWater: calculateAdjustedValue(selectedFood.water),
      
      // Advanced nutrition (preserve original objects)
      aminoAcids: selectedFood.aminoAcids,
      fattyAcids: selectedFood.fattyAcids
    };
    
    // Update meals state
    setMeals(prevMeals => [...prevMeals, newFood]);
    
    // Close modal and reset state
    setShowAddFoodModal(false);
    setSelectedFood(null);
    setServingSize(1);
    setIsAddingFood(false);
  };

  // Add quick food to meal
  const addQuickFood = () => {
    console.log('Adding quick food to meal:', quickAddFood, 'Meal type:', selectedMealType);
    setIsAddingFood(true);
    
    // Validate required fields
    if (!quickAddFood.name || !quickAddFood.calories) {
      alert('Please enter at least a food name and calories');
      setIsAddingFood(false);
      return;
    }
    
    // Create new food object from quick add form
    const newFood = {
      id: Date.now(),
      name: quickAddFood.name,
      brand: 'Custom',
      servingSize: 1,
      servingUnit: quickAddFood.serving || 'serving',
      totalCalories: parseInt(quickAddFood.calories) || 0,
      totalProtein: parseFloat(quickAddFood.protein) || 0,
      totalCarbs: parseFloat(quickAddFood.carbs) || 0,
      totalFat: parseFloat(quickAddFood.fat) || 0,
      date: selectedDate,
      mealType: selectedMealType,
      source: 'Custom'
    };
    
    // Update meals state
    setMeals(prevMeals => [...prevMeals, newFood]);
    
    // Reset quick add form
    setQuickAddFood({
      name: '',
      calories: '',
      serving: '',
      protein: '',
      carbs: '',
      fat: ''
    });
    
    // Close modal and reset state
    setShowAddFoodModal(false);
    setIsAddingFood(false);
  };

  // Remove food from meal
  const removeFood = (foodId) => {
    setMeals(prevMeals => prevMeals.filter(meal => meal.id !== foodId));
  };

  // Get meals for a specific date
  const getMealsForDate = (date) => {
    return meals.filter(meal => meal.date === date);
  };

  // Calculate daily totals
  const calculateDailyTotals = () => {
    const mealsForDate = getMealsForDate(selectedDate);
    return {
      calories: mealsForDate.reduce((sum, meal) => sum + meal.totalCalories, 0),
      protein: mealsForDate.reduce((sum, meal) => sum + meal.totalProtein, 0),
      carbs: mealsForDate.reduce((sum, meal) => sum + meal.totalCarbs, 0),
      fat: mealsForDate.reduce((sum, meal) => sum + meal.totalFat, 0)
    };
  };
  
  // Calculate detailed nutrition totals for the selected date
  const calculateDetailedNutritionTotals = () => {
    const mealsForDate = getMealsForDate(selectedDate);
    const totals = {
      // Detailed Macronutrients
      fiber: 0,
      sugars: 0,
      saturatedFat: 0,
      monounsaturatedFat: 0,
      polyunsaturatedFat: 0,
      transFat: 0,
      cholesterol: 0,
      water: 0,
      
      // Vitamins
      vitaminA: 0,
      vitaminC: 0,
      vitaminD: 0,
      vitaminE: 0,
      vitaminK: 0,
      vitaminB1: 0, // Thiamin
      vitaminB2: 0, // Riboflavin
      vitaminB3: 0, // Niacin
      vitaminB5: 0, // Pantothenic acid
      vitaminB6: 0, // Pyridoxine
      vitaminB9: 0, // Folate
      vitaminB12: 0, // Cobalamin
      
      // Minerals
      calcium: 0,
      iron: 0,
      magnesium: 0,
      phosphorus: 0,
      potassium: 0,
      sodium: 0,
      zinc: 0,
      copper: 0,
      manganese: 0,
      selenium: 0,
    };
    
    mealsForDate.forEach(food => {
      // Add all nutrition values from the food
      // Detailed Macronutrients
      totals.fiber += food.totalFiber || 0;
      totals.sugars += food.totalSugars || 0;
      totals.saturatedFat += food.totalSaturatedFat || 0;
      totals.monounsaturatedFat += food.totalMonounsaturatedFat || 0;
      totals.polyunsaturatedFat += food.totalPolyunsaturatedFat || 0;
      totals.transFat += food.totalTransFat || 0;
      totals.cholesterol += food.totalCholesterol || 0;
      totals.water += food.totalWater || 0;
      
      // Vitamins
      totals.vitaminA += food.totalVitaminA || 0;
      totals.vitaminC += food.totalVitaminC || 0;
      totals.vitaminD += food.totalVitaminD || 0;
      totals.vitaminE += food.totalVitaminE || 0;
      totals.vitaminK += food.totalVitaminK || 0;
      totals.vitaminB1 += food.totalVitaminB1 || 0;
      totals.vitaminB2 += food.totalVitaminB2 || 0;
      totals.vitaminB3 += food.totalVitaminB3 || 0;
      totals.vitaminB5 += food.totalVitaminB5 || 0;
      totals.vitaminB6 += food.totalVitaminB6 || 0;
      totals.vitaminB9 += food.totalVitaminB9 || 0;
      totals.vitaminB12 += food.totalVitaminB12 || 0;
      
      // Minerals
      totals.calcium += food.totalCalcium || 0;
      totals.iron += food.totalIron || 0;
      totals.magnesium += food.totalMagnesium || 0;
      totals.phosphorus += food.totalPhosphorus || 0;
      totals.potassium += food.totalPotassium || 0;
      totals.sodium += food.totalSodium || 0;
      totals.zinc += food.totalZinc || 0;
      totals.copper += food.totalCopper || 0;
      totals.manganese += food.totalManganese || 0;
      totals.selenium += food.totalSelenium || 0;
    });
    
    return totals;
  };

  // Calculate percentage of daily goals
  const calculatePercentage = (value, goal) => {
    return Math.min(Math.round((value / goal) * 100), 100);
  };

  // Get meals by type
  const getMealsByType = (type) => {
    return getMealsForDate(selectedDate).filter(meal => meal.mealType === type);
  };

  // Calculate totals for a specific meal type
  const calculateMealTypeTotals = (type) => {
    const mealsOfType = getMealsByType(type);
    return {
      calories: mealsOfType.reduce((sum, meal) => sum + meal.totalCalories, 0),
      protein: mealsOfType.reduce((sum, meal) => sum + meal.totalProtein, 0),
      carbs: mealsOfType.reduce((sum, meal) => sum + meal.totalCarbs, 0),
      fat: mealsOfType.reduce((sum, meal) => sum + meal.totalFat, 0)
    };
  };

  // Daily totals
  const dailyTotals = calculateDailyTotals();

  // Combine local and USDA search results
  const getAllSearchResults = () => {
    const localResults = foodDatabase.filter(food =>
      food.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    return [...localResults, ...searchResults];
  };

  const allSearchResults = getAllSearchResults();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-r from-primary/20 via-secondary/20 to-warning/20">
        <div className="container-custom mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Calorie Counter</h1>
          <p className="text-lg text-text-secondary max-w-3xl mx-auto">
            Track your daily nutrition intake, monitor macros, and achieve your dietary goals with our easy-to-use calorie counter.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 bg-dark">
        <div className="container-custom mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left Column - Food Search & Daily Summary */}
            <div className="lg:w-1/3 space-y-6">
              {/* Date Selector */}
              <div className="card p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold flex items-center">
                    <FiCalendar className="mr-2" />
                    Date
                  </h2>
                </div>
                <input 
                  type="date" 
                  className="w-full p-3 rounded bg-dark border border-gray-700 focus:border-primary outline-none"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                />
              </div>
              
              {/* Add Food - Moved above Daily Summary for better dropdown positioning */}
              <div className="card p-6 relative z-30">
                <h2 className="text-xl font-bold mb-4 flex items-center">
                  <FiPlus className="mr-2" />
                  Add Food
                </h2>
                
                <div className="flex space-x-2 mb-4">
                  <button 
                    className="btn-primary flex-1 flex items-center justify-center"
                    onClick={() => {
                      setSelectedFood(null);
                      setShowAddFoodModal(true);
                    }}
                  >
                    <FiPlus className="mr-2" />
                    Quick Add
                  </button>
                </div>
                
                <div className="relative" style={{ position: 'relative', zIndex: 1000 }}>
                  <input 
                    type="text" 
                    className="w-full p-3 pl-10 rounded bg-dark border border-gray-700 focus:border-primary outline-none"
                    placeholder="Search USDA food database..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                    onFocus={() => setIsSearchFocused(true)}
                    onBlur={() => {
                      // Increase delay to ensure click event on search result completes first
                      // Increased from 300ms to 500ms for better mobile compatibility
                      setTimeout(() => setIsSearchFocused(false), 500);
                    }}
                  />
                  <FiSearch className="absolute left-3 top-3.5 text-text-secondary" />
                  
                  {/* Search Results */}
                  {isSearchFocused && (allSearchResults.length > 0 || isSearchLoading || searchError) && (
                    <div className="absolute z-[100] mt-1 w-full bg-card border border-gray-700 rounded-md shadow-lg overflow-auto" style={{ maxHeight: '50vh', transform: 'translateY(0)' }}>
                      
                      {/* Loading State */}
                      {isSearchLoading && (
                        <div className="p-4 text-center">
                          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto mb-2"></div>
                          <span className="text-sm text-text-secondary">Searching USDA database...</span>
                        </div>
                      )}
                      
                      {/* Error State */}
                      {searchError && (
                        <div className="p-3 text-center text-red-400 text-sm">
                          {searchError}
                        </div>
                      )}
                      
                      {/* Search Results */}
                      {!isSearchLoading && allSearchResults.length > 0 && allSearchResults.map((food, index) => (
                        <div 
                          key={`${food.source}-${food.id || food.fdcId}-${index}`}
                          className="p-3 hover:bg-dark cursor-pointer border-b border-gray-700 last:border-0"
                          onTouchStart={(e) => {
                            // For touch devices, prevent default to avoid issues
                            e.preventDefault();
                            // Select food on touch start
                            selectFood(food);
                          }}
                          onMouseDown={(e) => {
                            // Prevent the blur event from firing before the click
                            e.preventDefault();
                            // Immediately select the food item on mousedown for better mobile experience
                            selectFood(food);
                          }}
                          onClick={(e) => {
                            // Prevent default behavior
                            e.preventDefault();
                            e.stopPropagation();
                            console.log('Food item clicked:', food);
                          }}
                        >
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <div className="font-medium">{food.name}</div>
                              <div className="text-xs text-text-secondary flex items-center space-x-2">
                                <span>{food.brand || 'Generic'}</span>
                                <span>•</span>
                                <span>{food.serving}</span>
                                <span>•</span>
                                <span className={`px-1 rounded text-xs ${food.source === 'USDA' ? 'bg-green-600' : 'bg-blue-600'}`}>
                                  {food.source || 'Local'}
                                </span>
                              </div>
                            </div>
                            <div className="text-sm text-text-secondary ml-2">
                              {food.calories} cal
                            </div>
                          </div>
                        </div>
                      ))}
                      
                      {/* No Results */}
                      {!isSearchLoading && searchQuery && allSearchResults.length === 0 && (
                        <div className="p-4 text-center text-text-secondary text-sm">
                          No foods found. Try a different search term.
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
              
              {/* Daily Summary */}
              <div className="card p-6 sticky top-24 relative z-20">
                <h2 className="text-xl font-bold mb-4 flex items-center justify-between">
                  <div className="flex items-center">
                    <FiPieChart className="mr-2" />
                    Daily Summary
                  </div>
                  <button 
                    onClick={() => setShowNutritionModal(true)}
                    className="text-sm bg-primary/20 hover:bg-primary/30 text-primary px-3 py-1 rounded-full transition-colors"
                  >
                    Edit Nutrition
                  </button>
                </h2>
                
                <div className="space-y-4">
                  {/* Calories */}
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-text-secondary">Calories</span>
                      <span className="font-medium">{dailyTotals.calories} / {dailyGoals.calories}</span>
                    </div>
                    <div className="w-full bg-dark rounded-full h-2.5">
                      <div 
                        className="bg-primary h-2.5 rounded-full" 
                        style={{ width: `${calculatePercentage(dailyTotals.calories, dailyGoals.calories)}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  {/* Protein */}
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-text-secondary">Protein</span>
                      <span className="font-medium">{dailyTotals.protein.toFixed(1)}g / {dailyGoals.protein}g</span>
                    </div>
                    <div className="w-full bg-dark rounded-full h-2.5">
                      <div 
                        className="bg-blue-500 h-2.5 rounded-full" 
                        style={{ width: `${calculatePercentage(dailyTotals.protein, dailyGoals.protein)}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  {/* Carbs */}
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-text-secondary">Carbs</span>
                      <span className="font-medium">{dailyTotals.carbs.toFixed(1)}g / {dailyGoals.carbs}g</span>
                    </div>
                    <div className="w-full bg-dark rounded-full h-2.5">
                      <div 
                        className="bg-green-500 h-2.5 rounded-full" 
                        style={{ width: `${calculatePercentage(dailyTotals.carbs, dailyGoals.carbs)}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  {/* Fat */}
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-text-secondary">Fat</span>
                      <span className="font-medium">{dailyTotals.fat.toFixed(1)}g / {dailyGoals.fat}g</span>
                    </div>
                    <div className="w-full bg-dark rounded-full h-2.5">
                      <div 
                        className="bg-yellow-500 h-2.5 rounded-full" 
                        style={{ width: `${calculatePercentage(dailyTotals.fat, dailyGoals.fat)}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  {/* Macro Ratio */}
                  <div className="mt-6">
                    <h3 className="text-sm font-medium mb-2 text-text-secondary">Macronutrient Ratio</h3>
                    <div className="flex h-4 rounded-full overflow-hidden">
                      <div 
                        className="bg-blue-500" 
                        style={{ width: `${macroRatios.protein}%` }}
                      ></div>
                      <div 
                        className="bg-green-500" 
                        style={{ width: `${macroRatios.carbs}%` }}
                      ></div>
                      <div 
                        className="bg-yellow-500" 
                        style={{ width: `${macroRatios.fat}%` }}
                      ></div>
                    </div>
                    <div className="flex text-xs mt-1 text-text-secondary">
                      <div style={{ width: `${macroRatios.protein}%` }} className="text-center">P</div>
                      <div style={{ width: `${macroRatios.carbs}%` }} className="text-center">C</div>
                      <div style={{ width: `${macroRatios.fat}%` }} className="text-center">F</div>
                    </div>
                  </div>
                  
                  {/* Detailed Nutrition Analysis */}
                  <div className="mt-6">
                    <button 
                      onClick={() => setShowAdvancedNutrition(!showAdvancedNutrition)}
                      className="flex items-center justify-between w-full text-sm font-medium text-text-secondary hover:text-white transition-colors py-1"
                    >
                      <span>Detailed Nutrition Analysis</span>
                      <span>{showAdvancedNutrition ? '−' : '+'}</span>
                    </button>
                    
                    {showAdvancedNutrition && (
                      <div className="mt-3 space-y-4 text-sm">
                        {/* Detailed Macronutrients */}
                        <div>
                          <h4 className="font-medium mb-2">Detailed Macronutrients</h4>
                          <div className="grid grid-cols-2 gap-2">
                            <div className="bg-dark p-2 rounded">
                              <span className="text-text-secondary">Fiber:</span> {calculateDetailedNutritionTotals().fiber.toFixed(1)}g
                            </div>
                            <div className="bg-dark p-2 rounded">
                              <span className="text-text-secondary">Sugars:</span> {calculateDetailedNutritionTotals().sugars.toFixed(1)}g
                            </div>
                            <div className="bg-dark p-2 rounded">
                              <span className="text-text-secondary">Saturated Fat:</span> {calculateDetailedNutritionTotals().saturatedFat.toFixed(1)}g
                            </div>
                            <div className="bg-dark p-2 rounded">
                              <span className="text-text-secondary">Trans Fat:</span> {calculateDetailedNutritionTotals().transFat.toFixed(1)}g
                            </div>
                            <div className="bg-dark p-2 rounded">
                              <span className="text-text-secondary">Mono Fat:</span> {calculateDetailedNutritionTotals().monounsaturatedFat.toFixed(1)}g
                            </div>
                            <div className="bg-dark p-2 rounded">
                              <span className="text-text-secondary">Poly Fat:</span> {calculateDetailedNutritionTotals().polyunsaturatedFat.toFixed(1)}g
                            </div>
                            <div className="bg-dark p-2 rounded">
                              <span className="text-text-secondary">Cholesterol:</span> {calculateDetailedNutritionTotals().cholesterol.toFixed(1)}mg
                            </div>
                            <div className="bg-dark p-2 rounded">
                              <span className="text-text-secondary">Water:</span> {calculateDetailedNutritionTotals().water.toFixed(1)}g
                            </div>
                          </div>
                        </div>
                        
                        {/* Vitamins */}
                        <div>
                          <h4 className="font-medium mb-2">Vitamins</h4>
                          <div className="grid grid-cols-2 gap-2">
                            <div className="bg-dark p-2 rounded">
                              <span className="text-text-secondary">Vitamin A:</span> {calculateDetailedNutritionTotals().vitaminA.toFixed(1)}μg
                            </div>
                            <div className="bg-dark p-2 rounded">
                              <span className="text-text-secondary">Vitamin C:</span> {calculateDetailedNutritionTotals().vitaminC.toFixed(1)}mg
                            </div>
                            <div className="bg-dark p-2 rounded">
                              <span className="text-text-secondary">Vitamin D:</span> {calculateDetailedNutritionTotals().vitaminD.toFixed(1)}μg
                            </div>
                            <div className="bg-dark p-2 rounded">
                              <span className="text-text-secondary">Vitamin E:</span> {calculateDetailedNutritionTotals().vitaminE.toFixed(1)}mg
                            </div>
                            <div className="bg-dark p-2 rounded">
                              <span className="text-text-secondary">Vitamin K:</span> {calculateDetailedNutritionTotals().vitaminK.toFixed(1)}μg
                            </div>
                            <div className="bg-dark p-2 rounded">
                              <span className="text-text-secondary">Vitamin B1:</span> {calculateDetailedNutritionTotals().vitaminB1.toFixed(1)}mg
                            </div>
                            <div className="bg-dark p-2 rounded">
                              <span className="text-text-secondary">Vitamin B2:</span> {calculateDetailedNutritionTotals().vitaminB2.toFixed(1)}mg
                            </div>
                            <div className="bg-dark p-2 rounded">
                              <span className="text-text-secondary">Vitamin B3:</span> {calculateDetailedNutritionTotals().vitaminB3.toFixed(1)}mg
                            </div>
                            <div className="bg-dark p-2 rounded">
                              <span className="text-text-secondary">Vitamin B5:</span> {calculateDetailedNutritionTotals().vitaminB5.toFixed(1)}mg
                            </div>
                            <div className="bg-dark p-2 rounded">
                              <span className="text-text-secondary">Vitamin B6:</span> {calculateDetailedNutritionTotals().vitaminB6.toFixed(1)}mg
                            </div>
                            <div className="bg-dark p-2 rounded">
                              <span className="text-text-secondary">Vitamin B9:</span> {calculateDetailedNutritionTotals().vitaminB9.toFixed(1)}μg
                            </div>
                            <div className="bg-dark p-2 rounded">
                              <span className="text-text-secondary">Vitamin B12:</span> {calculateDetailedNutritionTotals().vitaminB12.toFixed(1)}μg
                            </div>
                          </div>
                        </div>
                        
                        {/* Minerals */}
                        <div>
                          <h4 className="font-medium mb-2">Minerals</h4>
                          <div className="grid grid-cols-2 gap-2">
                            <div className="bg-dark p-2 rounded">
                              <span className="text-text-secondary">Calcium:</span> {calculateDetailedNutritionTotals().calcium.toFixed(1)}mg
                            </div>
                            <div className="bg-dark p-2 rounded">
                              <span className="text-text-secondary">Iron:</span> {calculateDetailedNutritionTotals().iron.toFixed(1)}mg
                            </div>
                            <div className="bg-dark p-2 rounded">
                              <span className="text-text-secondary">Magnesium:</span> {calculateDetailedNutritionTotals().magnesium.toFixed(1)}mg
                            </div>
                            <div className="bg-dark p-2 rounded">
                              <span className="text-text-secondary">Phosphorus:</span> {calculateDetailedNutritionTotals().phosphorus.toFixed(1)}mg
                            </div>
                            <div className="bg-dark p-2 rounded">
                              <span className="text-text-secondary">Potassium:</span> {calculateDetailedNutritionTotals().potassium.toFixed(1)}mg
                            </div>
                            <div className="bg-dark p-2 rounded">
                              <span className="text-text-secondary">Sodium:</span> {calculateDetailedNutritionTotals().sodium.toFixed(1)}mg
                            </div>
                            <div className="bg-dark p-2 rounded">
                              <span className="text-text-secondary">Zinc:</span> {calculateDetailedNutritionTotals().zinc.toFixed(1)}mg
                            </div>
                            <div className="bg-dark p-2 rounded">
                              <span className="text-text-secondary">Copper:</span> {calculateDetailedNutritionTotals().copper.toFixed(1)}mg
                            </div>
                            <div className="bg-dark p-2 rounded">
                              <span className="text-text-secondary">Manganese:</span> {calculateDetailedNutritionTotals().manganese.toFixed(1)}mg
                            </div>
                            <div className="bg-dark p-2 rounded">
                              <span className="text-text-secondary">Selenium:</span> {calculateDetailedNutritionTotals().selenium.toFixed(1)}μg
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Right Column - Meals */}
            <div className="lg:w-2/3 space-y-6">
              {/* Meal Sections */}
              <div className="space-y-6">
                {mealTypes.map(mealType => {
                  const mealTotals = calculateMealTypeTotals(mealType);
                  const mealsOfType = getMealsByType(mealType);
                  
                  return (
                    <div key={mealType} className="card p-6">
                      <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold">{mealType}</h2>
                        <div className="flex items-center space-x-2">
                          <span className="text-text-secondary">{mealTotals.calories} kcal</span>
                          <button 
                            className="btn-primary-sm"
                            onClick={() => {
                              setSelectedMealType(mealType);
                              setSelectedFood(null);
                              setShowAddFoodModal(true);
                            }}
                          >
                            + Add Food
                          </button>
                        </div>
                      </div>
                      
                      {mealsOfType.length === 0 ? (
                        <div className="text-center py-8 text-text-secondary">
                          No foods added to {mealType.toLowerCase()} yet.
                        </div>
                      ) : (
                        <div className="overflow-x-auto">
                          <table className="w-full">
                            <thead>
                              <tr className="border-b border-gray-700">
                                <th className="text-left py-2">Food</th>
                                <th className="text-center py-2">Serving</th>
                                <th className="text-center py-2">Calories</th>
                                <th className="text-center py-2">Protein</th>
                                <th className="text-center py-2">Carbs</th>
                                <th className="text-center py-2">Fat</th>
                                <th className="text-center py-2">Actions</th>
                              </tr>
                            </thead>
                            <tbody>
                              {mealsOfType.map(food => (
                                <tr key={food.id} className="border-b border-gray-700 last:border-0">
                                  <td className="py-2">
                                    <div className="font-medium">{food.name}</div>
                                    <div className="text-xs text-text-secondary">{food.brand}</div>
                                  </td>
                                  <td className="text-center py-2">
                                    <div>{food.servingSize} {food.servingUnit}</div>
                                  </td>
                                  <td className="text-center py-2">{food.totalCalories}</td>
                                  <td className="text-center py-2">{food.totalProtein.toFixed(1)}g</td>
                                  <td className="text-center py-2">{food.totalCarbs.toFixed(1)}g</td>
                                  <td className="text-center py-2">{food.totalFat.toFixed(1)}g</td>
                                  <td className="text-center py-2">
                                    <button 
                                      className="text-red-400 hover:text-red-300 transition-colors"
                                      onClick={() => removeFood(food.id)}
                                    >
                                      <FiTrash2 />
                                    </button>
                                  </td>
                                </tr>
                              ))}
                              <tr className="bg-dark/50">
                                <td className="py-2 font-bold">Total</td>
                                <td className="text-center py-2"></td>
                                <td className="text-center py-2 font-bold">{mealTotals.calories}</td>
                                <td className="text-center py-2 font-bold">{mealTotals.protein.toFixed(1)}g</td>
                                <td className="text-center py-2 font-bold">{mealTotals.carbs.toFixed(1)}g</td>
                                <td className="text-center py-2 font-bold">{mealTotals.fat.toFixed(1)}g</td>
                                <td className="text-center py-2"></td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
              
              {/* Nutrition Tips */}
              <div className="mt-8 card p-6">
                <h3 className="text-xl font-bold mb-4">Nutrition Tips</h3>
                <ul className="space-y-2 text-text-secondary">
                  <li className="flex items-start">
                    <span className="text-primary mr-2">•</span>
                    <span>Aim for a balanced diet with a good mix of proteins, complex carbs, and healthy fats.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary mr-2">•</span>
                    <span>Stay hydrated by drinking at least 8 glasses of water daily.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary mr-2">•</span>
                    <span>Include a variety of colorful fruits and vegetables to ensure you get a wide range of nutrients.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary mr-2">•</span>
                    <span>Pre-plan your meals to avoid impulsive, unhealthy food choices.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Add Food Modal */}
      {showAddFoodModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-4">
                {selectedFood ? `Add ${selectedFood.name}` : 'Quick Add Food'}
              </h2>
              
              {selectedFood ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-text-secondary mb-1">Food</label>
                    <div className="p-3 bg-dark rounded">
                      <div className="font-medium">{selectedFood.name}</div>
                      <div className="text-sm text-text-secondary">
                        {selectedFood.brand || 'Generic'} • {selectedFood.serving}
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-text-secondary mb-1">Serving Size</label>
                    <div className="flex space-x-2">
                      <input 
                        type="number" 
                        min="0.1"
                        step="0.1"
                        className="flex-1 p-3 rounded bg-dark border border-gray-700 focus:border-primary outline-none"
                        value={servingSize}
                        onChange={(e) => setServingSize(parseFloat(e.target.value))}
                      />
                      <span className="bg-dark border border-gray-700 rounded p-3 text-text-secondary">
                        {selectedFood.serving}
                      </span>
                    </div>
                    <p className="text-xs text-text-secondary mt-1">
                      Adjust the quantity of this serving size (e.g. 0.1 = 10% of serving)
                    </p>
                  </div>
                  
                  <div>
                    <label className="block text-text-secondary mb-1">Meal</label>
                    <select 
                      className="w-full p-3 rounded bg-dark border border-gray-700 focus:border-primary outline-none"
                      value={selectedMealType}
                      onChange={(e) => setSelectedMealType(e.target.value)}
                    >
                      {mealTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="pt-2">
                    <h3 className="font-medium mb-2">Nutrition</h3>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-text-secondary">Per serving</span>
                      <span className="text-sm text-text-secondary">Total ({servingSize} {servingSize === 1 ? 'serving' : 'servings'})</span>
                    </div>
                    <div className="grid grid-cols-4 gap-2 text-sm">
                      <div className="bg-dark p-2 rounded col-span-2">
                        <span className="text-text-secondary">Calories:</span> {selectedFood.calories}
                      </div>
                      <div className="bg-dark p-2 rounded col-span-2">
                        <span className="text-text-secondary">Calories:</span> {Math.round(selectedFood.calories * servingSize)}
                      </div>
                      <div className="bg-dark p-2 rounded col-span-2">
                        <span className="text-text-secondary">Protein:</span> {selectedFood.protein}g
                      </div>
                      <div className="bg-dark p-2 rounded col-span-2">
                        <span className="text-text-secondary">Protein:</span> {(selectedFood.protein * servingSize).toFixed(1)}g
                      </div>
                      <div className="bg-dark p-2 rounded col-span-2">
                        <span className="text-text-secondary">Carbs:</span> {selectedFood.carbs}g
                      </div>
                      <div className="bg-dark p-2 rounded col-span-2">
                        <span className="text-text-secondary">Carbs:</span> {(selectedFood.carbs * servingSize).toFixed(1)}g
                      </div>
                      <div className="bg-dark p-2 rounded col-span-2">
                        <span className="text-text-secondary">Fat:</span> {selectedFood.fat}g
                      </div>
                      <div className="bg-dark p-2 rounded col-span-2">
                        <span className="text-text-secondary">Fat:</span> {(selectedFood.fat * servingSize).toFixed(1)}g
                      </div>
                    </div>
                    
                    {/* Expandable Detailed Nutrition Section */}
                    <div className="mt-4">
                      <button 
                        onClick={() => setShowDetailedNutrition(!showDetailedNutrition)}
                        className="flex items-center justify-between w-full text-sm text-text-secondary hover:text-white transition-colors py-1"
                      >
                        <span className="font-medium">Detailed Nutrition Information</span>
                        <span>{showDetailedNutrition ? '−' : '+'}</span>
                      </button>
                      
                      {showDetailedNutrition && (
                        <div className="mt-2 text-sm">
                          {/* Macronutrients Breakdown */}
                          <div className="mb-3">
                            <h4 className="font-medium text-white mb-1">Macronutrients Breakdown</h4>
                            <div className="flex justify-between mb-2">
                              <span className="text-xs text-text-secondary">Per serving</span>
                              <span className="text-xs text-text-secondary">Total ({servingSize} {servingSize === 1 ? 'serving' : 'servings'})</span>
                            </div>
                            <div className="grid grid-cols-4 gap-2">
                              <div className="bg-dark p-2 rounded col-span-2">
                                <span className="text-text-secondary">Fiber:</span> {selectedFood.fiber || '0'}g
                              </div>
                              <div className="bg-dark p-2 rounded col-span-2">
                                <span className="text-text-secondary">Fiber:</span> {selectedFood.fiber ? (selectedFood.fiber * servingSize).toFixed(1) : '0'}g
                              </div>
                              <div className="bg-dark p-2 rounded col-span-2">
                                <span className="text-text-secondary">Sugars:</span> {selectedFood.sugars || '0'}g
                              </div>
                              <div className="bg-dark p-2 rounded col-span-2">
                                <span className="text-text-secondary">Sugars:</span> {selectedFood.sugars ? (selectedFood.sugars * servingSize).toFixed(1) : '0'}g
                              </div>
                              <div className="bg-dark p-2 rounded col-span-2">
                                <span className="text-text-secondary">Saturated Fat:</span> {selectedFood.saturatedFat || '0'}g
                              </div>
                              <div className="bg-dark p-2 rounded col-span-2">
                                <span className="text-text-secondary">Saturated Fat:</span> {selectedFood.saturatedFat ? (selectedFood.saturatedFat * servingSize).toFixed(1) : '0'}g
                              </div>
                              <div className="bg-dark p-2 rounded col-span-2">
                                <span className="text-text-secondary">Monounsaturated Fat:</span> {selectedFood.monounsaturatedFat || '0'}g
                              </div>
                              <div className="bg-dark p-2 rounded col-span-2">
                                <span className="text-text-secondary">Monounsaturated Fat:</span> {selectedFood.monounsaturatedFat ? (selectedFood.monounsaturatedFat * servingSize).toFixed(1) : '0'}g
                              </div>
                              <div className="bg-dark p-2 rounded col-span-2">
                                <span className="text-text-secondary">Polyunsaturated Fat:</span> {selectedFood.polyunsaturatedFat || '0'}g
                              </div>
                              <div className="bg-dark p-2 rounded col-span-2">
                                <span className="text-text-secondary">Polyunsaturated Fat:</span> {selectedFood.polyunsaturatedFat ? (selectedFood.polyunsaturatedFat * servingSize).toFixed(1) : '0'}g
                              </div>
                              <div className="bg-dark p-2 rounded col-span-2">
                                <span className="text-text-secondary">Trans Fat:</span> {selectedFood.transFat || '0'}g
                              </div>
                              <div className="bg-dark p-2 rounded col-span-2">
                                <span className="text-text-secondary">Trans Fat:</span> {selectedFood.transFat ? (selectedFood.transFat * servingSize).toFixed(1) : '0'}g
                              </div>
                            </div>
                          </div>
                          
                          {/* Vitamins */}
                          <div className="mb-3">
                            <h4 className="font-medium text-white mb-1">Vitamins</h4>
                            <div className="flex justify-between mb-2">
                              <span className="text-xs text-text-secondary">Per serving</span>
                              <span className="text-xs text-text-secondary">Total ({servingSize} {servingSize === 1 ? 'serving' : 'servings'})</span>
                            </div>
                            <div className="grid grid-cols-4 gap-2">
                              <div className="bg-dark p-2 rounded col-span-2">
                                <span className="text-text-secondary">Vitamin A:</span> {selectedFood.vitaminA || '0'}μg
                              </div>
                              <div className="bg-dark p-2 rounded col-span-2">
                                <span className="text-text-secondary">Vitamin A:</span> {selectedFood.vitaminA ? (selectedFood.vitaminA * servingSize).toFixed(1) : '0'}μg
                              </div>
                              <div className="bg-dark p-2 rounded col-span-2">
                                <span className="text-text-secondary">Vitamin C:</span> {selectedFood.vitaminC || '0'}mg
                              </div>
                              <div className="bg-dark p-2 rounded col-span-2">
                                <span className="text-text-secondary">Vitamin C:</span> {selectedFood.vitaminC ? (selectedFood.vitaminC * servingSize).toFixed(1) : '0'}mg
                              </div>
                              <div className="bg-dark p-2 rounded col-span-2">
                                <span className="text-text-secondary">Vitamin D:</span> {selectedFood.vitaminD || '0'}μg
                              </div>
                              <div className="bg-dark p-2 rounded col-span-2">
                                <span className="text-text-secondary">Vitamin D:</span> {selectedFood.vitaminD ? (selectedFood.vitaminD * servingSize).toFixed(1) : '0'}μg
                              </div>
                              <div className="bg-dark p-2 rounded col-span-2">
                                <span className="text-text-secondary">Vitamin E:</span> {selectedFood.vitaminE || '0'}mg
                              </div>
                              <div className="bg-dark p-2 rounded col-span-2">
                                <span className="text-text-secondary">Vitamin E:</span> {selectedFood.vitaminE ? (selectedFood.vitaminE * servingSize).toFixed(1) : '0'}mg
                              </div>
                              <div className="bg-dark p-2 rounded col-span-2">
                                <span className="text-text-secondary">Vitamin K:</span> {selectedFood.vitaminK || '0'}μg
                              </div>
                              <div className="bg-dark p-2 rounded col-span-2">
                                <span className="text-text-secondary">Vitamin K:</span> {selectedFood.vitaminK ? (selectedFood.vitaminK * servingSize).toFixed(1) : '0'}μg
                              </div>
                              <div className="bg-dark p-2 rounded col-span-2">
                                <span className="text-text-secondary">Vitamin B1:</span> {selectedFood.vitaminB1 || '0'}mg
                              </div>
                              <div className="bg-dark p-2 rounded col-span-2">
                                <span className="text-text-secondary">Vitamin B1:</span> {selectedFood.vitaminB1 ? (selectedFood.vitaminB1 * servingSize).toFixed(1) : '0'}mg
                              </div>
                              <div className="bg-dark p-2 rounded col-span-2">
                                <span className="text-text-secondary">Vitamin B2:</span> {selectedFood.vitaminB2 || '0'}mg
                              </div>
                              <div className="bg-dark p-2 rounded col-span-2">
                                <span className="text-text-secondary">Vitamin B2:</span> {selectedFood.vitaminB2 ? (selectedFood.vitaminB2 * servingSize).toFixed(1) : '0'}mg
                              </div>
                              <div className="bg-dark p-2 rounded col-span-2">
                                <span className="text-text-secondary">Vitamin B3:</span> {selectedFood.vitaminB3 || '0'}mg
                              </div>
                              <div className="bg-dark p-2 rounded col-span-2">
                                <span className="text-text-secondary">Vitamin B3:</span> {selectedFood.vitaminB3 ? (selectedFood.vitaminB3 * servingSize).toFixed(1) : '0'}mg
                              </div>
                              <div className="bg-dark p-2 rounded col-span-2">
                                <span className="text-text-secondary">Vitamin B5:</span> {selectedFood.vitaminB5 || '0'}mg
                              </div>
                              <div className="bg-dark p-2 rounded col-span-2">
                                <span className="text-text-secondary">Vitamin B5:</span> {selectedFood.vitaminB5 ? (selectedFood.vitaminB5 * servingSize).toFixed(1) : '0'}mg
                              </div>
                              <div className="bg-dark p-2 rounded col-span-2">
                                <span className="text-text-secondary">Vitamin B6:</span> {selectedFood.vitaminB6 || '0'}mg
                              </div>
                              <div className="bg-dark p-2 rounded col-span-2">
                                <span className="text-text-secondary">Vitamin B6:</span> {selectedFood.vitaminB6 ? (selectedFood.vitaminB6 * servingSize).toFixed(1) : '0'}mg
                              </div>
                              <div className="bg-dark p-2 rounded col-span-2">
                                <span className="text-text-secondary">Vitamin B9:</span> {selectedFood.vitaminB9 || '0'}μg
                              </div>
                              <div className="bg-dark p-2 rounded col-span-2">
                                <span className="text-text-secondary">Vitamin B9:</span> {selectedFood.vitaminB9 ? (selectedFood.vitaminB9 * servingSize).toFixed(1) : '0'}μg
                              </div>
                              <div className="bg-dark p-2 rounded col-span-2">
                                <span className="text-text-secondary">Vitamin B12:</span> {selectedFood.vitaminB12 || '0'}μg
                              </div>
                              <div className="bg-dark p-2 rounded col-span-2">
                                <span className="text-text-secondary">Vitamin B12:</span> {selectedFood.vitaminB12 ? (selectedFood.vitaminB12 * servingSize).toFixed(1) : '0'}μg
                              </div>
                            </div>
                          </div>
                          
                          {/* Minerals */}
                          <div className="mb-3">
                            <h4 className="font-medium text-white mb-1">Minerals</h4>
                            <div className="flex justify-between mb-2">
                              <span className="text-xs text-text-secondary">Per serving</span>
                              <span className="text-xs text-text-secondary">Total ({servingSize} {servingSize === 1 ? 'serving' : 'servings'})</span>
                            </div>
                            <div className="grid grid-cols-4 gap-2">
                              <div className="bg-dark p-2 rounded col-span-2">
                                <span className="text-text-secondary">Calcium:</span> {selectedFood.calcium || '0'}mg
                              </div>
                              <div className="bg-dark p-2 rounded col-span-2">
                                <span className="text-text-secondary">Calcium:</span> {selectedFood.calcium ? (selectedFood.calcium * servingSize).toFixed(1) : '0'}mg
                              </div>
                              <div className="bg-dark p-2 rounded col-span-2">
                                <span className="text-text-secondary">Iron:</span> {selectedFood.iron || '0'}mg
                              </div>
                              <div className="bg-dark p-2 rounded col-span-2">
                                <span className="text-text-secondary">Iron:</span> {selectedFood.iron ? (selectedFood.iron * servingSize).toFixed(1) : '0'}mg
                              </div>
                              <div className="bg-dark p-2 rounded col-span-2">
                                <span className="text-text-secondary">Magnesium:</span> {selectedFood.magnesium || '0'}mg
                              </div>
                              <div className="bg-dark p-2 rounded col-span-2">
                                <span className="text-text-secondary">Magnesium:</span> {selectedFood.magnesium ? (selectedFood.magnesium * servingSize).toFixed(1) : '0'}mg
                              </div>
                              <div className="bg-dark p-2 rounded col-span-2">
                                <span className="text-text-secondary">Phosphorus:</span> {selectedFood.phosphorus || '0'}mg
                              </div>
                              <div className="bg-dark p-2 rounded col-span-2">
                                <span className="text-text-secondary">Phosphorus:</span> {selectedFood.phosphorus ? (selectedFood.phosphorus * servingSize).toFixed(1) : '0'}mg
                              </div>
                              <div className="bg-dark p-2 rounded col-span-2">
                                <span className="text-text-secondary">Potassium:</span> {selectedFood.potassium || '0'}mg
                              </div>
                              <div className="bg-dark p-2 rounded col-span-2">
                                <span className="text-text-secondary">Potassium:</span> {selectedFood.potassium ? (selectedFood.potassium * servingSize).toFixed(1) : '0'}mg
                              </div>
                              <div className="bg-dark p-2 rounded col-span-2">
                                <span className="text-text-secondary">Sodium:</span> {selectedFood.sodium || '0'}mg
                              </div>
                              <div className="bg-dark p-2 rounded col-span-2">
                                <span className="text-text-secondary">Sodium:</span> {selectedFood.sodium ? (selectedFood.sodium * servingSize).toFixed(1) : '0'}mg
                              </div>
                              <div className="bg-dark p-2 rounded col-span-2">
                                <span className="text-text-secondary">Zinc:</span> {selectedFood.zinc || '0'}mg
                              </div>
                              <div className="bg-dark p-2 rounded col-span-2">
                                <span className="text-text-secondary">Zinc:</span> {selectedFood.zinc ? (selectedFood.zinc * servingSize).toFixed(1) : '0'}mg
                              </div>
                              <div className="bg-dark p-2 rounded col-span-2">
                                <span className="text-text-secondary">Copper:</span> {selectedFood.copper || '0'}mg
                              </div>
                              <div className="bg-dark p-2 rounded col-span-2">
                                <span className="text-text-secondary">Copper:</span> {selectedFood.copper ? (selectedFood.copper * servingSize).toFixed(1) : '0'}mg
                              </div>
                              <div className="bg-dark p-2 rounded col-span-2">
                                <span className="text-text-secondary">Manganese:</span> {selectedFood.manganese || '0'}mg
                              </div>
                              <div className="bg-dark p-2 rounded col-span-2">
                                <span className="text-text-secondary">Manganese:</span> {selectedFood.manganese ? (selectedFood.manganese * servingSize).toFixed(1) : '0'}mg
                              </div>
                              <div className="bg-dark p-2 rounded col-span-2">
                                <span className="text-text-secondary">Selenium:</span> {selectedFood.selenium || '0'}μg
                              </div>
                              <div className="bg-dark p-2 rounded col-span-2">
                                <span className="text-text-secondary">Selenium:</span> {selectedFood.selenium ? (selectedFood.selenium * servingSize).toFixed(1) : '0'}μg
                              </div>
                            </div>
                          </div>
                          
                          {/* Other Components */}
                          <div className="mb-3">
                            <h4 className="font-medium text-white mb-1">Other Components</h4>
                            <div className="flex justify-between mb-2">
                              <span className="text-xs text-text-secondary">Per serving</span>
                              <span className="text-xs text-text-secondary">Total ({servingSize} {servingSize === 1 ? 'serving' : 'servings'})</span>
                            </div>
                            <div className="grid grid-cols-4 gap-2">
                              <div className="bg-dark p-2 rounded col-span-2">
                                <span className="text-text-secondary">Cholesterol:</span> {selectedFood.cholesterol || '0'}mg
                              </div>
                              <div className="bg-dark p-2 rounded col-span-2">
                                <span className="text-text-secondary">Cholesterol:</span> {selectedFood.cholesterol ? (selectedFood.cholesterol * servingSize).toFixed(1) : '0'}mg
                              </div>
                              <div className="bg-dark p-2 rounded col-span-2">
                                <span className="text-text-secondary">Caffeine:</span> {selectedFood.caffeine || '0'}mg
                              </div>
                              <div className="bg-dark p-2 rounded col-span-2">
                                <span className="text-text-secondary">Caffeine:</span> {selectedFood.caffeine ? (selectedFood.caffeine * servingSize).toFixed(1) : '0'}mg
                              </div>
                              <div className="bg-dark p-2 rounded col-span-2">
                                <span className="text-text-secondary">Alcohol:</span> {selectedFood.alcohol || '0'}g
                              </div>
                              <div className="bg-dark p-2 rounded col-span-2">
                                <span className="text-text-secondary">Alcohol:</span> {selectedFood.alcohol ? (selectedFood.alcohol * servingSize).toFixed(1) : '0'}g
                              </div>
                              <div className="bg-dark p-2 rounded col-span-2">
                                <span className="text-text-secondary">Water:</span> {selectedFood.water || '0'}g
                              </div>
                              <div className="bg-dark p-2 rounded col-span-2">
                                <span className="text-text-secondary">Water:</span> {selectedFood.water ? (selectedFood.water * servingSize).toFixed(1) : '0'}g
                              </div>
                            </div>
                          </div>
                          
                          {/* Advanced Nutrition (Collapsible) */}
                          <div>
                            <button 
                              onClick={() => setShowAdvancedNutrition(!showAdvancedNutrition)}
                              className="flex items-center justify-between w-full text-sm text-text-secondary hover:text-white transition-colors py-1"
                            >
                              <span className="font-medium">Advanced Nutrition</span>
                              <span>{showAdvancedNutrition ? '−' : '+'}</span>
                            </button>
                            
                            {showAdvancedNutrition && (
                              <div className="mt-2">
                                {/* Amino Acid Profile */}
                                <div className="mb-3">
                                  <h4 className="font-medium text-white mb-1">Amino Acid Profile</h4>
                                  <div className="flex justify-between mb-2">
                                    <span className="text-xs text-text-secondary">Per serving</span>
                                    <span className="text-xs text-text-secondary">Total ({servingSize} {servingSize === 1 ? 'serving' : 'servings'})</span>
                                  </div>
                                  <div className="grid grid-cols-4 gap-2">
                                    {selectedFood.aminoAcids ? (
                                      Object.entries(selectedFood.aminoAcids).map(([name, value]) => (
                                        <React.Fragment key={name}>
                                          <div className="bg-dark p-2 rounded col-span-2">
                                            <span className="text-text-secondary">{name}:</span> {value}g
                                          </div>
                                          <div className="bg-dark p-2 rounded col-span-2">
                                            <span className="text-text-secondary">{name}:</span> {(value * servingSize).toFixed(2)}g
                                          </div>
                                        </React.Fragment>
                                      ))
                                    ) : (
                                      <div className="col-span-4 text-text-secondary">No amino acid data available</div>
                                    )}
                                  </div>
                                </div>
                                
                                {/* Fatty Acid Breakdown */}
                                <div>                                  <h4 className="font-medium text-white mb-1">Fatty Acid Breakdown</h4>
                                  <div className="flex justify-between mb-2">
                                    <span className="text-xs text-text-secondary">Per serving</span>
                                    <span className="text-xs text-text-secondary">Total ({servingSize} {servingSize === 1 ? 'serving' : 'servings'})</span>
                                  </div>
                                  <div className="grid grid-cols-4 gap-2">
                                    {selectedFood.fattyAcids ? (
                                      Object.entries(selectedFood.fattyAcids).map(([name, value]) => (
                                        <React.Fragment key={name}>
                                          <div className="bg-dark p-2 rounded col-span-2">
                                            <span className="text-text-secondary">{name}:</span> {value}g
                                          </div>
                                          <div className="bg-dark p-2 rounded col-span-2">
                                            <span className="text-text-secondary">{name}:</span> {(value * servingSize).toFixed(2)}g
                                          </div>
                                        </React.Fragment>
                                      ))
                                    ) : (
                                      <div className="col-span-4 text-text-secondary">No fatty acid data available</div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="pt-2">
                    <h3 className="font-medium mb-2">Total (with selected serving)</h3>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="bg-dark p-2 rounded">
                        <span className="text-text-secondary">Calories:</span> {Math.round(selectedFood.calories * servingSize)}
                      </div>
                      <div className="bg-dark p-2 rounded">
                        <span className="text-text-secondary">Protein:</span> {(selectedFood.protein * servingSize).toFixed(1)}g
                      </div>
                      <div className="bg-dark p-2 rounded">
                        <span className="text-text-secondary">Carbs:</span> {(selectedFood.carbs * servingSize).toFixed(1)}g
                      </div>
                      <div className="bg-dark p-2 rounded">
                        <span className="text-text-secondary">Fat:</span> {(selectedFood.fat * servingSize).toFixed(1)}g
                      </div>
                    </div>
                    <p className="text-xs text-text-secondary mt-2">
                      {servingSize < 1 ? 
                        `${(servingSize * 100).toFixed(0)}% of a full serving (${selectedFood.serving})` : 
                        servingSize > 1 ? 
                          `${servingSize}x the standard serving (${selectedFood.serving})` : 
                          `Full serving (${selectedFood.serving})`
                      }
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="block text-text-secondary mb-1">Food Name</label>
                    <input 
                      type="text" 
                      className="w-full p-3 rounded bg-dark border border-gray-700 focus:border-primary outline-none"
                      placeholder="e.g. Homemade Sandwich"
                      value={quickAddFood.name}
                      onChange={(e) => setQuickAddFood({...quickAddFood, name: e.target.value})}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-text-secondary mb-1">Calories</label>
                      <input 
                        type="number" 
                        className="w-full p-3 rounded bg-dark border border-gray-700 focus:border-primary outline-none"
                        placeholder="e.g. 350"
                        value={quickAddFood.calories}
                        onChange={(e) => setQuickAddFood({...quickAddFood, calories: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-text-secondary mb-1">Serving</label>
                      <input 
                        type="text" 
                        className="w-full p-3 rounded bg-dark border border-gray-700 focus:border-primary outline-none"
                        placeholder="e.g. 1 sandwich"
                        value={quickAddFood.serving}
                        onChange={(e) => setQuickAddFood({...quickAddFood, serving: e.target.value})}
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-text-secondary mb-1">Protein (g)</label>
                      <input 
                        type="number" 
                        className="w-full p-3 rounded bg-dark border border-gray-700 focus:border-primary outline-none"
                        placeholder="e.g. 15"
                        value={quickAddFood.protein}
                        onChange={(e) => setQuickAddFood({...quickAddFood, protein: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-text-secondary mb-1">Carbs (g)</label>
                      <input 
                        type="number" 
                        className="w-full p-3 rounded bg-dark border border-gray-700 focus:border-primary outline-none"
                        placeholder="e.g. 40"
                        value={quickAddFood.carbs}
                        onChange={(e) => setQuickAddFood({...quickAddFood, carbs: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-text-secondary mb-1">Fat (g)</label>
                      <input 
                        type="number" 
                        className="w-full p-3 rounded bg-dark border border-gray-700 focus:border-primary outline-none"
                        placeholder="e.g. 12"
                        value={quickAddFood.fat}
                        onChange={(e) => setQuickAddFood({...quickAddFood, fat: e.target.value})}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-text-secondary mb-1">Meal</label>
                    <select 
                      className="w-full p-3 rounded bg-dark border border-gray-700 focus:border-primary outline-none"
                      value={selectedMealType}
                      onChange={(e) => setSelectedMealType(e.target.value)}
                    >
                      {mealTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>
                </div>
              )}
              
              <div className="flex space-x-3 mt-6">
                <button 
                  className="btn-primary flex-1"
                  onClick={selectedFood ? addFoodToMeal : addQuickFood}
                  disabled={isAddingFood}
                >
                  {isAddingFood ? (
                    <span className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Adding...
                    </span>
                  ) : (
                    `Add to ${selectedMealType}`
                  )}
                </button>
                <button 
                  className="btn-secondary flex-1"
                  onClick={() => {
                    setShowAddFoodModal(false);
                    setSelectedFood(null);
                    // Reset quick add form when closing
                    setQuickAddFood({
                      name: '',
                      calories: '',
                      serving: '',
                      protein: '',
                      carbs: '',
                      fat: ''
                    });
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Edit Nutrition Modal */}
      {showNutritionModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-4">Edit Nutrition Goals</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-text-secondary mb-1">Daily Calorie Goal</label>
                  <input 
                    type="number" 
                    className="w-full p-3 rounded bg-dark border border-gray-700 focus:border-primary outline-none"
                    value={tempGoals.calories}
                    onChange={(e) => {
                      const calories = parseInt(e.target.value) || 0;
                      
                      // Calculate macros based on current percentages
                      const protein = Math.round((calories * tempMacroRatios.protein / 100) / 4);
                      const carbs = Math.round((calories * tempMacroRatios.carbs / 100) / 4);
                      const fat = Math.round((calories * tempMacroRatios.fat / 100) / 9);
                      
                      setTempGoals({calories, protein, carbs, fat});
                    }}
                  />
                  {tempGoals.calories < 1200 && (
                    <p className="text-red-500 text-xs mt-1">Warning: Calorie goal is very low</p>
                  )}
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-text-secondary mb-1">Protein (g)</label>
                    <input 
                      type="number" 
                      className={`w-full p-3 rounded bg-dark border ${tempMacroRatios.protein < 10 || tempMacroRatios.protein > 35 ? 'border-red-500' : 'border-gray-700'} focus:border-primary outline-none`}
                      value={tempGoals.protein}
                      onChange={(e) => {
                        const protein = parseInt(e.target.value) || 0;
                        
                        // Calculate calories from protein
                        const proteinCalories = protein * 4;
                        
                        // Calculate new percentages
                        const totalCalories = proteinCalories + (tempGoals.carbs * 4) + (tempGoals.fat * 9);
                        const proteinPercentage = Math.round((proteinCalories / totalCalories) * 100);
                        const carbsPercentage = Math.round(((tempGoals.carbs * 4) / totalCalories) * 100);
                        const fatPercentage = 100 - proteinPercentage - carbsPercentage;
                        
                        setTempGoals({...tempGoals, protein, calories: totalCalories});
                        setTempMacroRatios({protein: proteinPercentage, carbs: carbsPercentage, fat: fatPercentage});
                      }}
                    />
                    {tempMacroRatios.protein < 10 && (
                      <p className="text-red-500 text-xs mt-1">Low protein (min 10%)</p>
                    )}
                    {tempMacroRatios.protein > 35 && (
                      <p className="text-red-500 text-xs mt-1">High protein (max 35%)</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-text-secondary mb-1">Carbs (g)</label>
                    <input 
                      type="number" 
                      className={`w-full p-3 rounded bg-dark border ${tempMacroRatios.carbs < 45 || tempMacroRatios.carbs > 65 ? 'border-red-500' : 'border-gray-700'} focus:border-primary outline-none`}
                      value={tempGoals.carbs}
                      onChange={(e) => {
                        const carbs = parseInt(e.target.value) || 0;
                        
                        // Calculate calories from carbs
                        const carbsCalories = carbs * 4;
                        
                        // Calculate new percentages
                        const totalCalories = (tempGoals.protein * 4) + carbsCalories + (tempGoals.fat * 9);
                        const proteinPercentage = Math.round(((tempGoals.protein * 4) / totalCalories) * 100);
                        const carbsPercentage = Math.round((carbsCalories / totalCalories) * 100);
                        const fatPercentage = 100 - proteinPercentage - carbsPercentage;
                        
                        setTempGoals({...tempGoals, carbs, calories: totalCalories});
                        setTempMacroRatios({protein: proteinPercentage, carbs: carbsPercentage, fat: fatPercentage});
                      }}
                    />
                    {tempMacroRatios.carbs < 45 && (
                      <p className="text-red-500 text-xs mt-1">Low carbs (min 45%)</p>
                    )}
                    {tempMacroRatios.carbs > 65 && (
                      <p className="text-red-500 text-xs mt-1">High carbs (max 65%)</p>
                    )}
                    {tempGoals.carbs < 130 && (
                      <p className="text-red-500 text-xs mt-1">Min 130g recommended</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-text-secondary mb-1">Fat (g)</label>
                    <input 
                      type="number" 
                      className={`w-full p-3 rounded bg-dark border ${tempMacroRatios.fat < 20 || tempMacroRatios.fat > 35 ? 'border-red-500' : 'border-gray-700'} focus:border-primary outline-none`}
                      value={tempGoals.fat}
                      onChange={(e) => {
                        const fat = parseInt(e.target.value) || 0;
                        
                        // Calculate calories from fat
                        const fatCalories = fat * 9;
                        
                        // Calculate new percentages
                        const totalCalories = (tempGoals.protein * 4) + (tempGoals.carbs * 4) + fatCalories;
                        const proteinPercentage = Math.round(((tempGoals.protein * 4) / totalCalories) * 100);
                        const carbsPercentage = Math.round(((tempGoals.carbs * 4) / totalCalories) * 100);
                        const fatPercentage = 100 - proteinPercentage - carbsPercentage;
                        
                        setTempGoals({...tempGoals, fat, calories: totalCalories});
                        setTempMacroRatios({protein: proteinPercentage, carbs: carbsPercentage, fat: fatPercentage});
                      }}
                    />
                    {tempMacroRatios.fat < 20 && (
                      <p className="text-red-500 text-xs mt-1">Low fat (min 20%)</p>
                    )}
                    {tempMacroRatios.fat > 35 && (
                      <p className="text-red-500 text-xs mt-1">High fat (max 35%)</p>
                    )}
                  </div>
                </div>
                
                {/* Calculated vs Target Calories */}
                <div className="mt-2">
                  <p className="text-sm">
                    Calculated calories: {Math.round((tempGoals.protein * 4) + (tempGoals.carbs * 4) + (tempGoals.fat * 9))}
                    {Math.abs(tempGoals.calories - ((tempGoals.protein * 4) + (tempGoals.carbs * 4) + (tempGoals.fat * 9))) > 10 && (
                      <span className="text-yellow-500 ml-2">
                        (Differs from target by {Math.abs(tempGoals.calories - ((tempGoals.protein * 4) + (tempGoals.carbs * 4) + (tempGoals.fat * 9)))} calories)
                      </span>
                    )}
                  </p>
                </div>
                
                <div className="pt-4">
                  <h3 className="font-medium mb-3">Macronutrient Ratio</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-text-secondary mb-1">
                        <span className={tempMacroRatios.protein < 10 || tempMacroRatios.protein > 35 ? 'text-red-500' : ''}>
                          Protein: {tempMacroRatios.protein}%
                        </span>
                        <span className="text-xs ml-2 text-gray-400">(Recommended: 10-35%)</span>
                      </label>
                      <input 
                        type="range" 
                        min="0" 
                        max="100" 
                        className="w-full"
                        value={tempMacroRatios.protein}
                        onChange={(e) => {
                          const protein = parseInt(e.target.value);
                          const remaining = 100 - protein;
                          const carbs = Math.round((tempMacroRatios.carbs / (tempMacroRatios.carbs + tempMacroRatios.fat)) * remaining);
                          const fat = 100 - protein - carbs;
                          
                          // Update macro ratios
                          setTempMacroRatios({protein, carbs, fat});
                          
                          // Update gram values based on new percentages
                          const newProtein = Math.round((tempGoals.calories * protein / 100) / 4);
                          const newCarbs = Math.round((tempGoals.calories * carbs / 100) / 4);
                          const newFat = Math.round((tempGoals.calories * fat / 100) / 9);
                          
                          setTempGoals({...tempGoals, protein: newProtein, carbs: newCarbs, fat: newFat});
                        }}
                      />
                    </div>
                    <div>
                      <label className="block text-text-secondary mb-1">
                        <span className={tempMacroRatios.carbs < 45 || tempMacroRatios.carbs > 65 ? 'text-red-500' : ''}>
                          Carbs: {tempMacroRatios.carbs}%
                        </span>
                        <span className="text-xs ml-2 text-gray-400">(Recommended: 45-65%)</span>
                      </label>
                      <input 
                        type="range" 
                        min="0" 
                        max="100" 
                        className="w-full"
                        value={tempMacroRatios.carbs}
                        onChange={(e) => {
                          const carbs = parseInt(e.target.value);
                          const remaining = 100 - tempMacroRatios.protein;
                          const newCarbs = Math.min(carbs, remaining);
                          const fat = 100 - tempMacroRatios.protein - newCarbs;
                          
                          // Update macro ratios
                          setTempMacroRatios({...tempMacroRatios, carbs: newCarbs, fat});
                          
                          // Update gram values based on new percentages
                          const newCarbsGrams = Math.round((tempGoals.calories * newCarbs / 100) / 4);
                          const newFatGrams = Math.round((tempGoals.calories * fat / 100) / 9);
                          
                          setTempGoals({...tempGoals, carbs: newCarbsGrams, fat: newFatGrams});
                        }}
                      />
                    </div>
                    <div>
                      <label className="block text-text-secondary mb-1">
                        <span className={tempMacroRatios.fat < 20 || tempMacroRatios.fat > 35 ? 'text-red-500' : ''}>
                          Fat: {tempMacroRatios.fat}%
                        </span>
                        <span className="text-xs ml-2 text-gray-400">(Recommended: 20-35%)</span>
                      </label>
                      <input 
                        type="range" 
                        min="0" 
                        max="100" 
                        className="w-full"
                        value={tempMacroRatios.fat}
                        onChange={(e) => {
                          const fat = parseInt(e.target.value);
                          const remaining = 100 - tempMacroRatios.protein;
                          const newFat = Math.min(fat, remaining);
                          const carbs = 100 - tempMacroRatios.protein - newFat;
                          
                          // Update macro ratios
                          setTempMacroRatios({...tempMacroRatios, carbs, fat: newFat});
                          
                          // Update gram values based on new percentages
                          const newCarbsGrams = Math.round((tempGoals.calories * carbs / 100) / 4);
                          const newFatGrams = Math.round((tempGoals.calories * newFat / 100) / 9);
                          
                          setTempGoals({...tempGoals, carbs: newCarbsGrams, fat: newFatGrams});
                        }}
                      />
                    </div>
                  </div>
                  
                  <div className="flex h-4 rounded-full overflow-hidden mt-4">
                    <div 
                      className={`${tempMacroRatios.protein < 10 || tempMacroRatios.protein > 35 ? 'bg-red-500' : 'bg-blue-500'}`} 
                      style={{ width: `${tempMacroRatios.protein}%` }}
                    ></div>
                    <div 
                      className={`${tempMacroRatios.carbs < 45 || tempMacroRatios.carbs > 65 ? 'bg-red-500' : 'bg-green-500'}`} 
                      style={{ width: `${tempMacroRatios.carbs}%` }}
                    ></div>
                    <div 
                      className={`${tempMacroRatios.fat < 20 || tempMacroRatios.fat > 35 ? 'bg-red-500' : 'bg-yellow-500'}`} 
                      style={{ width: `${tempMacroRatios.fat}%` }}
                    ></div>
                  </div>
                  
                  {/* Contextual Tips */}
                  <div className="mt-4 text-sm text-gray-400 border-t border-gray-700 pt-3">
                    <h4 className="font-medium text-white mb-2">Nutrition Tips</h4>
                    {tempMacroRatios.protein < 15 && (
                      <p className="mb-1">• Consider increasing protein for better muscle recovery and satiety</p>
                    )}
                    {tempMacroRatios.protein > 35 && (
                      <p className="mb-1">• Very high protein intake may stress kidneys long-term</p>
                    )}
                    {tempMacroRatios.carbs < 40 && (
                      <p className="mb-1">• Low carb diets may reduce exercise performance for some individuals</p>
                    )}
                    {tempMacroRatios.carbs > 65 && (
                      <p className="mb-1">• High carb diets work best with regular physical activity</p>
                    )}
                    {tempMacroRatios.fat < 20 && (
                      <p className="mb-1">• Fat is essential for hormone production and nutrient absorption</p>
                    )}
                    {tempGoals.calories < 1500 && (
                      <p className="mb-1">• Very low calorie diets should be supervised by healthcare professionals</p>
                    )}
                    {tempGoals.calories > 3000 && (
                      <p className="mb-1">• Higher calorie goals are appropriate for athletes and very active individuals</p>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="flex space-x-3 mt-6">
                <button 
                  className="btn-primary flex-1"
                  onClick={() => {
                    setDailyGoals(tempGoals);
                    setMacroRatios(tempMacroRatios);
                    localStorage.setItem('calorieCounterGoals', JSON.stringify(tempGoals));
                    setShowNutritionModal(false);
                  }}
                >
                  Save Changes
                </button>
                <button 
                  className="btn-secondary flex-1"
                  onClick={() => {
                    setTempGoals({...dailyGoals});
                    setTempMacroRatios({...macroRatios});
                    setShowNutritionModal(false);
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}