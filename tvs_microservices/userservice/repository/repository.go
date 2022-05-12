package repository

import (
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
	if res.Error != nil {
		return user, res.Error
	}
	return user, nil
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

	res := db.connection.Where("loginid = ?", loginid).Take(&user)

	return res
}

func (db *userConnection) CheckEmail(emailid string) (tx *gorm.DB) {
	var user model.User

	res := db.connection.Where("emailid = ?", emailid).Take(&user)

	return res
}
func (db *userConnection) CheckVehicleRegNo(vehregno string) (tx *gorm.DB) {
	var vehicle model.Uservehicles

	res := db.connection.Where("regno = ?", vehregno).Take(&vehicle)

	return res
}

func (db *userConnection) AddVehicle(vehicle model.Uservehicles) (model.Uservehicles, error) {

	res := db.connection.Save(&vehicle)
	if res.Error != nil {
		return vehicle, res.Error
	}
	return vehicle, nil
}

func hashAndSalt(pwd []byte) string {
	hash, err := bcrypt.GenerateFromPassword(pwd, bcrypt.MinCost)
	if err != nil {

		log.Print("Failed to hash password!", err)
	}
	return string(hash)
}

func (db *userConnection) Get(userid uint64) ([]model.Uservehicles, error) {
	var userVehicles []model.Uservehicles
	res := db.connection.Where("userid = ?", userid).Find(&userVehicles)

	if res.Error != nil {
		log.Print("Error", res.Error)
		return userVehicles, res.Error
	}

	return userVehicles, nil
}

func (db *userConnection) Update(vehicle model.Uservehicles, vehregno string) (model.Uservehicles, error) {

	resFind := db.connection.Where("regno = ?", vehregno).Updates(&vehicle)
	if resFind.Error != nil {
		return vehicle, resFind.Error
	}

	return vehicle, nil
}

func (db *userConnection) Delete(vehicle model.Uservehicles) error {

	resFind := db.connection.Where("regno = ?", vehicle.Regno).Take(&vehicle)
	if resFind.Error != nil {
		return resFind.Error
	}
	resDelete := db.connection.Where("regno = ?", vehicle.Regno).Delete(&vehicle)
	if resDelete.Error != nil {
		return resDelete.Error
	}
	return nil

}

func (db *userConnection) FindVehicle(vehicleregno string) (model.Uservehicles, error) {
	var vehicle model.Uservehicles
	res := db.connection.Where("regno = ?", vehicleregno).Find(&vehicle)
	if res.Error != nil {
		return vehicle, res.Error
	}

	return vehicle, nil
}
