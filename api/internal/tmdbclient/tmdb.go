package tmdbclient

import (
	"fmt"
	"log/slog"
	"time"

	tmdb "github.com/cyruzin/golang-tmdb"
	"github.com/kozakbalint/szakdoga/api/internal/repository"
	"github.com/kozakbalint/szakdoga/api/internal/types"
	"github.com/kozakbalint/szakdoga/api/internal/utils"
	"github.com/redis/go-redis/v9"
)

func NewClient(tmdb *tmdb.Client, repo *repository.Queries, redis *redis.Client, logger *slog.Logger) *Client {
	return &Client{
		Client:     tmdb,
		Repository: repo,
		Redis:      redis,
		Logger:     logger,
	}
}

type Client struct {
	Client     *tmdb.Client
	Redis      *redis.Client
	Repository *repository.Queries
	Logger     *slog.Logger
}

func (m *Client) GetMovieCast(tmdbID int) (*[]types.CastMovies, error) {
	cacheKey := fmt.Sprintf("movie_cast:%d", tmdbID)

	cachedData, err := utils.GetFromCache(m.Redis, cacheKey)
	if err != nil {
		m.Logger.Debug("Failed to get cached data", slog.String("key", cacheKey), slog.String("err", err.Error()))
	} else if cachedData != nil {
		cachedResponse, err := utils.UnmarshalCacheData[[]types.CastMovies](cachedData)
		if err == nil {
			m.Logger.Debug("Cache hit!", slog.String("key", cacheKey))
			return cachedResponse, nil
		}
		m.Logger.Debug("Failed to unmarshal cached data", slog.String("key", cacheKey), slog.String("err", err.Error()))
	}

	cast, err := m.Client.GetMovieCredits(tmdbID, nil)
	if err != nil {
		return nil, err
	}

	var response []types.CastMovies
	for i := range cast.Cast {
		cast := &cast.Cast[i]
		profileURL := ""
		if cast.ProfilePath != "" {
			profileURL = tmdb.GetImageURL(cast.ProfilePath, "w185")
		}

		response = append(response, types.CastMovies{
			Id:         cast.ID,
			Name:       cast.Name,
			Character:  cast.Character,
			Order:      cast.Order,
			ProfileUrl: profileURL,
			Popularity: cast.Popularity,
		})
	}

	serializedData, err := utils.MarshalData(response)
	if err != nil {
		m.Logger.Debug("Failed to marshal data", slog.String("key", cacheKey), slog.String("err", err.Error()))
	} else {
		err = utils.SaveToCache(m.Redis, cacheKey, serializedData, 24*time.Hour)
		if err != nil {
			m.Logger.Debug("Failed to save data to cache", slog.String("key", cacheKey), slog.String("err", err.Error()))
		}
	}

	m.Logger.Debug("Cache miss!", slog.String("key", cacheKey))
	return &response, nil
}

func (m *Client) GetTvCast(tmdbID int) (*[]types.CastTv, error) {
	cacheKey := fmt.Sprintf("tv_cast:%d", tmdbID)

	cachedData, err := utils.GetFromCache(m.Redis, cacheKey)
	if err != nil {
		m.Logger.Debug("Failed to get cached data", slog.String("key", cacheKey), slog.String("err", err.Error()))
	} else if cachedData != nil {
		cachedResponse, err := utils.UnmarshalCacheData[[]types.CastTv](cachedData)
		if err == nil {
			m.Logger.Debug("Cache hit!", slog.String("key", cacheKey))
			return cachedResponse, nil
		}
		m.Logger.Debug("Failed to unmarshal cached data", slog.String("key", cacheKey), slog.String("err", err.Error()))
	}

	cast, err := m.Client.GetTVAggregateCredits(tmdbID, nil)
	if err != nil {
		return nil, err
	}

	var response []types.CastTv
	for i := range cast.Cast {
		cast := &cast.Cast[i]
		profileURL := ""
		if cast.ProfilePath != "" {
			profileURL = tmdb.GetImageURL(cast.ProfilePath, "w185")
		}

		var roles []types.Role
		for _, role := range cast.Roles {
			character := role.Character
			episodeCount := role.EpisodeCount
			roles = append(roles, types.Role{
				Character:    character,
				EpisodeCount: episodeCount,
			})
		}

		id := int64(cast.ID)
		name := cast.Name
		order := cast.Order
		popularity := float32(cast.Popularity)

		response = append(response, types.CastTv{
			Id:         id,
			Name:       name,
			Order:      order,
			Roles:      roles,
			ProfileUrl: profileURL,
			Popularity: popularity,
		})
	}

	serializedData, err := utils.MarshalData(response)
	if err != nil {
		m.Logger.Debug("Failed to marshal data", slog.String("key", cacheKey), slog.String("err", err.Error()))
	} else {
		err = utils.SaveToCache(m.Redis, cacheKey, serializedData, 24*time.Hour)
		if err != nil {
			m.Logger.Debug("Failed to save data to cache", slog.String("key", cacheKey), slog.String("err", err.Error()))
		}
	}

	m.Logger.Debug("Cache miss!", slog.String("key", cacheKey))
	return &response, nil
}

