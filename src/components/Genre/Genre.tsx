import React from 'react';

type Props = {}

// Example genre list
const genres: string[] = ['Action', 'Comedy', 'Drama', 'Thriller', 'Fantasy', 'Horror', 'Sci-Fi', 'Romance', 'Adventure', 'Mystery', 'Documentary', 'Animation', 'Historical', 'Musical', 'News', 'Kids', 'Educational'];

function Genre({}: Props) {
  return (
    <div className="hidden lg:flex space-x-3">
      {genres.map((genre, index) => (
        <div
          key={index}
          className="p-1 bg-gray-100  border-black border-2 rounded-full"
        >
          {genre}
        </div>
      ))}
    </div>
  );
}

export default Genre;
