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

```go

package user

import (
  "context"
)

type Repository interface {
  FindByID(ctx context.Context, id uint) (*User, error)

  BuildProfile(ctx context.Context, user *User) (*User, error)

  CreateMinimal(ctx context.Context, email, password, phoneNumber string) (*User, error)

  FindByEmailAndPassword(ctx context.Context, email, password string) (*User, error)

  FindByEmail(ctx context.Context, email string) (*User, error)

  DoesEmailExist(ctx context.Context, email string) (bool, error)

  ChangePassword(ctx context.Context, email, password string) error
}
```

# Service

服务包括面向更高层次的业务逻辑功能的接口。例如，FindByID 可能是一个存储层函数，但 login 或 signup 则是服务层函数。服务是存储的抽象层，它们不与数据库交互，而是与存储的接口交互。

```go
package user

import (
  "context"
  "crypto/md5"
  "encoding/hex"
  "errors"
)

type Service interface {
  Register(ctx context.Context, email, password, phoneNumber string) (*User, error)

  Login(ctx context.Context, email, password string) (*User, error)

  ChangePassword(ctx context.Context, email, password string) error

  BuildProfile(ctx context.Context, user *User) (*User, error)

  GetUserProfile(ctx context.Context, email string) (*User, error)

  IsValid(user *User) (bool, error)

  GetRepo() Repository
}

type service struct {
  repo Repository
}

func NewService(r Repository) Service {
  return &service{
    repo: r,
  }
}

func (s *service) Register(ctx context.Context, email, password, phoneNumber string) (u *User, err error) {

  exists, err := s.repo.DoesEmailExist(ctx, email)
  if err != nil {
    return nil, err
  }
  if exists {
    return nil, errors.New("User already exists")
  }

  hasher := md5.New()
  hasher.Write([]byte(password))

  return s.repo.CreateMinimal(ctx, email, hex.EncodeToString(hasher.Sum(nil)), phoneNumber)
}

func (s *service) Login(ctx context.Context, email, password string) (u *User, err error) {

  hasher := md5.New()
  hasher.Write([]byte(password))
  return s.repo.FindByEmailAndPassword(ctx, email, hex.EncodeToString(hasher.Sum(nil)))
}

func (s *service) ChangePassword(ctx context.Context, email, password string) (err error) {

  hasher := md5.New()
  hasher.Write([]byte(password))
  return s.repo.ChangePassword(ctx, email, hex.EncodeToString(hasher.Sum(nil)))
}

func (s *service) BuildProfile(ctx context.Context, user *User) (u *User, err error) {

  return s.repo.BuildProfile(ctx, user)
}

func (s *service) GetUserProfile(ctx context.Context, email string) (u *User, err error) {
  return s.repo.FindByEmail(ctx, email)
}

func (s *service) IsValid(user *User) (ok bool, err error) {

  return ok, err
}

func (s *service) GetRepo() Repository {

  return s.repo
}
```

服务是在用户接口层面实现的。

# 接口适配器

每个用户接口都有独立的目录。在我们的例子中，因为我们用 API 作为接口，因此有一个叫 api 的目录。现在，由于每个用户接口对请求的监听方式不同，所以接口适配器都有自己的 main.go 文件，其任务如下。

- 创建 Repository
- 在服务内的包装 repository
- 在 Handler 里面包装服务

在这里，Handler 程序只是 Request-Response 模型的用户接口实现。每个服务都有自己的 Handler 程序。参见 user.go：