func (m *Client) GetMovie(tmdbID int) (*types.MovieDetails, error) {
	cacheKey := fmt.Sprintf("movie:%d", tmdbID)

	cachedData, err := utils.GetFromCache(m.Redis, cacheKey)
	if err != nil {
		m.Logger.Debug("Failed to get cached data", slog.String("key", cacheKey), slog.String("err", err.Error()))
	} else if cachedData != nil {
		cachedResponse, err := utils.UnmarshalCacheData[types.MovieDetails](cachedData)
		if err == nil {
			m.Logger.Debug("Cache hit!", slog.String("key", cacheKey))
			return cachedResponse, nil
		}
		m.Logger.Debug("Failed to unmarshal cached data", slog.String("key", cacheKey), slog.String("err", err.Error()))
	}

	movie, err := m.Client.GetMovieDetails(tmdbID, nil)
	if err != nil {
		return nil, err
	}

	posterURL := ""
	if movie.PosterPath != "" {
		posterURL = tmdb.GetImageURL(movie.PosterPath, "w500")
	}

	genres := []string{}
	for _, genre := range movie.Genres {
		genres = append(genres, genre.Name)
	}

	response := &types.MovieDetails{
		Id:          movie.ID,
		Title:       movie.Title,
		Overview:    movie.Overview,
		ReleaseDate: movie.ReleaseDate,
		Genres:      genres,
		Runtime:     movie.Runtime,
		PosterUrl:   posterURL,
		Popularity:  movie.Popularity,
		VoteAverage: movie.VoteAverage,
	}

	serializedData, err := utils.MarshalData(response)
	if err != nil {
		m.Logger.Debug("Failed to marshal data", slog.String("key", cacheKey), slog.String("err", err.Error()))
	} else {
		err = utils.SaveToCache(m.Redis, cacheKey, serializedData, 24*time.Hour)
		if err != nil {
			m.Logger.Debug("Failed to save data to cache", slog.String("key", cacheKey), slog.String("err", err.Error()))
		}
	}

	m.Logger.Debug("Cache miss!", slog.String("key", cacheKey))
	return response, nil
}

func (m *Client) GetPerson(tmdbID int) (*types.PersonDetails, error) {
	cacheKey := fmt.Sprintf("person:%d", tmdbID)

	cachedData, err := utils.GetFromCache(m.Redis, cacheKey)
	if err != nil {
		m.Logger.Debug("Failed to get cached data", slog.String("key", cacheKey), slog.String("err", err.Error()))
	} else if cachedData != nil {
		cachedResponse, err := utils.UnmarshalCacheData[types.PersonDetails](cachedData)
		if err == nil {
			m.Logger.Debug("Cache hit!", slog.String("key", cacheKey))
			return cachedResponse, nil
		}
		m.Logger.Debug("Failed to unmarshal cached data", slog.String("key", cacheKey), slog.String("err", err.Error()))
	}

	person, err := m.Client.GetPersonDetails(tmdbID, nil)
	if err != nil {
		return nil, err
	}

	profileURL := ""
	if person.ProfilePath != "" {
		profileURL = tmdb.GetImageURL(person.ProfilePath, "w185")
	}

	response := &types.PersonDetails{
		Id:         person.ID,
		Name:       person.Name,
		Biography:  person.Biography,
		Birthday:   person.Birthday,
		ProfileUrl: profileURL,
		Popularity: person.Popularity,
	}

	serializedData, err := utils.MarshalData(response)
	if err != nil {
		m.Logger.Debug("Failed to marshal data", slog.String("key", cacheKey), slog.String("err", err.Error()))
	} else {
		err = utils.SaveToCache(m.Redis, cacheKey, serializedData, 24*time.Hour)
		if err != nil {
			m.Logger.Debug("Failed to save data to cache", slog.String("key", cacheKey), slog.String("err", err.Error()))
		}
	}

	m.Logger.Debug("Cache miss!", slog.String("key", cacheKey))
	return response, nil
}

