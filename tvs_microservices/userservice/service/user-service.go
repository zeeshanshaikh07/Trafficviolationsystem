package service

import (
	"log"

	"trafficviolationsystem/userservice/model"

	"github.com/mashingan/smapping"
	"golang.org/x/crypto/bcrypt"
)

type userService struct {
	userRepository model.UserRepository
}

func NewUserService(userRep model.UserRepository) *userService {
	return &userService{
		userRepository: userRep,
	}
}

func (service *userService) VerifyCredential(loginid string, password string) interface{} {
	res := service.userRepository.VerifyCredential(loginid, password)
	if v, ok := res.(model.User); ok {
		comparedPassword := comparePassword(v.Password, []byte(password))
		if v.Loginid == loginid && comparedPassword {
			return res
		}
		return false
	}
	return false
}

func (service *userService) RegisterUser(user model.RegisterDTO) model.User {
	userToCreate := model.User{}
	err := smapping.FillStruct(&userToCreate, smapping.MapFields(&user))
	if err != nil {
		log.Fatalf("Failed map %v", err)
	}
	res := service.userRepository.AddUser(userToCreate)
	return res
}

func comparePassword(hashedPwd string, plainPassword []byte) bool {
	byteHash := []byte(hashedPwd)
	err := bcrypt.CompareHashAndPassword(byteHash, plainPassword)
	if err != nil {
		log.Println(err)
		return false
	}
	return true
}

func (service *userService) IsDuplicateUsername(loginid string) bool {
	res := service.userRepository.CheckUsername(loginid)
	return !(res.Error == nil)
}

func (service *userService) IsDuplicateEmail(emailid string) bool {
	res := service.userRepository.CheckEmail(emailid)
	return !(res.Error == nil)
}

func (service *userService) IsDuplicateVehicleRegNo(vehregno string) bool {
	res := service.userRepository.CheckVehicleRegNo(vehregno)
	return !(res.Error == nil)
}

func (service *userService) AddVehicle(vehicle model.UservehiclesDTO) model.Uservehicles {
	userVehicle := model.Uservehicles{}
	err := smapping.FillStruct(&userVehicle, smapping.MapFields(&vehicle))
	if err != nil {
		log.Fatalf("Failed map %v", err)
	}
	res := service.userRepository.AddVehicle(userVehicle)
	return res
}

func (service *userService) GetAllUserVehicles(userid uint64) []model.Uservehicles {
	return service.userRepository.Get(userid)
}

func (service *userService) UpdateUserVehicle(vehicle model.UservehiclesupdateDTO) model.Uservehicles {
	vehicleToUpdate := model.Uservehicles{}
	err := smapping.FillStruct(&vehicleToUpdate, smapping.MapFields(&vehicle))
	if err != nil {
		log.Fatalf("Failed map %v:", err)
	}
	updatedVehicle := service.userRepository.Update(vehicleToUpdate)
	return updatedVehicle
}

func (service *userService) DeleteUserVehicle(vehicle model.Uservehicles) {
	service.userRepository.Delete(vehicle)
}
