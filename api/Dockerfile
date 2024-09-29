FROM golang:1.23.1-alpine

WORKDIR /app

COPY go.mod go.sum ./
RUN go mod download

COPY cmd/api/ cmd/api/
COPY internal/ internal/

WORKDIR /app/cmd/api
RUN go build -o /main

ARG API_PORT
ARG API_ENV
ENV API_PORT=$API_PORT
ENV API_ENV=$API_ENV

CMD /main -port $API_PORT -env $API_ENV