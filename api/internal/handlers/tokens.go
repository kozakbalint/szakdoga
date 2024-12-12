package handlers

import (
	e "errors"
	"net/http"
	"time"

	"github.com/kozakbalint/szakdoga/api/internal/context"
	"github.com/kozakbalint/szakdoga/api/internal/data"
	"github.com/kozakbalint/szakdoga/api/internal/errors"
	"github.com/kozakbalint/szakdoga/api/internal/repository"
	"github.com/kozakbalint/szakdoga/api/internal/utils"
	"github.com/kozakbalint/szakdoga/api/internal/validator"
)

type TokensHandler struct {
	Models     *data.Models
	Repository *repository.Queries
}

func (h *TokensHandler) CreateAuthenticationTokenHandler(w http.ResponseWriter, r *http.Request) {
	var input struct {
		Email    string `json:"email"`
		Password string `json:"password"`
	}

	err := utils.ReadJSON(w, r, &input)
	if err != nil {
		errors.BadRequestResponse(w, r, err)
		return
	}

	v := validator.New()

	data.ValidateEmail(v, input.Email)
	data.ValidatePasswordPlaintext(v, input.Password)

	if !v.Valid() {
		errors.FailedValidationResponse(w, r, v.Errors)
		return
	}

	user, err := h.Models.Users.GetByEmail(input.Email)
	if err != nil {
		switch {
		case e.Is(err, data.ErrRecordNotFound):
			errors.InvalidCredentialsResponse(w, r)
		default:
			errors.ServerErrorResponse(w, r, err)
		}
		return
	}

	match, err := user.Password.Matches(input.Password)
	if err != nil {
		errors.ServerErrorResponse(w, r, err)
		return
	}

	if !match {
		errors.InvalidCredentialsResponse(w, r)
		return
	}

	token, err := h.Models.Tokens.New(user.ID, 4*7*24*time.Hour)
	if err != nil {
		errors.ServerErrorResponse(w, r, err)
		return
	}

	err = utils.WriteJSON(w, http.StatusCreated, utils.Envelope{"authentication_token": token}, nil)
	if err != nil {
		errors.ServerErrorResponse(w, r, err)
	}
}

func (h *TokensHandler) InvalidateAuthenticationTokenHandler(w http.ResponseWriter, r *http.Request) {
	user := context.ContextGetUser(r)

	err := h.Models.Tokens.DeleteAllForUser(user.ID)
	if err != nil {
		errors.ServerErrorResponse(w, r, err)
		return
	}

	err = utils.WriteJSON(w, http.StatusOK, utils.Envelope{"message": "authentication token(s) successfully deleted"}, nil)
	if err != nil {
		errors.ServerErrorResponse(w, r, err)
	}
}
