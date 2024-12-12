package handlers

import (
	e "errors"
	"net/http"

	tmdb "github.com/cyruzin/golang-tmdb"
	"github.com/kozakbalint/szakdoga/api/internal/errors"
	"github.com/kozakbalint/szakdoga/api/internal/utils"
)

type SearchHandler struct {
	Tmdb *tmdb.Client
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

func (h *SearchHandler) SearchMoviesHandler(w http.ResponseWriter, r *http.Request) {
	queryParams, err := utils.ReadQueryParams(r)
	if err != nil {
		errors.BadRequestResponse(w, r, err)
		return
	}
	query := queryParams["q"]
	if query == "" {
		errors.BadRequestResponse(w, r, e.New("missing query parameter"))
		return
	}

	movies, err := h.Tmdb.GetSearchMovies(query, nil)
	if err != nil {
		errors.ServerErrorResponse(w, r, err)
		return
	}

	var response []MovieSearchResponse
	for _, movie := range movies.Results {
		poster_url := ""
		if movie.PosterPath != "" {
			poster_url = tmdb.GetImageURL(movie.PosterPath, "w92")
		}
		response = append(response, MovieSearchResponse{
			ID:          movie.ID,
			Title:       movie.Title,
			Overview:    movie.Overview,
			PosterUrl:   poster_url,
			ReleaseDate: movie.ReleaseDate,
			Popularity:  movie.Popularity,
		})
	}

	err = utils.WriteJSON(w, http.StatusOK, utils.Envelope{"movies": response}, nil)
	if err != nil {
		errors.ServerErrorResponse(w, r, err)
	}
}

func (h *SearchHandler) SearchPeopleHandler(w http.ResponseWriter, r *http.Request) {
	queryParams, err := utils.ReadQueryParams(r)
	if err != nil {
		errors.BadRequestResponse(w, r, err)
		return
	}
	query := queryParams["q"]
	if query == "" {
		errors.BadRequestResponse(w, r, e.New("missing query parameter"))
		return
	}

	people, err := h.Tmdb.GetSearchPeople(query, nil)
	if err != nil {
		errors.ServerErrorResponse(w, r, err)
		return
	}

	var response []PersonSearchResponse
	for _, person := range people.Results {
		profile_url := ""
		if person.ProfilePath != "" {
			profile_url = tmdb.GetImageURL(person.ProfilePath, "w185")
		}
		response = append(response, PersonSearchResponse{
			ID:         person.ID,
			Name:       person.Name,
			ProfileUrl: profile_url,
			Popularity: person.Popularity,
		})
	}

	err = utils.WriteJSON(w, http.StatusOK, utils.Envelope{"people": response}, nil)
	if err != nil {
		errors.ServerErrorResponse(w, r, err)
	}
}

func (h *SearchHandler) SearchTvHandler(w http.ResponseWriter, r *http.Request) {
	queryParams, err := utils.ReadQueryParams(r)
	if err != nil {
		errors.BadRequestResponse(w, r, err)
		return
	}
	query := queryParams["q"]
	if query == "" {
		errors.BadRequestResponse(w, r, e.New("missing query parameter"))
		return
	}

	tv, err := h.Tmdb.GetSearchTVShow(query, nil)
	if err != nil {
		errors.ServerErrorResponse(w, r, err)
		return
	}

	var response []TvSearchResponse
	for _, show := range tv.Results {
		posterUrl := ""
		if show.PosterPath != "" {
			posterUrl = tmdb.GetImageURL(show.PosterPath, "w92")
		}

		response = append(response, TvSearchResponse{
			ID:           show.ID,
			Name:         show.Name,
			Overview:     show.Overview,
			PosterUrl:    posterUrl,
			FirstAirDate: show.FirstAirDate,
			Popularity:   show.Popularity,
		})
	}

	err = utils.WriteJSON(w, http.StatusOK, utils.Envelope{"tv": response}, nil)
	if err != nil {
		errors.ServerErrorResponse(w, r, err)
	}
}
