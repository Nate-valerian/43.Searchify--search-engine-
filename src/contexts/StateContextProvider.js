import { createContext, useContext, useState, useCallback, useMemo } from 'react';

const StateContext = createContext();

export const StateContextProvider = ({ children }) => {
  const [results, setResults] = useState({});
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Your Google Custom Search API credentials
  const API_KEY = 'AIzaSyAHfyOzcLsO9SG07UeTvkQh66WxzMDQt1k'; // Replace with your API key
  const SEARCH_ENGINE_ID = 'd23efc9f8d22a42c9'; // Your Search Engine ID

  const getResults = useCallback(async (query, type = 'search') => {
    if (!query.trim()) return;

    setLoading(true);

    try {
      let url = '';

      // Different endpoints for different search types
      switch(type) {
        case 'images':
          url = `https://www.googleapis.com/customsearch/v1?key=${API_KEY}&cx=${SEARCH_ENGINE_ID}&q=${encodeURIComponent(query)}&searchType=image`;
          break;
        case 'news':
          url = `https://www.googleapis.com/customsearch/v1?key=${API_KEY}&cx=${SEARCH_ENGINE_ID}&q=${encodeURIComponent(query)}`;
          // Note: News search might require different setup
          break;
        default:
          url = `https://www.googleapis.com/customsearch/v1?key=${API_KEY}&cx=${SEARCH_ENGINE_ID}&q=${encodeURIComponent(query)}`;
      }

      const res = await fetch(url);

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();

      // Transform data to match your component structure
      const transformedData = {
        results: data.items?.map(item => ({
          link: item.link,
          title: item.title,
          snippet: item.snippet,
          // Add image for image results
          ...(item.image && { image: { src: item.image.thumbnailLink } })
        })) || [],
        image_results: data.items?.filter(item => item.image).map(item => ({
          image: { src: item.image.thumbnailLink },
          link: { href: item.link, title: item.title }
        })) || []
      };

      setResults(transformedData);
    } catch (error) {
      console.error('Error fetching results:', error);
      setResults({});
    } finally {
      setLoading(false);
    }
  }, []);

  const contextValue = useMemo(() => ({
    getResults,
    results,
    setResults,
    searchTerm,
    setSearchTerm,
    loading,
  }), [getResults, results, searchTerm, loading]);

  return (
    <StateContext.Provider value={contextValue}>
      {children}
    </StateContext.Provider>
  );
};

export const useStateContext = () => useContext(StateContext);

