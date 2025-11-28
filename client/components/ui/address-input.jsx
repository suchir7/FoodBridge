import { useState, useEffect, useRef } from 'react';
import { Input } from './input';
import { searchAddresses } from '@/lib/geocoding';
import { MapPin, Loader2 } from 'lucide-react';

export function AddressInput({
  value,
  onChange,
  placeholder = "Start typing an address...",
  className = "",
  onLocationSelect = null
}) {
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [inputValue, setInputValue] = useState(value || '');
  const inputRef = useRef(null);
  const suggestionsRef = useRef(null);

  // Update input value when prop changes
  useEffect(() => {
    setInputValue(value || '');
  }, [value]);

  // Handle input change
  const handleInputChange = (e) => {
    const query = e.target.value;
    setInputValue(query);
    onChange?.(query);
  };

  // Debounced search effect
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (inputValue.length >= 3) {
        console.log("⌨️ Debounced search triggering for:", inputValue);
        setIsLoading(true);
        try {
          const results = await searchAddresses(inputValue);
          console.log("✅ Search results received:", results);
          setSuggestions(results || []);
          setShowSuggestions(true);
        } catch (error) {
          console.error('Address search error:', error);
          setSuggestions([]);
        } finally {
          setIsLoading(false);
        }
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [inputValue]);

  // Handle suggestion selection
  const handleSuggestionSelect = (suggestion) => {
    try {
      setInputValue(suggestion.display_name);
      setShowSuggestions(false);
      setSuggestions([]);

      // Call the onChange with the full address
      onChange?.(suggestion.display_name);

      console.log("📍 AddressInput selected:", suggestion);
      // Call onLocationSelect with coordinates if provided
      if (onLocationSelect && suggestion.lat && suggestion.lng) {
        console.log("📍 Calling onLocationSelect with:", { lat: suggestion.lat, lng: suggestion.lng });
        onLocationSelect({
          address: suggestion.display_name,
          lat: suggestion.lat,
          lng: suggestion.lng
        });
      }
    } catch (error) {
      console.error('Error selecting suggestion:', error);
      // Fallback: just set the input value
      setInputValue(suggestion.display_name);
      onChange?.(suggestion.display_name);
    }
  };

  // Handle input focus
  const handleFocus = () => {
    if (suggestions.length > 0) {
      setShowSuggestions(true);
    }
  };

  // Handle click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target) &&
        inputRef.current &&
        !inputRef.current.contains(event.target)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative">
      <div className="relative">
        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onFocus={handleFocus}
          placeholder={placeholder}
          className={`pl-10 ${className}`}
        />
        {isLoading && (
          <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground" />
        )}
      </div>

      {showSuggestions && suggestions.length > 0 && (
        console.log("🎨 Rendering dropdown with items:", suggestions.length) ||
        <div
          ref={suggestionsRef}
          className="absolute z-[1000] w-full mt-1 bg-background border border-border rounded-md shadow-lg max-h-60 overflow-y-auto"
        >
          {suggestions.map((suggestion) => (
            <button
              key={suggestion.id}
              onClick={() => handleSuggestionSelect(suggestion)}
              className="w-full px-4 py-3 text-left hover:bg-muted focus:bg-muted focus:outline-none border-b border-border last:border-b-0"
            >
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">
                    {suggestion.display_name.split(',')[0]}
                  </div>
                  <div className="text-xs text-muted-foreground truncate">
                    {suggestion.display_name.split(',').slice(1).join(',').trim()}
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {showSuggestions && suggestions.length === 0 && inputValue.length >= 3 && !isLoading && (
        <div className="absolute z-50 w-full mt-1 bg-background border border-border rounded-md shadow-lg p-4 text-center text-sm text-muted-foreground">
          No addresses found. Try a different search term.
        </div>
      )}
    </div>
  );
}
