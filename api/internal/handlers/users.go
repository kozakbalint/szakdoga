package handlers

import (
	e "errors"
	"net/http"

	"github.com/kozakbalint/szakdoga/api/internal/context"
	"github.com/kozakbalint/szakdoga/api/internal/data"
	"github.com/kozakbalint/szakdoga/api/internal/errors"
	"github.com/kozakbalint/szakdoga/api/internal/repository"
	"github.com/kozakbalint/szakdoga/api/internal/utils"
	"github.com/kozakbalint/szakdoga/api/internal/validator"
)

type UsersHandler struct {
	Models     *data.Models
	Repository *repository.Queries
}

func (h *UsersHandler) CreateUserHandler(w http.ResponseWriter, r *http.Request) {
	var input struct {
		Name     string `json:"name"`
		Email    string `json:"email"`
		Password string `json:"password"`
	}

	err := utils.ReadJSON(w, r, &input)
	if err != nil {
		errors.BadRequestResponse(w, r, err)
		return
	}

	user := &data.User{
		Name:  input.Name,
		Email: input.Email,
	}

	err = user.Password.Set(input.Password)
	if err != nil {
		errors.ServerErrorResponse(w, r, err)
		return
	}

	v := validator.New()
	data.ValidateUser(v, user)
	if !v.Valid() {
		errors.FailedValidationResponse(w, r, v.Errors)
		return
	}

	user, err = h.Models.Users.Insert(user)
	if err != nil {
		switch {
		case e.Is(err, data.ErrDuplicateEmail):
			v.AddError("email", "This email address already in use")
			errors.FailedValidationResponse(w, r, v.Errors)
		default:
			errors.ServerErrorResponse(w, r, err)
		}
		return
	}

	err = utils.WriteJSON(w, http.StatusCreated, utils.Envelope{"user": user}, nil)
	if err != nil {
		errors.ServerErrorResponse(w, r, err)
	}
}

func (h *UsersHandler) GetRequestUserHandler(w http.ResponseWriter, r *http.Request) {
	user := context.GetUser(r)

	if user.IsAnonymous() {
		errors.AuthenticationRequiredResponse(w, r)
		return
	}

	userResponse := &data.User{
		ID:        user.ID,
		CreatedAt: user.CreatedAt,
		Name:      user.Name,
		Email:     user.Email,
	}

	err := utils.WriteJSON(w, http.StatusOK, utils.Envelope{"user": userResponse}, nil)
	if err != nil {
		errors.ServerErrorResponse(w, r, err)
	}
}
