import { useState, useCallback, useRef } from 'react';
import USDAApiService from '../services/usda-api';

export const useFoodSearch = () => {
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);
  
  const usdaService = useRef(new USDAApiService(process.env.NEXT_PUBLIC_USDA_API_KEY));
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
    
    // We'll let the USDAApiService handle API key validation now

    try {
      // Add delay for better UX (debouncing)
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const results = await usdaService.current.searchFoods(query, 20);
      
      // Debug the API response structure
      console.log('USDA API Response:', results);
      console.log('Response type:', typeof results);
      console.log('Response keys:', results ? Object.keys(results) : 'No results');
      
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
      
      // Check for different possible response structures
      if (results && results.foods && Array.isArray(results.foods)) {
        console.log('Found foods array in results.foods, length:', results.foods.length);
        
        // Log the first food item to understand its structure
        if (results.foods.length > 0) {
          console.log('Sample food item structure:', JSON.stringify(results.foods[0], null, 2));
        }
        
        usdaFoods = results.foods.map(food => {
          // Extract nutrients safely
          const nutrients = food.foodNutrients || [];
          
          return {
            fdcId: food.fdcId || `usda-${Math.random().toString(36).substring(2, 10)}`,
            name: food.description || food.lowercaseDescription || food.foodCode || 'Unknown Food',
            description: food.description || food.lowercaseDescription || food.foodCode || 'Unknown Food',
            calories: getNutrientValue(nutrients, '208') || getNutrientValue(nutrients, 'Energy') || 0,
            protein: getNutrientValue(nutrients, '203') || getNutrientValue(nutrients, 'Protein') || 0,
            carbs: getNutrientValue(nutrients, '205') || getNutrientValue(nutrients, 'Carbohydrate, by difference') || 0,
            fat: getNutrientValue(nutrients, '204') || getNutrientValue(nutrients, 'Total lipid (fat)') || 0,
            serving: food.servingSize ? `${food.servingSize} ${food.servingSizeUnit || 'g'}` : '100g',
            source: 'USDA',
            brand: food.brandOwner || food.brandName || 'USDA Database'
          };
        });
      } else if (results && Array.isArray(results)) {
        // If the response is directly an array
        console.log('Found direct array in results, length:', results.length);
        
        // Log the first item to understand its structure
        if (results.length > 0) {
          console.log('Sample array item structure:', JSON.stringify(results[0], null, 2));
        }
        
        usdaFoods = results.map(food => {
          // Extract nutrients safely
          const nutrients = food.foodNutrients || [];
          
          return {
            fdcId: food.fdcId || `usda-${Math.random().toString(36).substring(2, 10)}`,
            name: food.description || food.lowercaseDescription || food.foodCode || 'Unknown Food',
            description: food.description || food.lowercaseDescription || food.foodCode || 'Unknown Food',
            calories: getNutrientValue(nutrients, '208') || getNutrientValue(nutrients, 'Energy') || 0,
            protein: getNutrientValue(nutrients, '203') || getNutrientValue(nutrients, 'Protein') || 0,
            carbs: getNutrientValue(nutrients, '205') || getNutrientValue(nutrients, 'Carbohydrate, by difference') || 0,
            fat: getNutrientValue(nutrients, '204') || getNutrientValue(nutrients, 'Total lipid (fat)') || 0,
            serving: food.servingSize ? `${food.servingSize} ${food.servingSizeUnit || 'g'}` : '100g',
            source: 'USDA',
            brand: food.brandOwner || food.brandName || 'USDA Database'
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

// Helper function for local database search
const searchLocalFoods = (query) => {
  // Local food database with sample foods
  const foodDatabase = [
    {
      id: 'local-1',
      name: 'Apple',
      description: 'Fresh apple',
      calories: 52,
      protein: 0.3,
      carbs: 14,
      fat: 0.2,
      serving: '100g'
    },
    {
      id: 'local-2',
      name: 'Banana',
      description: 'Fresh banana',
      calories: 89,
      protein: 1.1,
      carbs: 22.8,
      fat: 0.3,
      serving: '100g'
    },
    {
      id: 'local-3',
      name: 'Chicken Breast',
      description: 'Cooked chicken breast',
      calories: 165,
      protein: 31,
      carbs: 0,
      fat: 3.6,
      serving: '100g'
    },
    {
      id: 'local-4',
      name: 'Brown Rice',
      description: 'Cooked brown rice',
      calories: 112,
      protein: 2.6,
      carbs: 23.5,
      fat: 0.9,
      serving: '100g'
    },
    {
      id: 'local-5',
      name: 'Salmon',
      description: 'Cooked salmon fillet',
      calories: 206,
      protein: 22.1,
      carbs: 0,
      fat: 12.4,
      serving: '100g'
    }
  ];
  
  console.log('Searching local foods for:', query);
  const results = foodDatabase.filter(food =>
    food.name.toLowerCase().includes(query.toLowerCase())
  ).map(food => ({ ...food, source: 'Local' }));
  
  console.log('Local search results:', results.length);
  return results;
};
