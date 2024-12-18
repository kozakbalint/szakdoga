package tmdbclient

import (
	tmdb "github.com/cyruzin/golang-tmdb"
	"github.com/kozakbalint/szakdoga/api/internal/data"
	"github.com/kozakbalint/szakdoga/api/internal/repository"
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

type MovieCastResponse struct {
	ID         int64   `json:"id"`
	Name       string  `json:"name"`
	Character  string  `json:"character"`
	ProfileURL string  `json:"profile_url"`
	Popularity float32 `json:"popularity"`
}

func (m *Client) GetMovieCast(tmdbID int) (*[]MovieCastResponse, error) {
	cast, err := m.Client.GetMovieCredits(tmdbID, nil)
	if err != nil {
		return nil, err
	}

	var response []MovieCastResponse
	for i := range cast.Cast {
		cast := &cast.Cast[i]
		profileURL := ""
		if cast.ProfilePath != "" {
			profileURL = tmdb.GetImageURL(cast.ProfilePath, "w185")
		}

		response = append(response, MovieCastResponse{
			ID:         int64(cast.ID),
			Name:       cast.Name,
			Character:  cast.Character,
			ProfileURL: profileURL,
			Popularity: cast.Popularity,
		})
	}

	return &response, nil
}

type TvCastResponse struct {
	ID                int64   `json:"id"`
	Name              string  `json:"name"`
	Roles             []Role  `json:"roles"`
	ProfileURL        string  `json:"profile_url"`
	TotalEpisodeCount int     `json:"total_episode_count"`
	Popularity        float64 `json:"popularity"`
}

type Role struct {
	Character    string `json:"character"`
	EpisodeCount int    `json:"episode_count"`
}

func (m *Client) GetTvCast(tmdbID int) (*[]TvCastResponse, error) {
	cast, err := m.Client.GetTVAggregateCredits(tmdbID, nil)
	if err != nil {
		return nil, err
	}

	var response []TvCastResponse
	for i := range cast.Cast {
		cast := &cast.Cast[i]
		profileURL := ""
		if cast.ProfilePath != "" {
			profileURL = tmdb.GetImageURL(cast.ProfilePath, "w185")
		}

		var roles []Role
		for _, role := range cast.Roles {
			roles = append(roles, Role{
				Character:    role.Character,
				EpisodeCount: role.EpisodeCount,
			})
		}

		response = append(response, TvCastResponse{
			ID:                int64(cast.ID),
			Name:              cast.Name,
			Roles:             roles,
			ProfileURL:        profileURL,
			TotalEpisodeCount: cast.TotalEpisodeCount,
			Popularity:        cast.Popularity,
		})
	}

	return &response, nil
}

type MovieResponse struct {
	ID          int64   `json:"id"`
	Title       string  `json:"title"`
	Overview    string  `json:"overview"`
	ReleaseDate string  `json:"release_date"`
	Genres      Genres  `json:"genres"`
	Runtime     int     `json:"runtime"`
	PosterURL   string  `json:"poster_url"`
	Popularity  float32 `json:"popularity"`
	VoteAverage float32 `json:"vote_average"`
}

type Genres []struct {
	ID   int64  `json:"id"`
	Name string `json:"name"`
}

func (m *Client) GetMovie(tmdbID int) (*MovieResponse, error) {
	movie, err := m.Client.GetMovieDetails(tmdbID, nil)
	if err != nil {
		return nil, err
	}

	posterURL := ""
	if movie.PosterPath != "" {
		posterURL = tmdb.GetImageURL(movie.PosterPath, "w500")
	}

	genres := Genres{}
	for _, genre := range movie.Genres {
		genres = append(genres, struct {
			ID   int64  `json:"id"`
			Name string `json:"name"`
		}{
			ID:   int64(genre.ID),
			Name: genre.Name,
		})
	}

	return &MovieResponse{
		ID:          movie.ID,
		Title:       movie.Title,
		Overview:    movie.Overview,
		ReleaseDate: movie.ReleaseDate,
		Genres:      genres,
		Runtime:     movie.Runtime,
		PosterURL:   posterURL,
		Popularity:  movie.Popularity,
		VoteAverage: movie.VoteAverage,
	}, nil
}

func (m *Client) GetMovieData(tmdbID int) (*data.Movie, error) {
	movie, err := m.Client.GetMovieDetails(tmdbID, nil)
	if err != nil {
		return &data.Movie{}, err
	}

	var genres []string
	for _, genre := range movie.Genres {
		genres = append(genres, genre.Name)
	}

	return &data.Movie{
		TmdbID:      int(movie.ID),
		Title:       movie.Title,
		ReleaseDate: movie.ReleaseDate,
		PosterURL:   tmdb.GetImageURL(movie.PosterPath, "w500"),
		Overview:    movie.Overview,
		Genres:      genres,
		VoteAverage: movie.VoteAverage,
		Runtime:     movie.Runtime,
	}, nil
}

type PersonResponse struct {
	ID         int64   `json:"id"`
	Name       string  `json:"name"`
	Biography  string  `json:"biography"`
	Birthday   string  `json:"birthday"`
	ProfileURL string  `json:"profile_url"`
	Popularity float32 `json:"popularity"`
}

func (m *Client) GetPerson(tmdbID int) (*PersonResponse, error) {
	person, err := m.Client.GetPersonDetails(tmdbID, nil)
	if err != nil {
		return nil, err
	}

	profileURL := ""
	if person.ProfilePath != "" {
		profileURL = tmdb.GetImageURL(person.ProfilePath, "w185")
	}

	return &PersonResponse{
		ID:         person.ID,
		Name:       person.Name,
		Biography:  person.Biography,
		Birthday:   person.Birthday,
		ProfileURL: profileURL,
		Popularity: person.Popularity,
	}, nil
}

type MovieSearchResponse struct {
	ID          int64   `json:"id"`
	Title       string  `json:"title"`
	Overview    string  `json:"overview"`
	PosterURL   string  `json:"poster_url"`
	ReleaseDate string  `json:"release_date"`
	Popularity  float32 `json:"popularity"`
}

func (m *Client) SearchMovies(query string) (*[]MovieSearchResponse, error) {
	movies, err := m.Client.GetSearchMovies(query, nil)
	if err != nil {
		return nil, err
	}

	var response []MovieSearchResponse
	for i := range movies.Results {
		movie := &movies.Results[i]
		posterURL := ""
		if movie.PosterPath != "" {
			posterURL = tmdb.GetImageURL(movie.PosterPath, "w92")
		}
		response = append(response, MovieSearchResponse{
			ID:          movie.ID,
			Title:       movie.Title,
			Overview:    movie.Overview,
			PosterURL:   posterURL,
			ReleaseDate: movie.ReleaseDate,
			Popularity:  movie.Popularity,
		})
	}

	if len(response) == 0 {
		response = []MovieSearchResponse{}
	}

	return &response, nil
}

type TvSearchResponse struct {
	ID           int64   `json:"id"`
	Name         string  `json:"name"`
	Overview     string  `json:"overview"`
	PosterURL    string  `json:"poster_url"`
	FirstAirDate string  `json:"first_air_date"`
	Popularity   float32 `json:"popularity"`
}

func (m *Client) SearchTv(query string) (*[]TvSearchResponse, error) {
	tvShows, err := m.Client.GetSearchTVShow(query, nil)
	if err != nil {
		return nil, err
	}

	var response []TvSearchResponse
	for i := range tvShows.Results {
		tv := &tvShows.Results[i]
		posterURL := ""
		if tv.PosterPath != "" {
			posterURL = tmdb.GetImageURL(tv.PosterPath, "w92")
		}
		response = append(response, TvSearchResponse{
			ID:           tv.ID,
			Name:         tv.Name,
			Overview:     tv.Overview,
			PosterURL:    posterURL,
			FirstAirDate: tv.FirstAirDate,
			Popularity:   tv.Popularity,
		})
	}

	if len(response) == 0 {
		response = []TvSearchResponse{}
	}

	return &response, nil
}

type PersonSearchResponse struct {
	ID         int64   `json:"id"`
	Name       string  `json:"name"`
	ProfileURL string  `json:"profile_url"`
	Popularity float32 `json:"popularity"`
}

func (m *Client) SearchPeople(query string) (*[]PersonSearchResponse, error) {
	people, err := m.Client.GetSearchPeople(query, nil)
	if err != nil {
		return nil, err
	}

	var response []PersonSearchResponse
	for i := range people.Results {
		person := &people.Results[i]
		profileURL := ""
		if person.ProfilePath != "" {
			profileURL = tmdb.GetImageURL(person.ProfilePath, "w185")
		}

		response = append(response, PersonSearchResponse{
			ID:         person.ID,
			Name:       person.Name,
			ProfileURL: profileURL,
			Popularity: person.Popularity,
		})
	}

	if len(response) == 0 {
		response = []PersonSearchResponse{}
	}

	return &response, nil
}

type TvResponse struct {
	ID               int64   `json:"id"`
	Name             string  `json:"name"`
	Overview         string  `json:"overview"`
	FirstAirDate     string  `json:"first_air_date"`
	PosterURL        string  `json:"poster_url"`
	Genres           Genres  `json:"genres"`
	NumberOfSeasons  int     `json:"number_of_seasons"`
	NumberOfEpisodes int     `json:"number_of_episodes"`
	Popularity       float32 `json:"popularity"`
	VoteAverage      float32 `json:"vote_average"`
}

func (m *Client) GetTv(tmdbID int) (*TvResponse, error) {
	tv, err := m.Client.GetTVDetails(tmdbID, nil)
	if err != nil {
		return nil, err
	}

	posterURL := ""
	if tv.PosterPath != "" {
		posterURL = tmdb.GetImageURL(tv.PosterPath, "w500")
	}

	genres := Genres{}
	for _, genre := range tv.Genres {
		genres = append(genres, struct {
			ID   int64  `json:"id"`
			Name string `json:"name"`
		}{
			ID:   int64(genre.ID),
			Name: genre.Name,
		})
	}

	return &TvResponse{
		ID:               tv.ID,
		Name:             tv.Name,
		Overview:         tv.Overview,
		FirstAirDate:     tv.FirstAirDate,
		PosterURL:        posterURL,
		Genres:           genres,
		NumberOfSeasons:  tv.NumberOfSeasons,
		NumberOfEpisodes: tv.NumberOfEpisodes,
		Popularity:       tv.Popularity,
		VoteAverage:      tv.VoteAverage,
	}, nil
}

func (m *Client) GetTvData(tmdbID int) (*data.TVShow, error) {
	tvDetails, err := m.Client.GetTVDetails(tmdbID, nil)
	if err != nil {
		return nil, err
	}

	var genres []string
	for _, genre := range tvDetails.Genres {
		genres = append(genres, genre.Name)
	}

	tvShow := &data.TVShow{
		TmdbID:      int(tvDetails.ID),
		Title:       tvDetails.Name,
		ReleaseDate: tvDetails.FirstAirDate,
		PosterURL:   tmdb.GetImageURL(tvDetails.PosterPath, "w500"),
		Overview:    tvDetails.Overview,
		Genres:      genres,
		VoteAverage: tvDetails.VoteAverage,
	}

	var tvShowSeasons []data.TVShowSeason
	for _, season := range tvDetails.Seasons {
		if season.SeasonNumber == 0 {
			continue
		}

		tvShowSeasons = append(tvShowSeasons, data.TVShowSeason{
			SeasonNumber: int(season.SeasonNumber),
			EpisodeCount: int(season.EpisodeCount),
			AirDate:      season.AirDate,
		})
	}
	tvShow.Seasons = tvShowSeasons

	var tvShowEpisodes []data.TVShowEpisode
	for i, season := range tvShow.Seasons {
		tvShowEpisodes = []data.TVShowEpisode{}
		episodes, err := m.GetTVSeasonDetails(int(tvDetails.ID), int(season.SeasonNumber))
		if err != nil {
			return nil, err
		}
		for _, episode := range episodes.Season.Episodes {
			tvShowEpisodes = append(tvShowEpisodes, data.TVShowEpisode{
				EpisodeNumber: episode.EpisodeNumber,
				Title:         episode.Name,
				Overview:      episode.Overview,
				AirDate:       episode.AirDate,
			})
		}

		tvShow.Seasons[i].Episodes = tvShowEpisodes
	}

	return tvShow, nil
}

type TvSeasonsResponse struct {
	TvID                   int64                    `json:"tv_id"`
	SeasonCount            int                      `json:"season_count"`
	SeasonsWithoutEpisodes []SeasonsWithoutEpisodes `json:"seasons_without_episodes"`
}

type SeasonsWithoutEpisodes struct {
	SeasonNumber int     `json:"season_number"`
	EpisodeCount int     `json:"episode_count"`
	Name         string  `json:"name"`
	Overview     string  `json:"overview"`
	PosterURL    string  `json:"poster_url"`
	VoteAverage  float32 `json:"vote_average"`
}

func (m *Client) GetTvSeasons(tmdbID int) (*TvSeasonsResponse, error) {
	tvDetails, err := m.Client.GetTVDetails(tmdbID, nil)
	if err != nil {
		return nil, err
	}

	var tvSeasonsResponse = TvSeasonsResponse{
		TvID:        int64(tmdbID),
		SeasonCount: tvDetails.NumberOfSeasons,
	}

	for i := range tvDetails.Seasons {
		season := &tvDetails.Seasons[i]
		if season.SeasonNumber == 0 {
			continue
		}

		posterURL := tmdb.GetImageURL(season.PosterPath, "w500")

		tvSeasonsResponse.SeasonsWithoutEpisodes = append(tvSeasonsResponse.SeasonsWithoutEpisodes, SeasonsWithoutEpisodes{
			SeasonNumber: season.SeasonNumber,
			EpisodeCount: season.EpisodeCount,
			Name:         season.Name,
			Overview:     season.Overview,
			PosterURL:    posterURL,
			VoteAverage:  season.VoteAverage,
		})
	}

	return &tvSeasonsResponse, nil
}

type TvSeasonResponse struct {
	TvID   int64  `json:"tv_id"`
	Season Season `json:"season"`
}

type Season struct {
	SeasonNumber int       `json:"season_number"`
	EpisodeCount int       `json:"episode_count"`
	Name         string    `json:"name"`
	Overview     string    `json:"overview"`
	PosterURL    string    `json:"poster_url"`
	VoteAverage  float32   `json:"vote_average"`
	Episodes     []Episode `json:"episodes"`
}

func (m *Client) GetTVSeasonDetails(tmdbID, seasonNumber int) (*TvSeasonResponse, error) {
	season, err := m.Client.GetTVSeasonDetails(tmdbID, seasonNumber, nil)
	if err != nil {
		return nil, err
	}

	var episodes []Episode
	for i := range season.Episodes {
		episode := &season.Episodes[i]
		stillURL := ""
		if episode.StillPath != "" {
			stillURL = tmdb.GetImageURL(episode.StillPath, "w500")
		}
		episodes = append(episodes, Episode{
			AirDate:       episode.AirDate,
			EpisodeNumber: episode.EpisodeNumber,
			Name:          episode.Name,
			Overview:      episode.Overview,
			Runtime:       episode.Runtime,
			StillURL:      stillURL,
			VoteAverage:   episode.VoteAverage,
		})
	}

	posterURL := ""
	if season.PosterPath != "" {
		posterURL = tmdb.GetImageURL(season.PosterPath, "w500")
	}

	return &TvSeasonResponse{
		TvID: int64(tmdbID),
		Season: Season{
			SeasonNumber: season.SeasonNumber,
			EpisodeCount: len(episodes),
			Name:         season.Name,
			Overview:     season.Overview,
			VoteAverage:  season.VoteAverage,
			PosterURL:    posterURL,
			Episodes:     episodes,
		},
	}, nil
}

type TvEpisodeResponse struct {
	TvID         int64   `json:"tv_id"`
	SeasonNumber int     `json:"season_number"`
	Episode      Episode `json:"episode"`
}

type Episode struct {
	AirDate       string  `json:"air_date"`
	EpisodeNumber int     `json:"episode_number"`
	Name          string  `json:"name"`
	Overview      string  `json:"overview"`
	Runtime       int     `json:"runtime"`
	StillURL      string  `json:"still_url"`
	VoteAverage   float32 `json:"vote_average"`
}

func (m *Client) GetTVEpisodeDetails(tmdbID, seasonNumber, episodeNumber int) (*TvEpisodeResponse, error) {
	episode, err := m.Client.GetTVEpisodeDetails(tmdbID, seasonNumber, episodeNumber, nil)
	if err != nil {
		return nil, err
	}

	stillURL := ""
	if episode.StillPath != "" {
		stillURL = tmdb.GetImageURL(episode.StillPath, "w500")
	}

	return &TvEpisodeResponse{
		TvID:         int64(tmdbID),
		SeasonNumber: seasonNumber,
		Episode: Episode{
			AirDate:       episode.AirDate,
			EpisodeNumber: episode.EpisodeNumber,
			Name:          episode.Name,
			Overview:      episode.Overview,
			Runtime:       episode.Runtime,
			StillURL:      stillURL,
			VoteAverage:   episode.VoteAverage,
		},
	}, nil
}

type WatchProviderResponse struct {
	Streaming []Watchprovider `json:"streaming"`
	Buy       []Watchprovider `json:"buy"`
}

type Watchprovider struct {
	ID      int64  `json:"id"`
	LogoURL string `json:"logo_url"`
	Name    string `json:"name"`
}

func (m *Client) GetMovieWatchProviders(tmdbID int) (*WatchProviderResponse, error) {
	providers, err := m.Client.GetMovieWatchProviders(tmdbID, nil)
	if err != nil {
		return nil, err
	}

	huProviders := providers.Results["HU"]
	var response WatchProviderResponse
	for _, provider := range huProviders.Flatrate {
		response.Streaming = append(response.Streaming, Watchprovider{
			ID:      provider.ProviderID,
			LogoURL: tmdb.GetImageURL(provider.LogoPath, "w92"),
			Name:    provider.ProviderName,
		})
	}
	for _, provider := range huProviders.Buy {
		response.Buy = append(response.Buy, Watchprovider{
			ID:      provider.ProviderID,
			LogoURL: tmdb.GetImageURL(provider.LogoPath, "w92"),
			Name:    provider.ProviderName,
		})
	}

	return &response, nil
}

func (m *Client) GetTvWatchProviders(tmdbID int) (*WatchProviderResponse, error) {
	providers, err := m.Client.GetTVWatchProviders(tmdbID, nil)
	if err != nil {
		return nil, err
	}

	huProviders := providers.Results["HU"]
	var response WatchProviderResponse
	for _, provider := range huProviders.Flatrate {
		response.Streaming = append(response.Streaming, Watchprovider{
			ID:      provider.ProviderID,
			LogoURL: tmdb.GetImageURL(provider.LogoPath, "w92"),
			Name:    provider.ProviderName,
		})
	}
	for _, provider := range huProviders.Buy {
		response.Buy = append(response.Buy, Watchprovider{
			ID:      provider.ProviderID,
			LogoURL: tmdb.GetImageURL(provider.LogoPath, "w92"),
			Name:    provider.ProviderName,
		})
	}

	return &response, nil
}
