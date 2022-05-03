package model

import (
	"gorm.io/gorm"
)

type User struct {
	Userid    uint64 `gorm:"primary_key:auto_increment" json:"userid"`
	Roleid    uint64 `gorm:"type:bigint(11)" json:"roleid"`
	Loginid   string `gorm:"type:varchar(50)" json:"loginid"`
	Fullname  string `gorm:"type:varchar(50)" json:"fullname"`
	Createdby uint64 `gorm:"type:bigint(11)" json:"createdby"`
	DOB       string `gorm:"type:date" json:"DOB"`
	Emailid   string `gorm:"uniqueIndex;type:varchar(30)" json:"emailid"`
	Mobileno  string `gorm:"type:varchar(30)" json:"mobileno"`
	Password  string `gorm:"->;<-;not null" json:"-"`
	Token     string `gorm:"-" json:"token,omitempty"`
}

type LoginDTO struct {
	Loginid  string `json:"loginid" form:"username" binding:"required"`
	Password string `json:"password" form:"password" binding:"required"`
}

type RegisterDTO struct {
	Roleid    uint64 `json:"roleid" form:"roleid" binding:"required"`
	Loginid   string `json:"loginid" form:"loginid" binding:"required"`
	Fullname  string `json:"fullname" form:"fullname" binding:"required"`
	Createdby uint64 `json:"createdby" form:"createdby"`
	DOB       string `json:"DOB" form:"DOB" binding:"required"`
	Emailid   string `json:"emailid" form:"emailid" binding:"required"`
	Mobileno  string `json:"mobileno" form:"mobileno" binding:"required"`
	Password  string `json:"password" form:"password" binding:"required"`
}

type UserService interface {
	RegisterUser(user RegisterDTO) User
	VerifyCredential(emailid string, password string) interface{}
	IsDuplicateEmail(emailid string) bool
	IsDuplicateUsername(loginid string) bool
}

type UserRepository interface {
	RegisterUser(user User) User
	VerifyCredential(emailid string, password string) interface{}
	IsDuplicateEmail(emailid string) (tx *gorm.DB)
	IsDuplicateUsername(loginid string) (tx *gorm.DB)
}
