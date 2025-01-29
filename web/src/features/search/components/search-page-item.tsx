import { SearchMovie, SearchPeople, SearchTv } from '@/types/types.gen';
import { Star } from 'lucide-react';

export const SearchPageItem = ({
  data,
  type,
}: {
  data: SearchMovie | SearchTv | SearchPeople;
  type: 'movie' | 'tv' | 'person';
}) => {
  if (type === 'movie' || type === 'tv') {
    const movieOrTvData = data as SearchMovie | SearchTv;
    return (
      <div className="flex grow justify-between">
        <div className="flex gap-4 items-start align-middle">
          <div className="w-12 h-18">
            {movieOrTvData.poster_url === '' ? (
              <div className="w-full h-full bg-secondary rounded-md"></div>
            ) : (
              <img
                src={movieOrTvData.poster_url}
                alt={movieOrTvData.title}
                className="w-full h-full object-cover rounded-md"
              />
            )}
          </div>
          <div className="flex flex-col align-middle">
            <p className="font-medium">{movieOrTvData.title}</p>
            <p className="text-sm font-thin">
              {movieOrTvData.release_date.slice(0, 4)}
            </p>
          </div>
        </div>
        <div className="flex flex-col align-middle">
          <p className="text-sm font-thin">Rating:</p>
          <div className="flex gap-2">
            <Star fill="gold" />
            <p className="text-sm font-medium">
              {movieOrTvData.vote_average.toFixed(1)}
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (type === 'person') {
    const personData = data as SearchPeople;
    return (
      <div className="flex grow justify-between">
        <div className="flex gap-4 items-start align-middle">
          <div className="w-12 h-18">
            {personData.profile_url === '' ? (
              <div className="w-full h-full bg-secondary rounded-md"></div>
            ) : (
              <img
                src={personData.profile_url}
                alt={personData.name}
                className="w-full h-full object-cover rounded-md"
              />
            )}
          </div>
          <div className="flex flex-col align-middle">
            <p className="font-medium">{personData.name}</p>
          </div>
        </div>
        <div className="flex flex-col align-middle">
          <p className="text-sm font-thin">Popularity:</p>
          <p className="text-sm font-medium">{personData.popularity}</p>
        </div>
      </div>
    );
  }
};
