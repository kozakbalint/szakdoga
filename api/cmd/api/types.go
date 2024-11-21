package main

import "github.com/kozakbalint/szakdoga/api/internal/data"

type LoginResponse struct {
	AuthenticationToken string    `json:"authentication_token"`
	User                data.User `json:"user"`
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

type MovieCastResponse struct {
	ID         int64   `json:"id"`
	Name       string  `json:"name"`
	Character  string  `json:"character"`
	ProfileUrl string  `json:"profile_url"`
	Popularity float32 `json:"popularity"`
}

type TvCastResponse struct {
	ID                int64   `json:"id"`
	Name              string  `json:"name"`
	Roles             []Role  `json:"roles"`
	ProfileUrl        string  `json:"profile_url"`
	TotalEpisodeCount int     `json:"total_episode_count"`
	Popularity        float64 `json:"popularity"`
}

type Role struct {
	Character    string `json:"character"`
	EpisodeCount int    `json:"episode_count"`
}

type Genres []struct {
	ID   int64  `json:"id"`
	Name string `json:"name"`
}

type MovieResponse struct {
	ID          int64   `json:"id"`
	Title       string  `json:"title"`
	Overview    string  `json:"overview"`
	ReleaseDate string  `json:"release_date"`
	Genres      Genres  `json:"genres"`
	Runtime     int     `json:"runtime"`
	PosterUrl   string  `json:"poster_url"`
	Popularity  float32 `json:"popularity"`
	VoteAverage float32 `json:"vote_average"`
}

type PersonResponse struct {
	ID         int64   `json:"id"`
	Name       string  `json:"name"`
	Biography  string  `json:"biography"`
	Birthday   string  `json:"birthday"`
	ProfileUrl string  `json:"profile_url"`
	Popularity float32 `json:"popularity"`
}

type MovieSearchResponse struct {
	ID          int64   `json:"id"`
	Title       string  `json:"title"`
	Overview    string  `json:"overview"`
	PosterUrl   string  `json:"poster_url"`
	ReleaseDate string  `json:"release_date"`
	Popularity  float32 `json:"popularity"`
}

type TvSearchResponse struct {
	ID           int64   `json:"id"`
	Name         string  `json:"name"`
	Overview     string  `json:"overview"`
	PosterUrl    string  `json:"poster_url"`
	FirstAirDate string  `json:"first_air_date"`
	Popularity   float32 `json:"popularity"`
}

type PersonSearchResponse struct {
	ID         int64   `json:"id"`
	Name       string  `json:"name"`
	ProfileUrl string  `json:"profile_url"`
	Popularity float32 `json:"popularity"`
}

type TvResponse struct {
	ID               int64   `json:"id"`
	Name             string  `json:"name"`
	Overview         string  `json:"overview"`
	FirstAirDate     string  `json:"first_air_date"`
	PosterUrl        string  `json:"poster_url"`
	Genres           Genres  `json:"genres"`
	NumberOfSeasons  int     `json:"number_of_seasons"`
	NumberOfEpisodes int     `json:"number_of_episodes"`
	Popularity       float32 `json:"popularity"`
	VoteAverage      float32 `json:"vote_average"`
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
	PosterUrl    string  `json:"poster_url"`
	VoteAverage  float32 `json:"vote_average"`
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
	PosterUrl    string    `json:"poster_url"`
	VoteAverage  float32   `json:"vote_average"`
	Episodes     []Episode `json:"episodes"`
}

type TvEpisodeResponse struct {
	TvId         int64   `json:"tv_id"`
	SeasonNumber int     `json:"season_number"`
	Episode      Episode `json:"episode"`
}

type Episode struct {
	AirDate       string  `json:"air_date"`
	EpisodeNumber int     `json:"episode_number"`
	Name          string  `json:"name"`
	Overview      string  `json:"overview"`
	Runtime       int     `json:"runtime"`
	StillUrl      string  `json:"still_url"`
	VoteAverage   float32 `json:"vote_average"`
}
