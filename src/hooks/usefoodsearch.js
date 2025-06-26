// src/hooks/useFoodSearch.js
import { useState, useCallback, useRef } from 'react';
import USDAApiService from '../services/usda-api';

export const useFoodSearch = () => {
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);
  
  // Remove the API key parameter - service now uses secure backend
  const usdaService = useRef(new USDAApiService());
  const abortController = useRef(null);

  const searchFoods = useCallback(async (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      setHasSearched(false);
      return;
    }

    // Cancel previous request
    if (abortController.current) {
      abortController.current.abort();
    }
    abortController.current = new AbortController();

    setIsLoading(true);
    setError(null);
    setHasSearched(true);

    try {
      // Add delay for better UX (debouncing)
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const results = await usdaService.current.searchFoods(query, 20);
      
      // Debug the API response structure
      console.log('USDA API Response:', results);
      
      // Process USDA API results to match your application's format
      let usdaFoods = [];
      
      // Helper function to extract nutrient value safely
      const getNutrientValue = (nutrients, nameOrNumber) => {
        if (!nutrients || !Array.isArray(nutrients)) return 0;
        
        const nutrient = nutrients.find(n => {
          if (typeof nameOrNumber === 'string') {
            return n.nutrientName === nameOrNumber || n.nutrientNumber === nameOrNumber;
          }
          return false;
        });
        
        return nutrient?.value || 0;
      };
      
      // Helper function to extract multiple nutrient values by name or number
      const getNutrientValues = (nutrients) => {
        if (!nutrients || !Array.isArray(nutrients)) return {};
        
        // Mapping of nutrient names/numbers to our standardized property names
        const nutrientMap = {
          // Macronutrients
          'Energy': 'calories',
          '208': 'calories',
          'Protein': 'protein',
          '203': 'protein',
          'Carbohydrate, by difference': 'carbs',
          '205': 'carbs',
          'Total lipid (fat)': 'fat',
          '204': 'fat',
          'Fiber, total dietary': 'fiber',
          '291': 'fiber',
          'Sugars, total including NLEA': 'sugars',
          '269': 'sugars',
          'Fatty acids, total saturated': 'saturatedFat',
          '606': 'saturatedFat',
          'Fatty acids, total monounsaturated': 'monounsaturatedFat',
          '645': 'monounsaturatedFat',
          'Fatty acids, total polyunsaturated': 'polyunsaturatedFat',
          '646': 'polyunsaturatedFat',
          'Fatty acids, total trans': 'transFat',
          '605': 'transFat',
          
          // Vitamins
          'Vitamin A, RAE': 'vitaminA',
          '320': 'vitaminA',
          'Vitamin C, total ascorbic acid': 'vitaminC',
          '401': 'vitaminC',
          'Vitamin D (D2 + D3)': 'vitaminD',
          '328': 'vitaminD',
          'Vitamin E (alpha-tocopherol)': 'vitaminE',
          '323': 'vitaminE',
          'Vitamin K (phylloquinone)': 'vitaminK',
          '430': 'vitaminK',
          'Thiamin': 'vitaminB1',
          '404': 'vitaminB1',
          'Riboflavin': 'vitaminB2',
          '405': 'vitaminB2',
          'Niacin': 'vitaminB3',
          '406': 'vitaminB3',
          'Pantothenic acid': 'vitaminB5',
          '410': 'vitaminB5',
          'Vitamin B-6': 'vitaminB6',
          '415': 'vitaminB6',
          'Folate, DFE': 'vitaminB9',
          '417': 'vitaminB9',
          'Vitamin B-12': 'vitaminB12',
          '418': 'vitaminB12',
          
          // Minerals
          'Calcium, Ca': 'calcium',
          '301': 'calcium',
          'Iron, Fe': 'iron',
          '303': 'iron',
          'Magnesium, Mg': 'magnesium',
          '304': 'magnesium',
          'Phosphorus, P': 'phosphorus',
          '305': 'phosphorus',
          'Potassium, K': 'potassium',
          '306': 'potassium',
          'Sodium, Na': 'sodium',
          '307': 'sodium',
          'Zinc, Zn': 'zinc',
          '309': 'zinc',
          'Copper, Cu': 'copper',
          '312': 'copper',
          'Manganese, Mn': 'manganese',
          '315': 'manganese',
          'Selenium, Se': 'selenium',
          '317': 'selenium',
          
          // Other components
          'Cholesterol': 'cholesterol',
          '601': 'cholesterol',
          'Caffeine': 'caffeine',
          '262': 'caffeine',
          'Alcohol, ethyl': 'alcohol',
          '221': 'alcohol',
          'Water': 'water',
          '255': 'water'
        };
        
        // Extract all available nutrients
        const extractedNutrients = {};
        
        nutrients.forEach(nutrient => {
          const name = nutrient.nutrientName;
          const number = nutrient.nutrientNumber;
          const value = nutrient.value || 0;
          
          // Check if this nutrient is in our map
          for (const [key, propName] of Object.entries(nutrientMap)) {
            if (name === key || number === key) {
              extractedNutrients[propName] = value;
              break;
            }
          }
          
          // Special handling for amino acids
          if (name.includes('amino acid') || (number >= '500' && number <= '520')) {
            if (!extractedNutrients.aminoAcids) {
              extractedNutrients.aminoAcids = {};
            }
            // Extract amino acid name from the full nutrient name
            const aminoAcidName = name.replace('Amino acid, ', '').split(',')[0];
            extractedNutrients.aminoAcids[aminoAcidName] = value;
          }
          
          // Special handling for fatty acids
          if (name.includes('fatty acid') || 
              (number >= '607' && number <= '631') ||
              (number >= '652' && number <= '676')) {
            if (!extractedNutrients.fattyAcids) {
              extractedNutrients.fattyAcids = {};
            }
            // Extract fatty acid name from the full nutrient name
            const fattyAcidName = name.replace('Fatty acid, ', '').split(',')[0];
            extractedNutrients.fattyAcids[fattyAcidName] = value;
          }
        });
        
        return extractedNutrients;
      };
      
      // Check for different possible response structures
      if (results && results.foods && Array.isArray(results.foods)) {
        console.log('Found foods array in results.foods, length:', results.foods.length);
        
        usdaFoods = results.foods.map(food => {
          // Extract nutrients safely
          const nutrients = food.foodNutrients || [];
          
          // Get basic nutrients
          const basicNutrients = {
            calories: getNutrientValue(nutrients, '208') || getNutrientValue(nutrients, 'Energy') || 0,
            protein: getNutrientValue(nutrients, '203') || getNutrientValue(nutrients, 'Protein') || 0,
            carbs: getNutrientValue(nutrients, '205') || getNutrientValue(nutrients, 'Carbohydrate, by difference') || 0,
            fat: getNutrientValue(nutrients, '204') || getNutrientValue(nutrients, 'Total lipid (fat)') || 0
          };
          
          // Get all detailed nutrients
          const detailedNutrients = getNutrientValues(nutrients);
          
          return {
            fdcId: food.fdcId || `usda-${Math.random().toString(36).substring(2, 10)}`,
            name: food.description || food.lowercaseDescription || food.foodCode || 'Unknown Food',
            description: food.description || food.lowercaseDescription || food.foodCode || 'Unknown Food',
            serving: food.servingSize ? `${food.servingSize} ${food.servingSizeUnit || 'g'}` : '100g',
            source: 'USDA',
            brand: food.brandOwner || food.brandName || 'USDA Database',
            
            // Basic nutrients (always required)
            calories: basicNutrients.calories,
            protein: basicNutrients.protein,
            carbs: basicNutrients.carbs,
            fat: basicNutrients.fat,
            
            // Detailed macronutrients
            fiber: detailedNutrients.fiber || 0,
            sugars: detailedNutrients.sugars || 0,
            saturatedFat: detailedNutrients.saturatedFat || 0,
            monounsaturatedFat: detailedNutrients.monounsaturatedFat || 0,
            polyunsaturatedFat: detailedNutrients.polyunsaturatedFat || 0,
            transFat: detailedNutrients.transFat || 0,
            
            // Vitamins
            vitaminA: detailedNutrients.vitaminA || 0,
            vitaminC: detailedNutrients.vitaminC || 0,
            vitaminD: detailedNutrients.vitaminD || 0,
            vitaminE: detailedNutrients.vitaminE || 0,
            vitaminK: detailedNutrients.vitaminK || 0,
            vitaminB1: detailedNutrients.vitaminB1 || 0,
            vitaminB2: detailedNutrients.vitaminB2 || 0,
            vitaminB3: detailedNutrients.vitaminB3 || 0,
            vitaminB5: detailedNutrients.vitaminB5 || 0,
            vitaminB6: detailedNutrients.vitaminB6 || 0,
            vitaminB9: detailedNutrients.vitaminB9 || 0,
            vitaminB12: detailedNutrients.vitaminB12 || 0,
            
            // Minerals
            calcium: detailedNutrients.calcium || 0,
            iron: detailedNutrients.iron || 0,
            magnesium: detailedNutrients.magnesium || 0,
            phosphorus: detailedNutrients.phosphorus || 0,
            potassium: detailedNutrients.potassium || 0,
            sodium: detailedNutrients.sodium || 0,
            zinc: detailedNutrients.zinc || 0,
            copper: detailedNutrients.copper || 0,
            manganese: detailedNutrients.manganese || 0,
            selenium: detailedNutrients.selenium || 0,
            
            // Other components
            cholesterol: detailedNutrients.cholesterol || 0,
            caffeine: detailedNutrients.caffeine || 0,
            alcohol: detailedNutrients.alcohol || 0,
            water: detailedNutrients.water || 0,
            
            // Advanced nutrition
            aminoAcids: detailedNutrients.aminoAcids || null,
            fattyAcids: detailedNutrients.fattyAcids || null
          };
        });
      } else if (results && Array.isArray(results)) {
        // If the response is directly an array
        console.log('Found direct array in results, length:', results.length);
        
        usdaFoods = results.map(food => {
          // Extract nutrients safely
          const nutrients = food.foodNutrients || [];
          
          // Get basic nutrients
          const basicNutrients = {
            calories: getNutrientValue(nutrients, '208') || getNutrientValue(nutrients, 'Energy') || 0,
            protein: getNutrientValue(nutrients, '203') || getNutrientValue(nutrients, 'Protein') || 0,
            carbs: getNutrientValue(nutrients, '205') || getNutrientValue(nutrients, 'Carbohydrate, by difference') || 0,
            fat: getNutrientValue(nutrients, '204') || getNutrientValue(nutrients, 'Total lipid (fat)') || 0
          };
          
          // Get all detailed nutrients
          const detailedNutrients = getNutrientValues(nutrients);
          
          return {
            fdcId: food.fdcId || `usda-${Math.random().toString(36).substring(2, 10)}`,
            name: food.description || food.lowercaseDescription || food.foodCode || 'Unknown Food',
            description: food.description || food.lowercaseDescription || food.foodCode || 'Unknown Food',
            serving: food.servingSize ? `${food.servingSize} ${food.servingSizeUnit || 'g'}` : '100g',
            source: 'USDA',
            brand: food.brandOwner || food.brandName || 'USDA Database',
            
            // Basic nutrients (always required)
            calories: basicNutrients.calories,
            protein: basicNutrients.protein,
            carbs: basicNutrients.carbs,
            fat: basicNutrients.fat,
            
            // Detailed macronutrients
            fiber: detailedNutrients.fiber || 0,
            sugars: detailedNutrients.sugars || 0,
            saturatedFat: detailedNutrients.saturatedFat || 0,
            monounsaturatedFat: detailedNutrients.monounsaturatedFat || 0,
            polyunsaturatedFat: detailedNutrients.polyunsaturatedFat || 0,
            transFat: detailedNutrients.transFat || 0,
            
            // Vitamins
            vitaminA: detailedNutrients.vitaminA || 0,
            vitaminC: detailedNutrients.vitaminC || 0,
            vitaminD: detailedNutrients.vitaminD || 0,
            vitaminE: detailedNutrients.vitaminE || 0,
            vitaminK: detailedNutrients.vitaminK || 0,
            vitaminB1: detailedNutrients.vitaminB1 || 0,
            vitaminB2: detailedNutrients.vitaminB2 || 0,
            vitaminB3: detailedNutrients.vitaminB3 || 0,
            vitaminB5: detailedNutrients.vitaminB5 || 0,
            vitaminB6: detailedNutrients.vitaminB6 || 0,
            vitaminB9: detailedNutrients.vitaminB9 || 0,
            vitaminB12: detailedNutrients.vitaminB12 || 0,
            
            // Minerals
            calcium: detailedNutrients.calcium || 0,
            iron: detailedNutrients.iron || 0,
            magnesium: detailedNutrients.magnesium || 0,
            phosphorus: detailedNutrients.phosphorus || 0,
            potassium: detailedNutrients.potassium || 0,
            sodium: detailedNutrients.sodium || 0,
            zinc: detailedNutrients.zinc || 0,
            copper: detailedNutrients.copper || 0,
            manganese: detailedNutrients.manganese || 0,
            selenium: detailedNutrients.selenium || 0,
            
            // Other components
            cholesterol: detailedNutrients.cholesterol || 0,
            caffeine: detailedNutrients.caffeine || 0,
            alcohol: detailedNutrients.alcohol || 0,
            water: detailedNutrients.water || 0,
            
            // Advanced nutrition
            aminoAcids: detailedNutrients.aminoAcids || null,
            fattyAcids: detailedNutrients.fattyAcids || null
          };
        });
      } else {
        // Log the exact structure for debugging
        console.error('Unexpected API response format:', JSON.stringify(results, null, 2));
        throw new Error('Unexpected API response format');
      }
      
      // Combine with local database results
      const localResults = searchLocalFoods(query);
      const combinedResults = [...localResults, ...usdaFoods];
      
      setSearchResults(combinedResults);
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.error('Search error:', error);
        setError('Failed to search foods. Please try again.');
        // Fallback to local search only
        setSearchResults(searchLocalFoods(query));
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getFoodDetails = useCallback(async (fdcId) => {
    try {
      setIsLoading(true);
      const details = await usdaService.current.getFoodDetails(fdcId);
      return details;
    } catch (error) {
      console.error('Get food details error:', error);
      throw new Error('Failed to get food details');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearSearch = useCallback(() => {
    setSearchResults([]);
    setHasSearched(false);
    setError(null);
  }, []);

  return {
    searchResults,
    isLoading,
    error,
    hasSearched,
    searchFoods,
    getFoodDetails,
    clearSearch
  };
};

// Helper function for local database search with enhanced nutrition data
const searchLocalFoods = (query) => {
  const foodDatabase = [
    {
      id: 'local-1',
      name: 'Apple',
      description: 'Fresh apple',
      calories: 52,
      protein: 0.3,
      carbs: 14,
      fat: 0.2,
      serving: '100g',
      // Detailed macronutrients
      fiber: 2.4,
      sugars: 10.4,
      saturatedFat: 0.03,
      monounsaturatedFat: 0.01,
      polyunsaturatedFat: 0.05,
      transFat: 0,
      // Vitamins
      vitaminA: 3,
      vitaminC: 4.6,
      vitaminD: 0,
      vitaminE: 0.18,
      vitaminK: 2.2,
      vitaminB1: 0.02,
      vitaminB2: 0.03,
      vitaminB3: 0.09,
      vitaminB5: 0.06,
      vitaminB6: 0.04,
      vitaminB9: 3,
      vitaminB12: 0,
      // Minerals
      calcium: 6,
      iron: 0.12,
      magnesium: 5,
      phosphorus: 11,
      potassium: 107,
      sodium: 1,
      zinc: 0.04,
      copper: 0.03,
      manganese: 0.04,
      selenium: 0,
      // Other components
      cholesterol: 0,
      caffeine: 0,
      alcohol: 0,
      water: 85.6
    },
    {
      id: 'local-2',
      name: 'Chicken Breast',
      description: 'Grilled chicken breast',
      calories: 165,
      protein: 31,
      carbs: 0,
      fat: 3.6,
      serving: '100g (cooked)',
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
      id: 'local-3',
      name: 'Salmon',
      description: 'Atlantic salmon, cooked',
      calories: 206,
      protein: 22,
      carbs: 0,
      fat: 13,
      serving: '100g (cooked)',
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
    // ... rest of your local foods can be added with similar detailed nutrition
  ];
  
  console.log('Searching local foods for:', query);
  const results = foodDatabase.filter(food =>
    food.name.toLowerCase().includes(query.toLowerCase())
  ).map(food => ({ ...food, source: 'Local' }));
  
  console.log('Local search results:', results.length);
  return results;
};
