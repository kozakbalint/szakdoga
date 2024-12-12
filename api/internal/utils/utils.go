package utils

import (
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"math"
	"math/big"
	"net/http"
	"strconv"
	"strings"

	"github.com/jackc/pgx/v5/pgtype"
	"github.com/julienschmidt/httprouter"
)

func ReadQueryParams(r *http.Request) (map[string]string, error) {
	queryParams := make(map[string]string)

	query := r.URL.Query()
	for key, value := range query {
		if len(value) > 0 {
			queryParams[key] = value[0]
		}
	}

	return queryParams, nil
}

func ReadIDParam(r *http.Request) (int64, error) {
	params := httprouter.ParamsFromContext(r.Context())

	id, err := strconv.ParseInt(params.ByName("id"), 10, 64)
	if err != nil {
		return 0, errors.New("invalid id parameter")
	}

	return id, nil
}

func ReadSeasonParam(r *http.Request) (int, error) {
	params := httprouter.ParamsFromContext(r.Context())

	season, err := strconv.Atoi(params.ByName("season"))
	if err != nil {
		return 0, errors.New("invalid season parameter")
	}

	return season, nil
}

func ReadEpisodeParam(r *http.Request) (int, error) {
	params := httprouter.ParamsFromContext(r.Context())

	episode, err := strconv.Atoi(params.ByName("episode"))
	if err != nil {
		return 0, errors.New("invalid episode parameter")
	}

	return episode, nil
}

type Envelope map[string]any

func WriteJSON(w http.ResponseWriter, status int, data Envelope, headers http.Header) error {
	js, err := json.MarshalIndent(data, "", "\t")
	if err != nil {
		return err
	}

	js = append(js, '\n')

	for key, value := range headers {
		w.Header()[key] = value
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	w.Write(js)

	return nil
}

func ReadJSON(w http.ResponseWriter, r *http.Request, dst any) error {
	maxBytes := 1_048_576
	r.Body = http.MaxBytesReader(w, r.Body, int64(maxBytes))

	dec := json.NewDecoder(r.Body)
	dec.DisallowUnknownFields()

	err := dec.Decode(dst)
	if err != nil {
		var syntaxError *json.SyntaxError
		var unmarshalTypeError *json.UnmarshalTypeError
		var invalidUnmarshalError *json.InvalidUnmarshalError
		var maxBytesError *http.MaxBytesError

		switch {
		case errors.As(err, &syntaxError):
			return fmt.Errorf("body contains badly-formed JSON (at character %d)", syntaxError.Offset)

		case errors.Is(err, io.ErrUnexpectedEOF):
			return errors.New("body contains badly-formed JSON")

		case errors.As(err, &unmarshalTypeError):
			if unmarshalTypeError.Field != "" {
				return fmt.Errorf("body contains incorrect JSON type for field %q", unmarshalTypeError.Field)
			}
			return fmt.Errorf("body contains incorrect JSON type (at character %d)", unmarshalTypeError.Offset)

		case errors.Is(err, io.EOF):
			return errors.New("body must not be empty")

		case strings.HasPrefix(err.Error(), "json: unknown field "):
			fieldName := strings.TrimPrefix(err.Error(), "json: unknown field ")
			return fmt.Errorf("body contains unknown key %s", fieldName)

		case errors.As(err, &maxBytesError):
			return fmt.Errorf("body must not be larger than %d bytes", maxBytesError.Limit)

		case errors.As(err, &invalidUnmarshalError):
			panic(err)

		default:
			return err
		}
	}

	err = dec.Decode(&struct{}{})
	if !errors.Is(err, io.EOF) {
		return errors.New("body must only contain a single JSON value")
	}

	return nil
}

func ConvertNumericToFloat32(n pgtype.Numeric) (float32, error) {
	if !n.Valid {
		return 0, fmt.Errorf("numeric value is not valid")
	}

	if n.NaN {
		return 0, fmt.Errorf("numeric value is NaN")
	}

	if n.InfinityModifier != 0 {
		return 0, fmt.Errorf("numeric value represents infinity")
	}

	// Convert Int to a big.Float
	intPart := new(big.Float).SetInt(n.Int)

	// Compute 10^Exp as a big.Float
	scaleFactor := new(big.Float).SetFloat64(math.Pow(10, float64(n.Exp)))

	// Multiply the integer part by the scaling factor
	result := new(big.Float).Mul(intPart, scaleFactor)

	// Convert the big.Float to float64, then cast to float32
	floatVal, _ := result.Float64()
	return float32(floatVal), nil
}
