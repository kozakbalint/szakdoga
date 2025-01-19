package database

import (
	"context"

	"github.com/kozakbalint/szakdoga/api/internal/config"
	"github.com/redis/go-redis/v9"
)

func NewRedisClient(c *config.Config) *redis.Client {
	client := redis.NewClient(&redis.Options{
		Addr:     c.Redis.Addr,
		Password: c.Redis.Password,
		DB:       c.Redis.DB,
	})

	err := client.Ping(context.Background()).Err()
	if err != nil {
		panic(err)
	}

	return client
}
