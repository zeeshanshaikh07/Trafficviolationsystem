package service

import (
	"fmt"
	"log"
	"strconv"

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

func (service *userService) RegisterUser(user model.RegisterDTO) (model.User, error) {
	userToCreate := model.User{}
	err := smapping.FillStruct(&userToCreate, smapping.MapFields(&user))
	if err != nil {
		log.Print(err)
	}
	res, err := service.userRepository.AddUser(userToCreate)
	if err != nil {
		return res, err
	}
	return res, nil
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

func (service *userService) AddVehicle(vehicle model.UservehiclesDTO) (model.Uservehicles, error) {
	userVehicle := model.Uservehicles{}
	err := smapping.FillStruct(&userVehicle, smapping.MapFields(&vehicle))
	if err != nil {
		panic(err)
	}
	res, err := service.userRepository.AddVehicle(userVehicle)
	if err != nil {
		return res, err
	}
	return res, nil

}

func (service *userService) GetAllUserVehicles(userid uint64) ([]model.Uservehicles, error) {
	res, err := service.userRepository.Get(userid)
	if err != nil {
		return res, err
	}
	return res, nil
}

func (service *userService) UpdateUserVehicle(vehicle model.UservehiclesupdateDTO) (model.Uservehicles, error) {
	vehicleToUpdate := model.Uservehicles{}
	err := smapping.FillStruct(&vehicleToUpdate, smapping.MapFields(&vehicle))
	if err != nil {
		log.Fatalf("Failed map %v:", err)
	}
	updatedVehicle, err := service.userRepository.Update(vehicleToUpdate)
	if err != nil {
		return updatedVehicle, err
	}
	return updatedVehicle, nil
}

func (service *userService) DeleteUserVehicle(vehicle model.Uservehicles) error {
	err := service.userRepository.Delete(vehicle)
	if err != nil {
		return err
	}
	return nil
}

func (service *userService) IsAllowedToUpdateDelete(userid uint64, vehicleid uint64) (bool, error) {
	vehicle, err := service.userRepository.FindVehicle(vehicleid)
	if err != nil {
		return false, err
	}

	id, err := strconv.ParseUint(fmt.Sprintf("%v", vehicle.Userid), 10, 64)
	if err != nil {
		return userid == id, err
	}

	return userid == id, nil
}
