package handlers

import (
	"net/http"

	tmdb "github.com/cyruzin/golang-tmdb"
	"github.com/kozakbalint/szakdoga/api/internal/errors"
	"github.com/kozakbalint/szakdoga/api/internal/utils"
)

type WatchProviderHandler struct {
	Tmdb *tmdb.Client
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

func (h *WatchProviderHandler) WatchProvidersMovieHandler(w http.ResponseWriter, r *http.Request) {
	id, err := utils.ReadIDParam(r)
	if err != nil {
		errors.BadRequestResponse(w, r, err)
		return
	}

	providers, err := h.Tmdb.GetMovieWatchProviders(int(id), nil)
	if err != nil {
		errors.ServerErrorResponse(w, r, err)
		return
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

	err = utils.WriteJSON(w, http.StatusOK, utils.Envelope{"providers": response}, nil)
	if err != nil {
		errors.ServerErrorResponse(w, r, err)
	}
}

func (h *WatchProviderHandler) WatchProvidersTvHandler(w http.ResponseWriter, r *http.Request) {
	id, err := utils.ReadIDParam(r)
	if err != nil {
		errors.BadRequestResponse(w, r, err)
		return
	}

	providers, err := h.Tmdb.GetTVWatchProviders(int(id), nil)
	if err != nil {
		errors.ServerErrorResponse(w, r, err)
		return
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

	err = utils.WriteJSON(w, http.StatusOK, utils.Envelope{"providers": response}, nil)
	if err != nil {
		errors.ServerErrorResponse(w, r, err)
	}
}
