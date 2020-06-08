# Go 的整洁价格实践

```go
Clean-Architecture-Sample
├── api
│   ├── handler
│   │   ├── admin.go
│   │   └── user.go
│   ├── main.go
│   ├── middleware
│   │   ├── auth.go
│   │   └── cors.go
│   └── views
│       └── errors.go
├── bin
│   └── main
├── config.json
├── docker-compose.yml
├── go.mod
├── go.sum
├── Makefile
├── pkg
│   ├── admin
│   │   ├── entity.go
│   │   ├── postgres.go
│   │   ├── repository.go
│   │   └── service.go
│   ├── errors.go
│   └── user
│       ├── entity.go
│       ├── postgres.go
│       ├── repository.go
│       └── service.go
├── README.md
```
