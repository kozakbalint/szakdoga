package handlers

import (
	"net/http"

	"github.com/kozakbalint/szakdoga/api/internal/config"
	"github.com/kozakbalint/szakdoga/api/internal/errors"
	"github.com/kozakbalint/szakdoga/api/internal/utils"
)

type HealthCheckHandler struct {
	Config *config.Config
}

func (h *HealthCheckHandler) HealthcheckHandler(w http.ResponseWriter, r *http.Request) {
	env := utils.Envelope{
		"status": "available",
		"system_info": map[string]interface{}{
			"environment":          h.Config.Env,
			"cors_trusted_origins": h.Config.CORS.TrustedOrigins,
			"version":              h.Config.Version,
		},
	}

	err := utils.WriteJSON(w, http.StatusOK, env, nil)
	if err != nil {
		errors.ServerErrorResponse(w, r, err)
	}
}
