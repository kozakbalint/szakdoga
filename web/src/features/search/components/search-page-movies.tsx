import { AspectRatio } from '@/components/ui/aspectratio';
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
