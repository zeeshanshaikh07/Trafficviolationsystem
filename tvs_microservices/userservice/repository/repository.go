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

func (db *userConnection) RegisterUser(user model.User) model.User {
	user.Password = hashAndSalt([]byte(user.Password))
	db.connection.Save(&user)
	return user
}

func (db *userConnection) VerifyCredential(loginid string, password string) interface{} {
	var user model.User
	res := db.connection.Where("loginid = ?", loginid).Take(&user)

	if res.Error == nil {
		return user
	}
	return nil
}

func (db *userConnection) IsDuplicateEmail(emailid string) (tx *gorm.DB) {
	var user model.User
	return db.connection.Where("emailid = ?", emailid).Take(&user)
}

func (db *userConnection) IsDuplicateUsername(loginid string) (tx *gorm.DB) {
	var user model.User
	return db.connection.Where("loginid = ?", loginid).Take(&user)
}

func hashAndSalt(pwd []byte) string {
	hash, err := bcrypt.GenerateFromPassword(pwd, bcrypt.MinCost)
	if err != nil {
		log.Println(err)
		panic("Failed to hash a password")
	}
	return string(hash)
}