```go
package handler

import (
  "encoding/json"
  "net/http"

  "github.com/L04DB4L4NC3R/jobs-mhrd/api/middleware"
  "github.com/L04DB4L4NC3R/jobs-mhrd/api/views"
  "github.com/L04DB4L4NC3R/jobs-mhrd/pkg/user"
  "github.com/dgrijalva/jwt-go"
  "github.com/spf13/viper"
)

func register(svc user.Service) http.Handler {
  return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
    if r.Method != http.MethodPost {
      views.Wrap(views.ErrMethodNotAllowed, w)
      return
    }

    var user user.User
    if err := json.NewDecoder(r.Body).Decode(&user); err != nil {
      views.Wrap(err, w)
      return
    }

    u, err := svc.Register(r.Context(), user.Email, user.Password, user.PhoneNumber)
    if err != nil {
      views.Wrap(err, w)
      return
    }
    w.WriteHeader(http.StatusCreated)
    token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
      "email": u.Email,
      "id":    u.ID,
      "role":  "user",
    })
    tokenString, err := token.SignedString([]byte(viper.GetString("jwt_secret")))
    if err != nil {
      views.Wrap(err, w)
      return
    }
    json.NewEncoder(w).Encode(map[string]interface{}{
      "token": tokenString,
      "user":  u,
    })
    return
  })
}

func login(svc user.Service) http.Handler {
  return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
    if r.Method != http.MethodPost {
      views.Wrap(views.ErrMethodNotAllowed, w)
      return
    }
    var user user.User
    if err := json.NewDecoder(r.Body).Decode(&user); err != nil {
      views.Wrap(err, w)
      return
    }

    u, err := svc.Login(r.Context(), user.Email, user.Password)
    if err != nil {
      views.Wrap(err, w)
      return
    }

    token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
      "email": u.Email,
      "id":    u.ID,
      "role":  "user",
    })
    tokenString, err := token.SignedString([]byte(viper.GetString("jwt_secret")))
    if err != nil {
      views.Wrap(err, w)
      return
    }
    json.NewEncoder(w).Encode(map[string]interface{}{
      "token": tokenString,
      "user":  u,
    })
    return
  })
}

func profile(svc user.Service) http.Handler {
  return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {

    // @protected
    // @description build profile
    if r.Method == http.MethodPost {
      var user user.User
      if err := json.NewDecoder(r.Body).Decode(&user); err != nil {
        views.Wrap(err, w)
        return
      }

      claims, err := middleware.ValidateAndGetClaims(r.Context(), "user")
      if err != nil {
        views.Wrap(err, w)
        return
      }
      user.Email = claims["email"].(string)
      u, err := svc.BuildProfile(r.Context(), &user)
      if err != nil {
        views.Wrap(err, w)
        return
      }

      json.NewEncoder(w).Encode(u)
      return
    } else if r.Method == http.MethodGet {

      // @description view profile
      claims, err := middleware.ValidateAndGetClaims(r.Context(), "user")
      if err != nil {
        views.Wrap(err, w)
        return
      }
      u, err := svc.GetUserProfile(r.Context(), claims["email"].(string))
      if err != nil {
        views.Wrap(err, w)
        return
      }

      json.NewEncoder(w).Encode(map[string]interface{}{
        "message": "User profile",
        "data":    u,
      })
      return
    } else {
      views.Wrap(views.ErrMethodNotAllowed, w)
      return
    }
  })
}

func changePassword(svc user.Service) http.Handler {
  return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
    if r.Method == http.MethodPost {
      var u user.User
      if err := json.NewDecoder(r.Body).Decode(&u); err != nil {
        views.Wrap(err, w)
        return
      }

      claims, err := middleware.ValidateAndGetClaims(r.Context(), "user")
      if err != nil {
        views.Wrap(err, w)
        return
      }
      if err := svc.ChangePassword(r.Context(), claims["email"].(string), u.Password); err != nil {
        views.Wrap(err, w)
        return
      }
      return
    } else {
      views.Wrap(views.ErrMethodNotAllowed, w)
      return
    }
  })
}

// expose handlers
func MakeUserHandler(r *http.ServeMux, svc user.Service) {
  r.Handle("/api/v1/user/ping", http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
    w.WriteHeader(http.StatusOK)
    return
  }))
  r.Handle("/api/v1/user/register", register(svc))
  r.Handle("/api/v1/user/login", login(svc))
  r.Handle("/api/v1/user/profile", middleware.Validate(profile(svc)))
  r.Handle("/api/v1/user/pwd", middleware.Validate(changePassword(svc)))
}
```

# 错误处理

![Clean Architecture 错误处理](https://s1.ax1x.com/2020/06/15/N9Zkyq.png)

整洁架构中错误处理的基本原则如下：仓库级错误应该是统一的，对于每个接口适配器来说，应该以不同的方式进行封装和实现。这本质上的意思是，所有的数据库级错误都应该由用户接口以不同的方式来处理。例如，如果用户接口是一个 REST API，那么错误应该以 HTTP 状态码的形式表现出来，比如 500 错误。而如果是 CLI 方式，则应该以状态码 1 退出。

在整洁架构中，Repository 错误可以在 pkg 的根目录下，这样 Repository 函数就可以在控制流出现问题时调用它们，如下图所示。

```go

package errors

import (
  "errors"
)

var (
  ErrNotFound     = errors.New("Error: Document not found")
  ErrNoContent    = errors.New("Error: Document not found")
  ErrInvalidSlug  = errors.New("Error: Invalid slug")
  ErrExists       = errors.New("Error: Document already exists")
  ErrDatabase     = errors.New("Error: Database error")
  ErrUnauthorized = errors.New("Error: You are not allowed to perform this action")
  ErrForbidden    = errors.New("Error: Access to this resource is forbidden")
)
```

然后，同样的错误可以根据具体的用户界面来实现，最常见的是可以在 Handler 层面在 view 中进行封装，如下图所示。

```go
package views

import (
  "encoding/json"
  "errors"
  "net/http"

  log "github.com/sirupsen/logrus"

  pkg "github.com/L04DB4L4NC3R/jobs-mhrd/pkg"
)

type ErrView struct {
  Message string `json:"message"`
  Status  int    `json:"status"`
}

var (
  ErrMethodNotAllowed = errors.New("Error: Method is not allowed")
  ErrInvalidToken     = errors.New("Error: Invalid Authorization token")
  ErrUserExists       = errors.New("User already exists")
)

var ErrHTTPStatusMap = map[string]int{
  pkg.ErrNotFound.Error():     http.StatusNotFound,
  pkg.ErrInvalidSlug.Error():  http.StatusBadRequest,
  pkg.ErrExists.Error():       http.StatusConflict,
  pkg.ErrNoContent.Error():    http.StatusNotFound,
  pkg.ErrDatabase.Error():     http.StatusInternalServerError,
  pkg.ErrUnauthorized.Error(): http.StatusUnauthorized,
  pkg.ErrForbidden.Error():    http.StatusForbidden,
  ErrMethodNotAllowed.Error(): http.StatusMethodNotAllowed,
  ErrInvalidToken.Error():     http.StatusBadRequest,
  ErrUserExists.Error():       http.StatusConflict,
}

func Wrap(err error, w http.ResponseWriter) {
  msg := err.Error()
  code := ErrHTTPStatusMap[msg]

  // If error code is not found
  // like a default case
  if code == 0 {
    code = http.StatusInternalServerError
  }

  w.WriteHeader(code)

  errView := ErrView{
    Message: msg,
    Status:  code,
  }
  log.WithFields(log.Fields{
    "message": msg,
    "code":    code,
  }).Error("Error occurred")

  json.NewEncoder(w).Encode(errView)
}
```

每个 Repository 级别的错误，或者其他的错误，都会被封装在一个 map 中，该 map 返回一个与相应的错误相对应的 HTTP 状态代码。