func (m *Client) SearchMovies(query string) (*[]types.SearchMovie, error) {
	cacheKey := fmt.Sprintf("search_movies:%s", query)

	cachedData, err := utils.GetFromCache(m.Redis, cacheKey)
	if err != nil {
		m.Logger.Debug("Failed to get cached data", slog.String("key", cacheKey), slog.String("err", err.Error()))
	} else if cachedData != nil {
		cachedResponse, err := utils.UnmarshalCacheData[[]types.SearchMovie](cachedData)
		if err == nil {
			m.Logger.Debug("Cache hit!", slog.String("key", cacheKey))
			return cachedResponse, nil
		}
		m.Logger.Debug("Failed to unmarshal cached data", slog.String("key", cacheKey), slog.String("err", err.Error()))
	}

	movies, err := m.Client.GetSearchMovies(query, nil)
	if err != nil {
		return nil, err
	}

	var response []types.SearchMovie
	for i := range movies.Results {
		movie := &movies.Results[i]
		posterURL := ""
		if movie.PosterPath != "" {
			posterURL = tmdb.GetImageURL(movie.PosterPath, "w92")
		}
		response = append(response, types.SearchMovie{
			Id:          movie.ID,
			Title:       movie.Title,
			Overview:    movie.Overview,
			PosterUrl:   posterURL,
			ReleaseDate: movie.ReleaseDate,
			Popularity:  movie.Popularity,
			VoteAverage: movie.VoteAverage,
		})
	}

	if len(response) == 0 {
		response = []types.SearchMovie{}
	}

	serializedData, err := utils.MarshalData(response)
	if err != nil {
		m.Logger.Debug("Failed to marshal data", slog.String("key", cacheKey), slog.String("err", err.Error()))
	} else {
		err = utils.SaveToCache(m.Redis, cacheKey, serializedData, 24*time.Hour)
		if err != nil {
			m.Logger.Debug("Failed to save data to cache", slog.String("key", cacheKey), slog.String("err", err.Error()))
		}
	}

	m.Logger.Debug("Cache miss!", slog.String("key", cacheKey))
	return &response, nil
}

func (m *Client) SearchTv(query string) (*[]types.SearchTv, error) {
	cacheKey := fmt.Sprintf("search_tv:%s", query)

	cachedData, err := utils.GetFromCache(m.Redis, cacheKey)
	if err != nil {
		m.Logger.Debug("Failed to get cached data", slog.String("key", cacheKey), slog.String("err", err.Error()))
	} else if cachedData != nil {
		cachedResponse, err := utils.UnmarshalCacheData[[]types.SearchTv](cachedData)
		if err == nil {
			m.Logger.Debug("Cache hit!", slog.String("key", cacheKey))
			return cachedResponse, nil
		}
		m.Logger.Debug("Failed to unmarshal cached data", slog.String("key", cacheKey), slog.String("err", err.Error()))
	}

	tvShows, err := m.Client.GetSearchTVShow(query, nil)
	if err != nil {
		return nil, err
	}

	var response []types.SearchTv
	for i := range tvShows.Results {
		tv := &tvShows.Results[i]
		posterURL := ""
		if tv.PosterPath != "" {
			posterURL = tmdb.GetImageURL(tv.PosterPath, "w92")
		}
		response = append(response, types.SearchTv{
			Id:          tv.ID,
			Title:       tv.Name,
			Overview:    tv.Overview,
			PosterUrl:   posterURL,
			ReleaseDate: tv.FirstAirDate,
			Popularity:  tv.Popularity,
			VoteAverage: tv.VoteAverage,
		})
	}

	if len(response) == 0 {
		response = []types.SearchTv{}
	}

	serializedData, err := utils.MarshalData(response)
	if err != nil {
		m.Logger.Debug("Failed to marshal data", slog.String("key", cacheKey), slog.String("err", err.Error()))
	} else {
		err = utils.SaveToCache(m.Redis, cacheKey, serializedData, 24*time.Hour)
		if err != nil {
			m.Logger.Debug("Failed to save data to cache", slog.String("key", cacheKey), slog.String("err", err.Error()))
		}
	}

	m.Logger.Debug("Cache miss!", slog.String("key", cacheKey))
	return &response, nil
}

