package service

import (
	"errors"
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
	return service.userRepository.AddUser(userToCreate)

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
		return userVehicle, err
	}
	return service.userRepository.AddVehicle(userVehicle)
}

func (service *userService) GetAllUserVehicles(loginid string) ([]model.Uservehicles, error) {
	return service.userRepository.GetVehicles(loginid)

}

func (service *userService) DeleteUserVehicle(vehicle model.Uservehicles) error {
	return service.userRepository.DeleteUserVehicle(vehicle)

}

func (service *userService) IsAllowedToUpdateDelete(userid uint64, vehicleregno string) (bool, error) {
	vehicle, err := service.userRepository.FindVehicle(vehicleregno)
	if err != nil {
		return false, err
	}

	id, err := strconv.ParseUint(fmt.Sprintf("%v", vehicle.Userid), 10, 64)
	if err != nil {
		return userid == id, err
	}

	return userid == id, nil
}

func (service *userService) GetUserDetails(loginid string) (model.User, error) {
	return service.userRepository.GetUserDetails(loginid)

}

func (service *userService) AddUserAddress(address model.Useraddressdto) (model.Useraddress, error) {
	userAddress := model.Useraddress{}
	err := smapping.FillStruct(&userAddress, smapping.MapFields(&address))
	if err != nil {
		return userAddress, err
	}
	return service.userRepository.AddAddress(userAddress)
}

func (service *userService) GetUserAddress(loginid string) ([]model.Useraddress, error) {
	return service.userRepository.GetUserAddress(loginid)
}

func (service *userService) GetAllUser(roleid uint64) ([]model.User, error) {
	return service.userRepository.GetAllUser(roleid)
}

func (service *userService) ResetPassword(logindto model.LoginDTO) error {

	res := service.userRepository.VerifyCredential(logindto.Loginid, logindto.Password)

	if v, ok := res.(model.User); ok {
		comparedPassword := comparePassword(v.Password, []byte(logindto.Password))

		if comparedPassword {
			return errors.New("old and new password are same")
		}
		err := service.userRepository.ResetPassword(logindto)
		return err
	}
	return errors.New("no record for given creds")
}

func (service *userService) UpdateUserVehicle(vehicle model.UservehiclesupdateDTO, vehregno string) (model.Uservehicles, error) {
	vehicleToUpdate := model.Uservehicles{}
	err := smapping.FillStruct(&vehicleToUpdate, smapping.MapFields(&vehicle))
	if err != nil {
		log.Fatalf("Failed map %v:", err)
	}
	return service.userRepository.UpdateUserVehicle(vehicleToUpdate, vehregno)

}

func (service *userService) UpdateUserDetails(user model.UpdateuserDTO, loginid string) (model.User, error) {
	userToUpdate := model.User{}
	err := smapping.FillStruct(&userToUpdate, smapping.MapFields(&user))
	if err != nil {
		log.Fatalf("Failed map %v:", err)
	}
	return service.userRepository.UpdateUserDetails(userToUpdate, loginid)
}

func (service *userService) UpdateUserAddress(address model.Updateuseraddressdto, addid uint64) (model.Useraddress, error) {
	addressToUpdate := model.Useraddress{}
	err := smapping.FillStruct(&addressToUpdate, smapping.MapFields(&address))
	if err != nil {
		log.Fatalf("Failed map %v:", err)
	}
	return service.userRepository.UpdateUserAddress(addressToUpdate, addid)
}
