// src/utils/api-cache.js

class APICache {
  constructor(maxAge = 5 * 60 * 1000) { // 5 minutes default
    this.cache = new Map();
    this.maxAge = maxAge;
  }

  set(key, value) {
    this.cache.set(key, {
      value,
      timestamp: Date.now()
    });
  }

  get(key) {
    const item = this.cache.get(key);
    if (!item) return null;
    
    if (Date.now() - item.timestamp > this.maxAge) {
      this.cache.delete(key);
      return null;
    }
    
    return item.value;
  }

  clear() {
    this.cache.clear();
  }
}

// Create cache instances with different expiration times
const searchCache = new APICache(10 * 60 * 1000); // 10 minutes for search results
const detailsCache = new APICache(60 * 60 * 1000); // 1 hour for food details
const userDataCache = new APICache(30 * 60 * 1000); // 30 minutes for user data
const youtubeCache = new APICache(24 * 60 * 60 * 1000); // 24 hours for YouTube video results

export { APICache, searchCache, detailsCache, userDataCache, youtubeCache };
  