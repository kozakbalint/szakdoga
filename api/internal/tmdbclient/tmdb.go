package tmdbclient

import (
	tmdb "github.com/cyruzin/golang-tmdb"
	"github.com/kozakbalint/szakdoga/api/internal/repository"
	"github.com/kozakbalint/szakdoga/api/internal/types"
)

func NewClient(tmdbClient *tmdb.Client, repo *repository.Queries) *Client {
	return &Client{
		Client:     tmdbClient,
		Repository: repo,
	}
}

type Client struct {
	Client     *tmdb.Client
	Repository *repository.Queries
}

func (m *Client) GetMovieCast(tmdbID int) (*[]types.CastMovies, error) {
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
			Id:         &cast.ID,
			Name:       &cast.Name,
			Character:  &cast.Character,
			Order:      &cast.Order,
			ProfileUrl: &profileURL,
			Popularity: &cast.Popularity,
		})
	}

	return &response, nil
}

func (m *Client) GetTvCast(tmdbID int) (*[]types.CastTv, error) {
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
				Character:    &character,
				EpisodeCount: &episodeCount,
			})
		}

		id := int64(cast.ID)
		name := cast.Name
		order := cast.Order
		popularity := float32(cast.Popularity)

		response = append(response, types.CastTv{
			Id:         &id,
			Name:       &name,
			Order:      &order,
			Roles:      &roles,
			ProfileUrl: &profileURL,
			Popularity: &popularity,
		})
	}

	return &response, nil
}

func (m *Client) GetMovie(tmdbID int) (*types.MovieDetails, error) {
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

	return &types.MovieDetails{
		Id:          &movie.ID,
		Title:       &movie.Title,
		Overview:    &movie.Overview,
		ReleaseDate: &movie.ReleaseDate,
		Genres:      &genres,
		Runtime:     &movie.Runtime,
		PosterUrl:   &posterURL,
		Popularity:  &movie.Popularity,
		VoteAverage: &movie.VoteAverage,
	}, nil
}

func (m *Client) GetPerson(tmdbID int) (*types.PersonDetails, error) {
	person, err := m.Client.GetPersonDetails(tmdbID, nil)
	if err != nil {
		return nil, err
	}

	profileURL := ""
	if person.ProfilePath != "" {
		profileURL = tmdb.GetImageURL(person.ProfilePath, "w185")
	}

	return &types.PersonDetails{
		Id:         &person.ID,
		Name:       &person.Name,
		Biography:  &person.Biography,
		Birthday:   &person.Birthday,
		ProfileUrl: &profileURL,
		Popularity: &person.Popularity,
	}, nil
}

func (m *Client) SearchMovies(query string) (*[]types.SearchMovie, error) {
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
			Id:          &movie.ID,
			Title:       &movie.Title,
			Overview:    &movie.Overview,
			PosterUrl:   &posterURL,
			ReleaseDate: &movie.ReleaseDate,
			Popularity:  &movie.Popularity,
			VoteAverage: &movie.VoteAverage,
		})
	}

	if len(response) == 0 {
		response = []types.SearchMovie{}
	}

	return &response, nil
}

func (m *Client) SearchTv(query string) (*[]types.SearchTv, error) {
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
			Id:          &tv.ID,
			Title:       &tv.Name,
			Overview:    &tv.Overview,
			PosterUrl:   &posterURL,
			ReleaseDate: &tv.FirstAirDate,
			Popularity:  &tv.Popularity,
			VoteAverage: &tv.VoteAverage,
		})
	}

	if len(response) == 0 {
		response = []types.SearchTv{}
	}

	return &response, nil
}

func (m *Client) SearchPeople(query string) (*[]types.SearchPeople, error) {
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
			Id:         &person.ID,
			Name:       &person.Name,
			ProfileUrl: &profileURL,
			Popularity: &person.Popularity,
		})
	}

	if len(response) == 0 {
		response = []types.SearchPeople{}
	}

	return &response, nil
}

func (m *Client) GetTv(tmdbID int) (*types.TvDetails, error) {
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
		posterUrl := tmdb.GetImageURL(season.PosterPath, "w500")

		seasons = append(seasons, types.TvSeason{
			AirDate:      &season.AirDate,
			EpisodeCount: &season.EpisodeCount,
			Id:           &season.ID,
			Name:         &season.Name,
			Overview:     &season.Overview,
			PosterUrl:    &posterUrl,
			VoteAverage:  &season.VoteAverage,
		})
	}

	return &types.TvDetails{
		Id:               &tv.ID,
		Name:             &tv.Name,
		Overview:         &tv.Overview,
		FirstAirDate:     &tv.FirstAirDate,
		PosterUrl:        &posterURL,
		Genres:           &genres,
		NumberOfSeasons:  &tv.NumberOfSeasons,
		NumberOfEpisodes: &tv.NumberOfEpisodes,
		Popularity:       &tv.Popularity,
		VoteAverage:      &tv.VoteAverage,
		Status:           &tv.Status,
		Seasons:          &seasons,
	}, nil
}

