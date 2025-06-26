// src/services/usda-api.js
class USDAApiService {
  constructor() {
    console.log('USDA API service initialized with secure backend calls')
  }

  async searchFoods(query, pageSize = 20) {
    try {
      console.log('Making secure USDA search request for:', query)
      
      const response = await fetch('/api/usda-search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query, pageSize })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to search foods')
      }

      const data = await response.json()
      console.log('USDA search response received')
      return data
      
    } catch (error) {
      console.error('USDA API search error:', error)
      throw error
    }
  }

  async getFoodDetails(fdcId) {
    try {
      console.log('Getting secure food details for ID:', fdcId)
      
      const response = await fetch('/api/usda-details', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ fdcId })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to get food details')
      }

      const data = await response.json()
      console.log('USDA food details received')
      return data
      
    } catch (error) {
      console.error('USDA API details error:', error)
      throw error
    }
  }
}

export default USDAApiService;
