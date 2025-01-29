import { CommandItem, CommandList } from '@/components/ui/cmdk';
import { getMovieDetailsQueryOptions } from '@/features/movies/api/get-movie-details';
import { SearchMovie } from '@/types/types.gen';
import { useQueryClient } from '@tanstack/react-query';
import { CommandLoading, useCommandState } from 'cmdk';
import { useSearchMovies } from '../api/search-movies';
import React from 'react';
import { getMovieCastQueryOptions } from '@/features/cast/api/get-movie-cast';
import { getMovieWatchProvidersQueryOptions } from '@/features/watchproviders/api/get-movie-watch-providers';
import { Spinner } from '@/components/ui/spinner';
import { useDebounce } from '@uidotdev/usehooks';
import { SearchPageItem } from './search-page-item';

export interface SearchPageMoviesProps {
  searchTerm: string;
  onSelect: (movie: SearchMovie) => void;
}

export const SearchPageMovies = ({
  searchTerm,
  onSelect,
}: SearchPageMoviesProps) => {
  const debouncedSearch = useDebounce(searchTerm, 500);
  const queryClient = useQueryClient();

  const currentItem = useCommandState((state) => state.value);
  React.useEffect(() => {
    const prefetchMovie = (id: string) => {
      queryClient.prefetchQuery(getMovieDetailsQueryOptions({ id }));
      queryClient.prefetchQuery(getMovieCastQueryOptions({ id }));
      queryClient.prefetchQuery(getMovieWatchProvidersQueryOptions({ id }));
    };
    if (currentItem) {
      const idString = currentItem.split('_');
      const id = idString[idString.length - 1].split(':')[1];
      prefetchMovie(id);
    }
  }, [currentItem, queryClient]);

  const searchMoviesQuery = useSearchMovies({ q: debouncedSearch });
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
        {movies
          .filter((movie) => movie.popularity > 1)
          .sort((a, b) => b.popularity - a.popularity)
          .map((movie) => (
            <CommandItem
              key={movie.id}
              value={movie.title + '_movieID:' + movie.id}
              onSelect={() => {
                onSelect(movie);
              }}
            >
              <SearchPageItem data={movie} type="movie" />
            </CommandItem>
          ))}
      </CommandList>
    </>
  );
};