func (m *Client) GetTvSeason(tmdbID int, seasonNumber int) (*types.TvSeasonDetails, error) {
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
			AirDate:     &episode.AirDate,
			Id:          &episode.ID,
			Name:        &episode.Name,
			Overview:    &episode.Overview,
			Runtime:     &episode.Runtime,
			StillUrl:    &stillURL,
			VoteAverage: &episode.VoteAverage,
		})
	}

	var tvSeasonsResponse = types.TvSeasonDetails{
		Id:          &tvDetails.ID,
		Name:        &tvDetails.Name,
		Overview:    &tvDetails.Overview,
		AirDate:     &tvDetails.AirDate,
		PosterUrl:   &posterURL,
		VoteAverage: &tvDetails.VoteAverage,
		Episodes:    &episodes,
	}

	return &tvSeasonsResponse, nil
}

func (m *Client) GetTvEpisode(tmdbID, seasonNumber, episodeNumber int) (*types.TvEpisodeDetails, error) {
	episode, err := m.Client.GetTVEpisodeDetails(tmdbID, seasonNumber, episodeNumber, nil)
	if err != nil {
		return nil, err
	}

	stillURL := ""
	if episode.StillPath != "" {
		stillURL = tmdb.GetImageURL(episode.StillPath, "w500")
	}

	return &types.TvEpisodeDetails{
		Id:          &episode.ID,
		Name:        &episode.Name,
		Overview:    &episode.Overview,
		AirDate:     &episode.AirDate,
		StillUrl:    &stillURL,
		VoteAverage: &episode.VoteAverage,
		Runtime:     &episode.Runtime,
	}, nil
}

func (m *Client) GetMovieWatchProviders(tmdbID int) (*types.WatchProviders, error) {
	providers, err := m.Client.GetMovieWatchProviders(tmdbID, nil)
	if err != nil {
		return nil, err
	}

	huProviders := providers.Results["HU"]
	id := int64(tmdbID)
	var response = types.WatchProviders{
		Id: &id,
	}

	for _, provider := range huProviders.Flatrate {
		logoURL := tmdb.GetImageURL(provider.LogoPath, "w92")
		displayPriority := int(provider.DisplayPriority)
		*response.Providers.Flatrate = append(*response.Providers.Flatrate, types.Flatrate{
			ProviderId:      &provider.ProviderID,
			ProviderName:    &provider.ProviderName,
			LogoUrl:         &logoURL,
			DisplayPriority: &displayPriority,
		})
	}

	for _, provider := range huProviders.Buy {
		logoURL := tmdb.GetImageURL(provider.LogoPath, "w92")
		displayPriority := int(provider.DisplayPriority)
		*response.Providers.Buy = append(*response.Providers.Buy, types.Buy{
			ProviderId:      &provider.ProviderID,
			ProviderName:    &provider.ProviderName,
			LogoUrl:         &logoURL,
			DisplayPriority: &displayPriority,
		})
	}

	for _, provider := range huProviders.Rent {
		logoURL := tmdb.GetImageURL(provider.LogoPath, "w92")
		displayPriority := int(provider.DisplayPriority)
		*response.Providers.Rent = append(*response.Providers.Rent, types.Rent{
			ProviderId:      &provider.ProviderID,
			ProviderName:    &provider.ProviderName,
			LogoUrl:         &logoURL,
			DisplayPriority: &displayPriority,
		})
	}

	return &response, nil
}

func (m *Client) GetTvWatchProviders(tmdbID int) (*types.WatchProviders, error) {
	providers, err := m.Client.GetTVWatchProviders(tmdbID, nil)
	if err != nil {
		return nil, err
	}

	huProviders := providers.Results["HU"]
	id := int64(tmdbID)
	var response = types.WatchProviders{
		Id: &id,
	}

	for _, provider := range huProviders.Flatrate {
		logoURL := tmdb.GetImageURL(provider.LogoPath, "w92")
		displayPriority := int(provider.DisplayPriority)
		*response.Providers.Flatrate = append(*response.Providers.Flatrate, types.Flatrate{
			ProviderId:      &provider.ProviderID,
			ProviderName:    &provider.ProviderName,
			LogoUrl:         &logoURL,
			DisplayPriority: &displayPriority,
		})
	}

	for _, provider := range huProviders.Buy {
		logoURL := tmdb.GetImageURL(provider.LogoPath, "w92")
		displayPriority := int(provider.DisplayPriority)
		*response.Providers.Buy = append(*response.Providers.Buy, types.Buy{
			ProviderId:      &provider.ProviderID,
			ProviderName:    &provider.ProviderName,
			LogoUrl:         &logoURL,
			DisplayPriority: &displayPriority,
		})
	}

	for _, provider := range huProviders.Rent {
		logoURL := tmdb.GetImageURL(provider.LogoPath, "w92")
		displayPriority := int(provider.DisplayPriority)
		*response.Providers.Rent = append(*response.Providers.Rent, types.Rent{
			ProviderId:      &provider.ProviderID,
			ProviderName:    &provider.ProviderName,
			LogoUrl:         &logoURL,
			DisplayPriority: &displayPriority,
		})
	}

	return &response, nil
}
