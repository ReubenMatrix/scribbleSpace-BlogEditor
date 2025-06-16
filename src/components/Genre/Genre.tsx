import React from 'react';

type Props = {}

// Example genre list
const genres: string[] = ['Action', 'Comedy', 'Drama', 'Thriller', 'Fantasy', 'Horror', 'Sci-Fi'];

function Genre({}: Props) {
  return (
    <div className="flex space-x-4">
      {genres.map((genre, index) => (
        <div
          key={index}
          className="px-4 py-2 bg-gray-200 border border-black rounded-md"
        >
          {genre}
        </div>
      ))}
    </div>
  );
}

export default Genre;
