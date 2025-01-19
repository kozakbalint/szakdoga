package utils

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"net/http"
	"strconv"
	"strings"
	"time"

	"github.com/julienschmidt/httprouter"
	"github.com/redis/go-redis/v9"
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

func ReadPathParam(r *http.Request, pathName string) (int, error) {
	params := httprouter.ParamsFromContext(r.Context())

	param, err := strconv.Atoi(params.ByName(pathName))
	if err != nil {
		return 0, errors.New(fmt.Sprintf("invalid %s parameter", pathName))
	}

	return param, nil
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
	_, err = w.Write(js)
	if err != nil {
		return err
	}

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

func GetFromCache(redisClient *redis.Client, key string) ([]byte, error) {
	data, err := redisClient.Get(context.Background(), key).Result()
	if err != redis.Nil {
		return nil, nil
	} else if err != nil {
		return nil, err
	}

	return []byte(data), nil
}

func SaveToCache(redisClient *redis.Client, key string, data []byte, ttl time.Duration) error {
	err := redisClient.Set(context.Background(), key, data, ttl).Err()
	return err
}

func UnmarshalCacheData[T any](data []byte) (*T, error) {
	var result T
	err := json.Unmarshal(data, &result)
	if err != nil {
		return nil, err
	}
	return &result, nil
}

func MarshalData(data interface{}) ([]byte, error) {
	return json.Marshal(data)
}
