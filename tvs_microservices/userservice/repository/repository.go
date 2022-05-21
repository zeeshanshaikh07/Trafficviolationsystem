package repository

import (
	"errors"
	"log"
	"trafficviolationsystem/userservice/model"

	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

type userConnection struct {
	connection *gorm.DB
}

func NewUserRepository(db *gorm.DB) *userConnection {
	return &userConnection{
		connection: db,
	}
}

func (db *userConnection) AddUser(user model.User) (model.User, error) {
	user.Password = hashAndSalt([]byte(user.Password))
	res := db.connection.Save(&user)
	return user, res.Error

}

func (db *userConnection) VerifyCredential(loginid string, password string) interface{} {
	var user model.User
	res := db.connection.Where("loginid = ?", loginid).Take(&user)

	if res.Error == nil {
		return user
	}
	return nil
}
func (db *userConnection) CheckUsername(loginid string) (tx *gorm.DB) {
	var user model.User
	return db.connection.Where("loginid = ?", loginid).Take(&user)
}

func (db *userConnection) CheckEmail(emailid string) (tx *gorm.DB) {
	var user model.User
	return db.connection.Where("emailid = ?", emailid).Take(&user)

}
func (db *userConnection) CheckVehicleRegNo(vehregno string) (tx *gorm.DB) {
	var vehicle model.Uservehicles
	return db.connection.Where("regno = ?", vehregno).Take(&vehicle)
}

func (db *userConnection) AddVehicle(vehicle model.Uservehicles) (model.Uservehicles, error) {
	res := db.connection.Save(&vehicle)
	return vehicle, res.Error
}

func hashAndSalt(pwd []byte) string {
	hash, err := bcrypt.GenerateFromPassword(pwd, bcrypt.MinCost)
	if err != nil {

		log.Print("Failed to hash password!", err)
	}
	return string(hash)
}

func (db *userConnection) GetVehicles(loginid string) ([]model.Uservehicles, error) {
	var userVehicles []model.Uservehicles

	resFind := db.connection.Where("loginid = ?", loginid).Take(&userVehicles)
	if resFind.Error == nil {
		res := db.connection.Where("loginid = ?", loginid).Find(&userVehicles)
		return userVehicles, res.Error
	}
	return userVehicles, resFind.Error
}

func (db *userConnection) DeleteUserVehicle(vehicle model.Uservehicles) error {

	resFind := db.connection.Where("regno = ?", vehicle.Regno).Take(&vehicle)
	if resFind.Error == nil {
		resDelete := db.connection.Where("regno = ?", vehicle.Regno).Delete(&vehicle)
		if resDelete.Error != nil {
			return resDelete.Error
		}
	}

	return resFind.Error

}

func (db *userConnection) FindVehicle(vehicleregno string) (model.Uservehicles, error) {
	var vehicle model.Uservehicles
	res := db.connection.Where("regno = ?", vehicleregno).Find(&vehicle)
	return vehicle, res.Error

}

func (db *userConnection) GetUserDetails(loginid string) (model.User, error) {
	var user model.User
	res := db.connection.Where("loginid = ?", loginid).Take(&user)
	return user, res.Error

}

func (db *userConnection) AddAddress(address model.Useraddress) (model.Useraddress, error) {
	res := db.connection.Save(&address)
	return address, res.Error

}

func (db *userConnection) GetUserAddress(loginid string) ([]model.Useraddress, error) {
	var address []model.Useraddress

	resFind := db.connection.Where("loginid = ?", loginid).Take(&address)
	if resFind.Error == nil {
		res := db.connection.Where("loginid = ?", loginid).Find(&address)
		return address, res.Error

	}

	return address, resFind.Error

}

func (db *userConnection) GetAllUser(roleid uint64) ([]model.User, error) {
	var users []model.User

	resFind := db.connection.Where("roleid = ?", roleid).Take(&users)
	if resFind.Error == nil {
		res := db.connection.Where("roleid = ?", roleid).Find(&users)
		return users, res.Error
	}
	return users, resFind.Error
}

func (db *userConnection) ResetPassword(logindto model.LoginDTO) error {

	password := hashAndSalt([]byte(logindto.Password))

	res := db.connection.Model(&model.User{}).Where("loginid = ?", logindto.Loginid).Update("password", password).RowsAffected

	if res == 0 {
		return errors.New("failed to update")
	}

	return nil
}

func (db *userConnection) UpdateUserVehicle(vehicle model.Uservehicles, vehregno string) (model.Uservehicles, error) {

	resFind := db.connection.Where("regno = ?", vehregno).Updates(&vehicle)
	return vehicle, resFind.Error

}

func (db *userConnection) UpdateUserDetails(user model.User, loginid string) (model.User, error) {

	res := db.connection.Where("loginid = ?", loginid).Updates(&user)
	return user, res.Error
}

func (db *userConnection) UpdateUserAddress(address model.Useraddress, addid uint64) (model.Useraddress, error) {
	res := db.connection.Where("addressid = ?", addid).Updates(&address)
	return address, res.Error
}
