package service

import (
	"log"

	"trafficviolationsystem/userservice/model"
	"trafficviolationsystem/userservice/repository"

	"github.com/mashingan/smapping"
	"golang.org/x/crypto/bcrypt"
)

//UserService is a contract about something that this service can do
type UserService interface {
	VerifyCredential(email string, password string) interface{}
	CreateUser(user model.RegisterDTO) model.User
	FindByEmail(email string) model.User
	IsDuplicateEmail(email string) bool
}

type userService struct {
	userRepository repository.UserRepository
}

//NewUserService creates a new instance of UserService.
func NewUserService(userRep repository.UserRepository) UserService {
	return &userService{
		userRepository: userRep,
	}
}

func (service *userService) VerifyCredential(email string, password string) interface{} {
	res := service.userRepository.VerifyCredential(email, password)
	if v, ok := res.(model.User); ok {
		comparedPassword := comparePassword(v.Password, []byte(password))
		if v.Email == email && comparedPassword {
			return res
		}
		return false
	}
	return false
}

func (service *userService) CreateUser(user model.RegisterDTO) model.User {
	userToCreate := model.User{}
	err := smapping.FillStruct(&userToCreate, smapping.MapFields(&user))
	if err != nil {
		log.Fatalf("Failed map %v", err)
	}
	res := service.userRepository.InsertUser(userToCreate)
	return res
}

// compare plain password provided by user with hashed password from db
func comparePassword(hashedPwd string, plainPassword []byte) bool {
	byteHash := []byte(hashedPwd)
	err := bcrypt.CompareHashAndPassword(byteHash, plainPassword)
	if err != nil {
		log.Println(err)
		return false
	}
	return true
}

func (service *userService) FindByEmail(email string) model.User {
	return service.userRepository.FindByEmail(email)
}

func (service *userService) IsDuplicateEmail(email string) bool {
	res := service.userRepository.IsDuplicateEmail(email)
	return !(res.Error == nil)
}
