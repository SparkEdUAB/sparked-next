import React, { useState } from 'react';
import { Dropdown, TextInput } from 'flowbite-react';

const Autocomplete = () => {
  const suggestions = [] as any[]; // we will add async suggestions here
  const [query, setQuery] = useState('');
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleChange = (e: any) => {
    const userInput = e.target.value;
    setQuery(userInput);

    const filtered = suggestions.filter((suggestion) => suggestion.toLowerCase().indexOf(userInput.toLowerCase()) > -1);

    setFilteredSuggestions(filtered);
    setShowSuggestions(true);
  };

  const handleClick = (suggestion: string) => {
    setQuery(suggestion);
    setFilteredSuggestions([]);
    setShowSuggestions(false);
  };

  return (
    <div className="relative w-full">
      <TextInput type="text" value={query} onChange={handleChange} placeholder="Search..." className="block w-full" />
      {showSuggestions && query && (
        <ul className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto dark:bg-gray-800 dark:border-gray-600">
          {filteredSuggestions.length ? (
            filteredSuggestions.map((suggestion, index) => (
              <li
                key={index}
                onClick={() => handleClick(suggestion)}
                className="px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-gray-200"
              >
                {suggestion}
              </li>
            ))
          ) : (
            <li className="px-4 py-2 cursor-pointer dark:text-gray-200">No suggestions available</li>
          )}
        </ul>
      )}
    </div>
  );
};

export default Autocomplete;