func (m *Client) SearchPeople(query string) (*[]types.SearchPeople, error) {
	cacheKey := fmt.Sprintf("search_people:%s", query)

	cachedData, err := utils.GetFromCache(m.Redis, cacheKey)
	if err != nil {
		m.Logger.Debug("Failed to get cached data", slog.String("key", cacheKey), slog.String("err", err.Error()))
	} else if cachedData != nil {
		cachedResponse, err := utils.UnmarshalCacheData[[]types.SearchPeople](cachedData)
		if err == nil {
			m.Logger.Debug("Cache hit!", slog.String("key", cacheKey))
			return cachedResponse, nil
		}
		m.Logger.Debug("Failed to unmarshal cached data", slog.String("key", cacheKey), slog.String("err", err.Error()))
	}

	people, err := m.Client.GetSearchPeople(query, nil)
	if err != nil {
		return nil, err
	}

	var response []types.SearchPeople
	for i := range people.Results {
		person := &people.Results[i]
		profileURL := ""
		if person.ProfilePath != "" {
			profileURL = tmdb.GetImageURL(person.ProfilePath, "w185")
		}

		response = append(response, types.SearchPeople{
			Id:         person.ID,
			Name:       person.Name,
			ProfileUrl: profileURL,
			Popularity: person.Popularity,
		})
	}

	if len(response) == 0 {
		response = []types.SearchPeople{}
	}

	serializedData, err := utils.MarshalData(response)
	if err != nil {
		m.Logger.Debug("Failed to marshal data", slog.String("key", cacheKey), slog.String("err", err.Error()))
	} else {
		err = utils.SaveToCache(m.Redis, cacheKey, serializedData, 24*time.Hour)
		if err != nil {
			m.Logger.Debug("Failed to save data to cache", slog.String("key", cacheKey), slog.String("err", err.Error()))
		}
	}

	m.Logger.Debug("Cache miss!", slog.String("key", cacheKey))
	return &response, nil
}

