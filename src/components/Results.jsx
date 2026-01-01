import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import ReactPlayer from 'react-player';
import { useStateContext } from '../contexts/StateContextProvider';
import { Loading } from './Loading';

export const Results = () => {
  const { results, loading, getResults, searchTerm } = useStateContext();
  const location = useLocation();

  console.log('Results component - results:', results);
  console.log('Results component - searchTerm:', searchTerm);
  console.log('Results component - pathname:', location.pathname);

  useEffect(() => {
    if (!searchTerm) return;

    let searchType = 'search';
    switch (location.pathname) {
      case '/search':
        searchType = 'search';
        break;
      case '/images':
        searchType = 'images';
        break;
      case '/news':
        searchType = 'news';
        break;
      case '/videos':
        searchType = 'videos';
        break;
      default:
        searchType = 'search';
    }

    getResults(searchTerm, searchType);
  }, [searchTerm, location.pathname, getResults]);

  if (loading) return <Loading />;

  switch (location.pathname) {
    case '/search':
      return (
        <div className="sm:px-56 flex flex-wrap justify-between space-y-6">
          {results?.results?.map(({ link, title, snippet }, index) => (
            <div key={index} className="md:w-2/5 w-full">
              <a href={link} target="_blank" rel="noreferrer">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {link.length > 30 ? link.substring(0, 30) + '...' : link}
                </p>
                <p className="text-lg hover:underline dark:text-blue-300 text-blue-700 font-medium">
                  {title}
                </p>
                {snippet && (
                  <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">
                    {snippet.length > 150 ? snippet.substring(0, 150) + '...' : snippet}
                  </p>
                )}
              </a>
            </div>
          ))}
        </div>
      );
    case '/images':
      return (
        <div className="flex flex-wrap justify-center items-center">
          {results?.image_results?.map(({ image, link: { href, title } }, index) => (
            <a href={href} target="_blank" key={index} rel="noreferrer" className="sm:p-3 p-5">
              <img
                src={image?.src}
                alt={title}
                loading="lazy"
                className="rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300"
              />
              <p className="sm:w-36 w-36 break-words text-sm mt-2 text-gray-700 dark:text-gray-300">
                {title}
              </p>
            </a>
          ))}
        </div>
      );
    case '/news':
      return (
        <div className="sm:px-56 flex flex-wrap justify-between items-center space-y-6">
          {results?.entries?.map(({ id, links, source, title, snippet }) => (
            <div key={id} className="md:w-2/5 w-full">
              <a href={links?.[0]?.href} target="_blank" rel="noreferrer" className="hover:underline">
                <p className="text-lg dark:text-blue-300 text-blue-700 font-medium">{title}</p>
                {snippet && (
                  <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">
                    {snippet.length > 120 ? snippet.substring(0, 120) + '...' : snippet}
                  </p>
                )}
              </a>
              <div className="flex gap-4 mt-2">
                <a
                  href={source?.href}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-gray-500 hover:text-blue-500 hover:underline"
                >
                  {source?.href}
                </a>
              </div>
            </div>
          ))}
        </div>
      );
    case '/videos':
      return (
        <div className="flex flex-wrap justify-center">
          {results?.results?.map((video, index) => (
            <div key={index} className="p-4">
              {video.additional_links?.[0]?.href ? (
                <ReactPlayer
                  url={video.additional_links[0].href}
                  controls
                  width="355px"
                  height="200px"
                  className="rounded-lg shadow-md"
                />
              ) : (
                <div className="w-355 h-200 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                  <p className="text-gray-500">Video unavailable</p>
                </div>
              )}
              {video.title && (
                <p className="mt-2 text-sm text-gray-700 dark:text-gray-300 max-w-355">
                  {video.title}
                </p>
              )}
            </div>
          ))}
        </div>
      );
    default:
      return (
        <div className="flex justify-center items-center h-64">
          <p className="text-gray-500 text-lg">Select a search type from the menu</p>
        </div>
      );
  }
};



// import { useEffect, useCallback } from 'react';
// import { useLocation } from 'react-router-dom';
// import ReactPlayer from 'react-player';

// import { useStateContext } from '../contexts/StateContextProvider';
// import { Loading } from './Loading';

// export const Results = () => {
//   const { results, loading, getResults, searchTerm, setResults } = useStateContext();
//   const location = useLocation();

//   // Create a memoized version of the fetch function
//   const fetchData = useCallback(async () => {
//     if (!searchTerm) return; // Don't fetch if no search term

//     try {
//       const data = await getResults(`/search/q=${searchTerm}&num=10`);
//       setResults(data);
//     } catch (error) {
//       console.error('Error fetching results:', error);
//       // Handle error appropriately
//     }
//   }, [searchTerm, getResults, setResults]);

//   useEffect(() => {
//     fetchData();
//   }, [fetchData]);

//   if (loading) return <Loading />;

//   switch (location.pathname) {
//     case '/search':
//       return (
//         <div className="sm:px-56 flex flex-wrap justify-between space-y-6">
//           {results?.results?.map(({ link, title }, index) => (
//             <div key={index} className="md:w-2/5 w-full">
//               <a href={link} target="_blank" rel="noreferrer">
//                 <p className="text-sm">{link.length > 30 ? link.substring(0, 30) : link}</p>
//                 <p className="text-lg hover:underline dark:text-blue-300 text-blue-700">{title}</p>
//               </a>
//             </div>
//           ))}
//         </div>
//       );
//     case '/images':
//       return (
//         <div className="flex flex-wrap justify-center items-center">
//           {results?.image_results?.map(({ image, link: { href, title } }, index) => (
//             <a href={href} target="_blank" key={index} rel="noreferrer" className="sm:p-3 p-5">
//               <img src={image?.src} alt={title} loading="lazy" />
//               <p className="sm:w-36 w-36 break-words text-sm mt-2">{title}</p>
//             </a>
//           ))}
//         </div>
//       );
//     case '/news':
//       return (
//         <div className="sm:px-56 flex flex-wrap justify-between items-center space-y-6">
//           {results?.entries?.map(({ id, links, source, title }) => (
//             <div key={id} className="md:w-2/5 w-full">
//               <a href={links?.[0].href} target="_blank" rel="noreferrer" className="hover:underline">
//                 <p className="text-lg dark:text-blue-300 text-blue-700">{title}</p>
//               </a>
//               <div className="flex gap-4">
//                 <a href={source?.href} target="_blank" rel="noreferrer" className="hover:underline hover:text-blue-300">
//                   {source?.href}
//                 </a>
//               </div>
//             </div>
//           ))}
//         </div>
//       );
//     case '/videos':
//       return (
//         <div className="flex flex-wrap">
//           {results?.results?.map((video, index) => (
//             <div key={index} className="p-2">
//               <ReactPlayer url={video.additional_links?.[0].href} controls width="355px" height="200px" />
//             </div>
//           ))}
//         </div>
//       );
//     default:
//       return 'Error...';
//   }
// };

