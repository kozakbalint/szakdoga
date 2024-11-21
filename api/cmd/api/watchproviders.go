package main

import (
	"net/http"

	tmdb "github.com/cyruzin/golang-tmdb"
)

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

	err = app.writeJSON(w, http.StatusOK, envelope{"providers": response}, nil)
	if err != nil {
		app.serverErrorResponse(w, r, err)
	}
}
