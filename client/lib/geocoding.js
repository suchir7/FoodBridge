// Geocoding utilities using OpenStreetMap Nominatim API
const NOMINATIM_BASE_URL = 'https://nominatim.openstreetmap.org';

// Debounce function to limit API calls
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Search for addresses using Nominatim
export async function searchAddresses(query) {
  if (!query || query.length < 3) return [];
  
  try {
    const response = await fetch(
      `${NOMINATIM_BASE_URL}/search?` +
      new URLSearchParams({
        q: query,
        format: 'json',
        addressdetails: '1',
        limit: '5',
        countrycodes: 'us,ca,mx', // Focus on North America, adjust as needed
        'accept-language': 'en'
      })
    );
    
    if (!response.ok) {
      throw new Error('Geocoding service unavailable');
    }
    
    const data = await response.json();
    
    return data.map(item => ({
      id: item.place_id,
      display_name: item.display_name,
      address: item.display_name,
      lat: parseFloat(item.lat),
      lng: parseFloat(item.lon),
      type: item.type,
      importance: item.importance
    }));
  } catch (error) {
    console.error('Geocoding error:', error);
    return [];
  }
}

// Reverse geocoding - get address from coordinates
export async function getAddressFromCoords(lat, lng) {
  try {
    const response = await fetch(
      `${NOMINATIM_BASE_URL}/reverse?` +
      new URLSearchParams({
        lat: lat.toString(),
        lon: lng.toString(),
        format: 'json',
        addressdetails: '1',
        'accept-language': 'en'
      })
    );
    
    if (!response.ok) {
      throw new Error('Reverse geocoding service unavailable');
    }
    
    const data = await response.json();
    
    return {
      address: data.display_name,
      lat: parseFloat(data.lat),
      lng: parseFloat(data.lon),
      details: data.address
    };
  } catch (error) {
    console.error('Reverse geocoding error:', error);
    return null;
  }
}

// Debounced search function
export const debouncedSearchAddresses = debounce(searchAddresses, 300);
