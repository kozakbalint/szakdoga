import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { CastTv, CastMovies } from '@/types/types.gen';

export const Cast = ({ actor }: { actor: CastTv | CastMovies }) => {
  return (
    <Card key={actor.id} className="w-36 h-[320px] group">
      {actor.profile_url === '' ? (
        <Skeleton className="w-full h-3/5 rounded-md" />
      ) : (
        <img
          src={actor.profile_url}
          alt={actor.name}
          width={150}
          height={192}
          className="object-cover w-full h-3/5 rounded-md shadow-md"
        />
      )}
      <CardContent className="p-2 h-2/5">
        {'roles' in actor ? (
          <div className="flex flex-col h-full justify-between">
            <div>
              <div className="text-base font-bold max-h-12 line-clamp-2 group-hover:underline">
                {actor.name}
              </div>
              <div className="text-sm max-h-2/3 line-clamp-2">
                {actor.roles[0].character}
              </div>
            </div>
            <div className="text-sm text-primary">
              {actor.roles[0].episode_count} episodes
            </div>
          </div>
        ) : (
          <div className="flex flex-col">
            <p className="text-base font-bold max-h-12 line-clamp-2 group-hover:underline">
              {actor.name}
            </p>
            <p className="text-sm max-h-2/3 line-clamp-2">{actor.character}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
