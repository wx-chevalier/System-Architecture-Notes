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

# 实体

实体是可以通过函数实现的核心业务对象。用 MVC 术语来说，它们是整洁架构的模型层。所有的实体和服务都封装在 pkg 目录中。这其实就是我们要抽象出的东西，让它和其他部分分开。

如果你看一下 user 下面的 entity.go ，它看起来是这样的。

```go
import "github.com/jinzhu/gorm"

type User struct {
  gorm.Model
  FirstName   string `json:"first_name,omitempty"`
  LastName    string `json:"last_name,omitempty"`
  Password    string `json:"password,omitempty"`
  PhoneNumber string `json:"phone_number,omitempty"`
  Email       string `json:"email,omitempty"`
  Address     string `json:"address,omitempty"`
  DisplayPic  string `json:"display_pic,omitempty"`
}
```

实体是在 Repository 接口中使用的，它可以用任何数据库实现。在本例中，我们在 postgres.go 中用 Postgres 实现了它，由于 Repository 可以用任何数据库实现，因此与所实现细节无关。
