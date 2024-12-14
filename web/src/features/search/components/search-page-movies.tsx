import { AspectRatio } from '@/components/ui/aspectratio';
import { CommandItem, CommandList } from '@/components/ui/cmdk';
import { getMovieByIdQueryOptions } from '@/features/movies/api/get-movie-by-id';
import { SearchMovieResponse } from '@/types/api';
import { useQueryClient } from '@tanstack/react-query';
import { CommandLoading, useCommandState } from 'cmdk';
import { useSearchMovies } from '../api/search-movies';
import React from 'react';
import { getMovieCastByIdQueryOptions } from '@/features/movies/api/get-movie-cast-by-id';
import { getMovieWatchProvidersByIdQueryOptions } from '@/features/movies/api/get-movie-watch-providers-by-id';
import { Spinner } from '@/components/ui/spinner';

export interface SearchPageMoviesProps {
  searchTerm: string;
  onSelect: (movie: SearchMovieResponse) => void;
}

export const SearchPageMovies = ({
  searchTerm,
  onSelect,
}: SearchPageMoviesProps) => {
  const queryClient = useQueryClient();

  const currentItem = useCommandState((state) => state.value);
  React.useEffect(() => {
    const prefetchMovie = (id: string) => {
      queryClient.prefetchQuery(getMovieByIdQueryOptions({ id }));
      queryClient.prefetchQuery(getMovieCastByIdQueryOptions({ id }));
      queryClient.prefetchQuery(getMovieWatchProvidersByIdQueryOptions({ id }));
    };
    if (currentItem) {
      const idString = currentItem.split('_');
      const id = idString[idString.length - 1].split(':')[1];
      prefetchMovie(id);
    }
  }, [currentItem, queryClient]);

  const searchMoviesQuery = useSearchMovies({ q: searchTerm });
  const movies = searchMoviesQuery.data?.movies;

  if (searchTerm.length === 0) {
    return (
      <CommandList className="h-[300px]">
        <CommandLoading className="px-4 py-2 flex justify-center">
          <p>Type a movie title.</p>
        </CommandLoading>
      </CommandList>
    );
  }

  if (movies == null || movies === undefined) {
    return (
      <CommandList className="h-[300px]">
        <CommandLoading className="flex justify-center py-4">
          <Spinner />
        </CommandLoading>
      </CommandList>
    );
  }

  if (movies.length === 0) {
    return (
      <CommandList className="h-[300px]">
        <CommandLoading className="px-4 py-2 flex justify-center">
          <p>No movies found.</p>
        </CommandLoading>
      </CommandList>
    );
  }

  return (
    <>
      <CommandList className="h-[300px]">
        {movies.map((movie) => (
          <CommandItem
            key={movie.id + movie.title}
            value={movie.title + '_movieID:' + movie.id}
            onSelect={() => {
              onSelect(movie);
            }}
          >
            <div className="flex flex-grow justify-between">
              <div className="flex gap-4 items-start align-middle">
                <div className="w-12">
                  {movie.poster_url == '' ? (
                    <div className="w-full h-full bg-gray-300 rounded-md"></div>
                  ) : (
                    <AspectRatio ratio={2 / 3}>
                      <img
                        src={movie.poster_url}
                        alt={movie.title}
                        className="w-full h-full object-cover rounded-md"
                      />
                    </AspectRatio>
                  )}
                </div>
                <div className="flex flex-col align-middle">
                  <p className="font-medium">{movie.title}</p>
                  <p className="text-sm font-thin">
                    {movie.release_date.slice(0, 4)}
                  </p>
                </div>
              </div>
              <div className="flex flex-col align-middle">
                <p className="text-sm font-thin">Popularity:</p>
                <p className="text-sm font-medium">{movie.popularity}</p>
              </div>
            </div>
          </CommandItem>
        ))}
      </CommandList>
    </>
  );
};
