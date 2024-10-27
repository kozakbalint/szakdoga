import { CommandItem, CommandList } from '@/components/ui/cmdk';
import { CommandLoading } from 'cmdk';
import { SearchMovieResponse } from '@/types/api';
import { useSearchMovies } from '../api/search-movies';

export interface SearchPageMoviesProps {
  searchTerm: string;
  onSelect: (movie: SearchMovieResponse) => void;
}

export const SearchPageMovies = ({
  searchTerm,
  onSelect,
}: SearchPageMoviesProps) => {
  const searchMoviesQuery = useSearchMovies({ q: searchTerm });
  const movies = searchMoviesQuery.data?.movies;

  if (movies == null || movies.length === 0 || movies === undefined) {
    return (
      <CommandList>
        <CommandLoading className="px-4 py-2">
          <p>No movies found...</p>
        </CommandLoading>
      </CommandList>
    );
  }

  return (
    <>
      <CommandList className="h-full">
        {movies.map((movie) => (
          <CommandItem
            key={movie.id + movie.title}
            value={movie.title + movie.id}
            onSelect={() => {
              onSelect(movie);
            }}
          >
            <div className="flex gap-2 items-start align-middle">
              <p>{movie.title}</p>
              <p className="text-muted text-sm">
                {movie.release_date.slice(0, 4)}
              </p>
            </div>
          </CommandItem>
        ))}
      </CommandList>
    </>
  );
};