func (m *Client) GetTv(tmdbID int) (*types.TvDetails, error) {
	cacheKey := fmt.Sprintf("tv:%d", tmdbID)

	cachedData, err := utils.GetFromCache(m.Redis, cacheKey)
	if err != nil {
		m.Logger.Debug("Failed to get cached data", slog.String("key", cacheKey), slog.String("err", err.Error()))
	} else if cachedData != nil {
		cachedResponse, err := utils.UnmarshalCacheData[types.TvDetails](cachedData)
		if err == nil {
			m.Logger.Debug("Cache hit!", slog.String("key", cacheKey))
			return cachedResponse, nil
		}
		m.Logger.Debug("Failed to unmarshal cached data", slog.String("key", cacheKey), slog.String("err", err.Error()))
	}

	tv, err := m.Client.GetTVDetails(tmdbID, nil)
	if err != nil {
		return nil, err
	}

	posterURL := ""
	if tv.PosterPath != "" {
		posterURL = tmdb.GetImageURL(tv.PosterPath, "w500")
	}

	genres := []string{}
	for _, genre := range tv.Genres {
		genres = append(genres, genre.Name)
	}

	seasons := []types.TvSeason{}
	for _, season := range tv.Seasons {
		if season.SeasonNumber == 0 {
			continue
		}

		posterUrl := tmdb.GetImageURL(season.PosterPath, "w500")

		seasons = append(seasons, types.TvSeason{
			AirDate:      season.AirDate,
			EpisodeCount: season.EpisodeCount,
			Id:           season.ID,
			Name:         season.Name,
			Overview:     season.Overview,
			PosterUrl:    posterUrl,
			VoteAverage:  season.VoteAverage,
		})
	}

	response := &types.TvDetails{
		Id:               tv.ID,
		Name:             tv.Name,
		Overview:         tv.Overview,
		FirstAirDate:     tv.FirstAirDate,
		PosterUrl:        posterURL,
		Genres:           genres,
		NumberOfSeasons:  tv.NumberOfSeasons,
		NumberOfEpisodes: tv.NumberOfEpisodes,
		Popularity:       tv.Popularity,
		VoteAverage:      tv.VoteAverage,
		Status:           tv.Status,
		Seasons:          seasons,
	}

	serializedData, err := utils.MarshalData(response)
	if err != nil {
		m.Logger.Debug("Failed to marshal data", slog.String("key", cacheKey), slog.String("err", err.Error()))
	} else {
		err = utils.SaveToCache(m.Redis, cacheKey, serializedData, 24*time.Hour)
		if err != nil {
			m.Logger.Debug("Failed to save data to cache", slog.String("key", cacheKey), slog.String("err", err.Error()))
		}
	}

	m.Logger.Debug("Cache miss!", slog.String("key", cacheKey))
	return response, nil
}

func (m *Client) GetTvSeason(tmdbID int, seasonNumber int) (*types.TvSeasonDetails, error) {
	cacheKey := fmt.Sprintf("tv_season:%d:%d", tmdbID, seasonNumber)

	cachedData, err := utils.GetFromCache(m.Redis, cacheKey)
	if err != nil {
		m.Logger.Debug("Failed to get cached data", slog.String("key", cacheKey), slog.String("err", err.Error()))
	} else if cachedData != nil {
		cachedResponse, err := utils.UnmarshalCacheData[types.TvSeasonDetails](cachedData)
		if err == nil {
			m.Logger.Debug("Cache hit!", slog.String("key", cacheKey))
			return cachedResponse, nil
		}
		m.Logger.Debug("Failed to unmarshal cached data", slog.String("key", cacheKey), slog.String("err", err.Error()))
	}

	tvDetails, err := m.Client.GetTVSeasonDetails(tmdbID, seasonNumber, nil)
	if err != nil {
		return nil, err
	}

	posterURL := tmdb.GetImageURL(tvDetails.PosterPath, "w500")

	episodes := []types.TvEpisode{}
	for _, episode := range tvDetails.Episodes {
		stillURL := ""
		if episode.StillPath != "" {
			stillURL = tmdb.GetImageURL(episode.StillPath, "w500")
		}
		episodes = append(episodes, types.TvEpisode{
			AirDate:     episode.AirDate,
			Id:          episode.ID,
			Name:        episode.Name,
			Overview:    episode.Overview,
			Runtime:     episode.Runtime,
			StillUrl:    stillURL,
			VoteAverage: episode.VoteAverage,
		})
	}

	var response = types.TvSeasonDetails{
		Id:          tvDetails.ID,
		Name:        tvDetails.Name,
		Overview:    tvDetails.Overview,
		AirDate:     tvDetails.AirDate,
		PosterUrl:   posterURL,
		VoteAverage: tvDetails.VoteAverage,
		Episodes:    episodes,
	}

	serializedData, err := utils.MarshalData(response)
	if err != nil {
		m.Logger.Debug("Failed to marshal data", slog.String("key", cacheKey), slog.String("err", err.Error()))
	} else {
		err = utils.SaveToCache(m.Redis, cacheKey, serializedData, 24*time.Hour)
		if err != nil {
			m.Logger.Debug("Failed to save data to cache", slog.String("key", cacheKey), slog.String("err", err.Error()))
		}
	}

	m.Logger.Debug("Cache miss!", slog.String("key", cacheKey))
	return &response, nil
}

