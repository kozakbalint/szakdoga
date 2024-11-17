package main

import (
	"net/http"

	tmdb "github.com/cyruzin/golang-tmdb"
)

type providerResponse struct {
	Streaming []watchprovider `json:"streaming"`
	Buy       []watchprovider `json:"buy"`
}

type watchprovider struct {
	ID      int64  `json:"id"`
	LogoURL string `json:"logo_url"`
	Name    string `json:"name"`
}

func (app *application) watchMovieHandler(w http.ResponseWriter, r *http.Request) {
	id, err := app.readIDParam(r)
	if err != nil {
		app.badRequestResponse(w, r, err)
		return
	}

	providers, err := app.tmdb.GetMovieWatchProviders(int(id), nil)
	if err != nil {
		app.serverErrorResponse(w, r, err)
		return
	}
	huProviders := providers.Results["HU"]
	var response providerResponse
	for _, provider := range huProviders.Flatrate {
		response.Streaming = append(response.Streaming, watchprovider{
			ID:      provider.ProviderID,
			LogoURL: tmdb.GetImageURL(provider.LogoPath, "w92"),
			Name:    provider.ProviderName,
		})
	}
	for _, provider := range huProviders.Buy {
		response.Buy = append(response.Buy, watchprovider{
			ID:      provider.ProviderID,
			LogoURL: tmdb.GetImageURL(provider.LogoPath, "w92"),
			Name:    provider.ProviderName,
		})
	}

	err = app.writeJSON(w, http.StatusOK, envelope{"providers": response}, nil)
	if err != nil {
		app.serverErrorResponse(w, r, err)
	}
}

func (app *application) watchTvHandler(w http.ResponseWriter, r *http.Request) {
	id, err := app.readIDParam(r)
	if err != nil {
		app.badRequestResponse(w, r, err)
		return
	}

	providers, err := app.tmdb.GetTVWatchProviders(int(id), nil)
	if err != nil {
		app.serverErrorResponse(w, r, err)
		return
	}
	huProviders := providers.Results["HU"]
	var response providerResponse
	for _, provider := range huProviders.Flatrate {
		response.Streaming = append(response.Streaming, watchprovider{
			ID:      provider.ProviderID,
			LogoURL: tmdb.GetImageURL(provider.LogoPath, "w92"),
			Name:    provider.ProviderName,
		})
	}
	for _, provider := range huProviders.Buy {
		response.Buy = append(response.Buy, watchprovider{
			ID:      provider.ProviderID,
			LogoURL: tmdb.GetImageURL(provider.LogoPath, "w92"),
			Name:    provider.ProviderName,
		})
	}

	err = app.writeJSON(w, http.StatusOK, envelope{"providers": response}, nil)
	if err != nil {
		app.serverErrorResponse(w, r, err)
	}
}