func (m *Client) GetTvEpisode(tmdbID, seasonNumber, episodeNumber int) (*types.TvEpisodeDetails, error) {
	cacheKey := fmt.Sprintf("tv_episode:%d:%d:%d", tmdbID, seasonNumber, episodeNumber)

	cachedData, err := utils.GetFromCache(m.Redis, cacheKey)
	if err != nil {
		m.Logger.Debug("Failed to get cached data", slog.String("key", cacheKey), slog.String("err", err.Error()))
	} else if cachedData != nil {
		cachedResponse, err := utils.UnmarshalCacheData[types.TvEpisodeDetails](cachedData)
		if err == nil {
			m.Logger.Debug("Cache hit!", slog.String("key", cacheKey))
			return cachedResponse, nil
		}
		m.Logger.Debug("Failed to unmarshal cached data", slog.String("key", cacheKey), slog.String("err", err.Error()))
	}

	episode, err := m.Client.GetTVEpisodeDetails(tmdbID, seasonNumber, episodeNumber, nil)
	if err != nil {
		return nil, err
	}

	stillURL := ""
	if episode.StillPath != "" {
		stillURL = tmdb.GetImageURL(episode.StillPath, "w500")
	}

	response := &types.TvEpisodeDetails{
		Id:          episode.ID,
		Name:        episode.Name,
		Overview:    episode.Overview,
		AirDate:     episode.AirDate,
		StillUrl:    stillURL,
		VoteAverage: episode.VoteAverage,
		Runtime:     episode.Runtime,
	}

	serializedData, err := utils.MarshalData(response)
	if err != nil {
		m.Logger.Debug("Failed to marshal data", slog.String("key", cacheKey), slog.String("err", err.Error()))
	} else {
		err = utils.SaveToCache(m.Redis, cacheKey, serializedData, 24*time.Hour)
		if err != nil {
			m.Logger.Debug("Failed to save data to cache", slog.String("key", cacheKey), slog.String("err", err.Error()))
		}
	}

	m.Logger.Debug("Cache miss!", slog.String("key", cacheKey))
	return response, nil
}

func (m *Client) GetMovieWatchProviders(tmdbID int) (*types.WatchProviders, error) {
	cacheKey := fmt.Sprintf("movie_watch_providers:%d", tmdbID)

	cachedData, err := utils.GetFromCache(m.Redis, cacheKey)
	if err != nil {
		m.Logger.Debug("Failed to get cached data", slog.String("key", cacheKey), slog.String("err", err.Error()))
	} else if cachedData != nil {
		cachedResponse, err := utils.UnmarshalCacheData[types.WatchProviders](cachedData)
		if err == nil {
			m.Logger.Debug("Cache hit!", slog.String("key", cacheKey))
			return cachedResponse, nil
		}
		m.Logger.Debug("Failed to unmarshal cached data", slog.String("key", cacheKey), slog.String("err", err.Error()))
	}

	providers, err := m.Client.GetMovieWatchProviders(tmdbID, nil)
	if err != nil {
		return nil, err
	}

	huProviders := providers.Results["HU"]
	id := int64(tmdbID)
	var response = types.WatchProviders{
		Id:       id,
		Flatrate: []types.Provider{},
		Rent:     []types.Provider{},
		Buy:      []types.Provider{},
	}

	for _, provider := range huProviders.Flatrate {
		logoURL := tmdb.GetImageURL(provider.LogoPath, "w92")
		displayPriority := int(provider.DisplayPriority)
		response.Flatrate = append(response.Flatrate, types.Provider{
			Id:              provider.ProviderID,
			Name:            provider.ProviderName,
			LogoUrl:         logoURL,
			DisplayPriority: displayPriority,
		})
	}

	for _, provider := range huProviders.Buy {
		logoURL := tmdb.GetImageURL(provider.LogoPath, "w92")
		displayPriority := int(provider.DisplayPriority)
		response.Buy = append(response.Buy, types.Provider{
			Id:              provider.ProviderID,
			Name:            provider.ProviderName,
			LogoUrl:         logoURL,
			DisplayPriority: displayPriority,
		})
	}

	for _, provider := range huProviders.Rent {
		logoURL := tmdb.GetImageURL(provider.LogoPath, "w92")
		displayPriority := int(provider.DisplayPriority)
		response.Rent = append(response.Rent, types.Provider{
			Id:              provider.ProviderID,
			Name:            provider.ProviderName,
			LogoUrl:         logoURL,
			DisplayPriority: displayPriority,
		})
	}

	serializedData, err := utils.MarshalData(response)
	if err != nil {
		m.Logger.Debug("Failed to marshal data", slog.String("key", cacheKey), slog.String("err", err.Error()))
	} else {
		err = utils.SaveToCache(m.Redis, cacheKey, serializedData, 24*time.Hour)
		if err != nil {
			m.Logger.Debug("Failed to save data to cache", slog.String("key", cacheKey), slog.String("err", err.Error()))
		}
	}

	m.Logger.Debug("Cache miss!", slog.String("key", cacheKey))
	return &response, nil
}

func (m *Client) GetTvWatchProviders(tmdbID int) (*types.WatchProviders, error) {
	cacheKey := fmt.Sprintf("tv_watch_providers:%d", tmdbID)

	cachedData, err := utils.GetFromCache(m.Redis, cacheKey)
	if err != nil {
		m.Logger.Debug("Failed to get cached data", slog.String("key", cacheKey), slog.String("err", err.Error()))
	} else if cachedData != nil {
		cachedResponse, err := utils.UnmarshalCacheData[types.WatchProviders](cachedData)
		if err == nil {
			m.Logger.Debug("Cache hit!", slog.String("key", cacheKey))
			return cachedResponse, nil
		}
		m.Logger.Debug("Failed to unmarshal cached data", slog.String("key", cacheKey), slog.String("err", err.Error()))
	}

	providers, err := m.Client.GetTVWatchProviders(tmdbID, nil)
	if err != nil {
		return nil, err
	}

	huProviders := providers.Results["HU"]
	id := int64(tmdbID)
	var response = types.WatchProviders{
		Id:       id,
		Flatrate: []types.Provider{},
		Buy:      []types.Provider{},
		Rent:     []types.Provider{},
	}

	if huProviders.Flatrate != nil {
		for _, provider := range huProviders.Flatrate {
			logoURL := tmdb.GetImageURL(provider.LogoPath, "w92")
			displayPriority := int(provider.DisplayPriority)
			response.Flatrate = append(response.Flatrate, types.Provider{
				Id:              provider.ProviderID,
				Name:            provider.ProviderName,
				LogoUrl:         logoURL,
				DisplayPriority: displayPriority,
			})
		}
	}

	if huProviders.Buy != nil {
		for _, provider := range huProviders.Buy {
			logoURL := tmdb.GetImageURL(provider.LogoPath, "w92")
			displayPriority := int(provider.DisplayPriority)
			response.Buy = append(response.Buy, types.Provider{
				Id:              provider.ProviderID,
				Name:            provider.ProviderName,
				LogoUrl:         logoURL,
				DisplayPriority: displayPriority,
			})
		}
	}

	if huProviders.Rent != nil {
		for _, provider := range huProviders.Rent {
			logoURL := tmdb.GetImageURL(provider.LogoPath, "w92")
			displayPriority := int(provider.DisplayPriority)
			response.Rent = append(response.Rent, types.Provider{
				Id:              provider.ProviderID,
				Name:            provider.ProviderName,
				LogoUrl:         logoURL,
				DisplayPriority: displayPriority,
			})
		}
	}

	serializedData, err := utils.MarshalData(response)
	if err != nil {
		m.Logger.Debug("Failed to marshal data", slog.String("key", cacheKey), slog.String("err", err.Error()))
	} else {
		err = utils.SaveToCache(m.Redis, cacheKey, serializedData, 24*time.Hour)
		if err != nil {
			m.Logger.Debug("Failed to save data to cache", slog.String("key", cacheKey), slog.String("err", err.Error()))
		}
	}

	m.Logger.Debug("Cache miss!", slog.String("key", cacheKey))
	return &response, nil
}
