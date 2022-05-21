package model

import (
	"gorm.io/gorm"
)

// -------------------------------------- ENTITIES --------------------------------------
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

type Useraddress struct {
	Addressid   uint64 `gorm:"primary_key:auto_increment" json:"addressid"`
	Loginid     string `gorm:"type:varchar(50)" json:"loginid"`
	Addresstype string `gorm:"type:varchar(30)" json:"addresstype"`
	Houseno     string `gorm:"type:varchar(30)" json:"houseno"`
	Areaname    string `gorm:"type:varchar(30)" json:"areaname"`
	Pincode     string `gorm:"type:varchar(30)" json:"pincode"`
	City        string `gorm:"type:varchar(30)" json:"city"`
	State       string `gorm:"type:varchar(30)" json:"state"`
}

type Uservehicles struct {
	Uservehicleid uint64 `gorm:"primary_key:auto_increment" json:"uservehicleid"`
	Userid        uint64 `gorm:"type:bigint(11)" json:"userid"`
	Loginid       string `gorm:"type:varchar(50)" json:"loginid"`
	Regno         string `gorm:"type:varchar(30)" json:"regno"`
	Chassisno     string `gorm:"type:varchar(30)" json:"chassisno"`
}

// -------------------------------------- DTOS --------------------------------------

type LoginDTO struct {
	Loginid  string `json:"loginid" form:"username" binding:"required"`
	Password string `json:"password" form:"password" binding:"required"`
}

type RegisterDTO struct {
	Roleid    uint64 `json:"roleid,omitempty" form:"roleid"`
	Loginid   string `json:"loginid" form:"loginid" binding:"required"`
	Fullname  string `json:"fullname" form:"fullname" binding:"required"`
	Createdby uint64 `json:"createdby" form:"createdby"`
	DOB       string `json:"DOB" form:"DOB" binding:"required"`
	Emailid   string `json:"emailid" form:"emailid" binding:"required"`
	Mobileno  string `json:"mobileno" form:"mobileno" binding:"required"`
	Password  string `json:"password" form:"password" binding:"required"`
}

type UpdateuserDTO struct {
	Userid   uint64 `json:"userid,omitempty" form:"userid"`
	Roleid   uint64 `json:"roleid,omitempty" form:"roleid"`
	Loginid  string `json:"loginid" form:"loginid" binding:"required"`
	Fullname string `json:"fullname" form:"fullname" binding:"required"`
	DOB      string `json:"DOB" form:"DOB" binding:"required"`
	Emailid  string `json:"emailid" form:"emailid" binding:"required"`
	Mobileno string `json:"mobileno" form:"mobileno" binding:"required"`
}

type UservehiclesDTO struct {
	Userid    uint64 `json:"userid,omitempty" form:"userid,omitempty"`
	Loginid   string `json:"loginid,omitempty" form:"loginid,omitempty"`
	Regno     string `json:"regno" form:"regno" binding:"required"`
	Chassisno string `json:"chassisno" form:"chassisno" binding:"required"`
}

type UservehiclesupdateDTO struct {
	Uservehicleid uint64 `json:"uservehicleid,omitempty" form:"uservehicleid,omitempty"`
	Userid        uint64 `json:"userid,omitempty" form:"userid,omitempty"`
	Regno         string `json:"regno" form:"regno" binding:"required"`
	Chassisno     string `json:"chassisno" form:"chassisno" binding:"required"`
}

type Useraddressdto struct {
	Loginid     string `json:"loginid,omitempty" form:"loginid,omitempty"`
	Addresstype string `json:"addresstype" form:"addresstype" binding:"required"`
	Houseno     string `json:"houseno" form:"houseno" binding:"required"`
	Areaname    string `json:"areaname" form:"areaname" binding:"required"`
	Pincode     string `json:"pincode" form:"pincode" binding:"required"`
	City        string `json:"city" form:"city" binding:"required"`
	State       string `json:"state" form:"state" binding:"required"`
}

type Updateuseraddressdto struct {
	Addresstype string `json:"addresstype" form:"addresstype" binding:"required"`
	Houseno     string `json:"houseno" form:"houseno" binding:"required"`
	Areaname    string `json:"areaname" form:"areaname" binding:"required"`
	Pincode     string `json:"pincode" form:"pincode" binding:"required"`
	City        string `json:"city" form:"city" binding:"required"`
	State       string `json:"state" form:"state" binding:"required"`
}

// -------------------------------------- INTERFACES --------------------------------------
type UserService interface {
	RegisterUser(user RegisterDTO) (User, error)
	VerifyCredential(loginid string, password string) interface{}
	IsDuplicateEmail(loginid string) bool
	IsDuplicateUsername(loginid string) bool
	IsDuplicateVehicleRegNo(vehregno string) bool
	AddVehicle(vehicle UservehiclesDTO) (Uservehicles, error)
	GetAllUserVehicles(loginid string) ([]Uservehicles, error)
	UpdateUserVehicle(Uservehicles UservehiclesupdateDTO, vehregno string) (Uservehicles, error)
	DeleteUserVehicle(vehicle Uservehicles) error
	IsAllowedToUpdateDelete(userid uint64, vehicleregno string) (bool, error)

	GetUserDetails(loginid string) (User, error)

	AddUserAddress(address Useraddressdto) (Useraddress, error)
	GetUserAddress(loginid string) ([]Useraddress, error)
	GetAllUser(roleid uint64) ([]User, error)

	ResetPassword(logindto LoginDTO) error
	UpdateUserDetails(User UpdateuserDTO, loginid string) (User, error)
	UpdateUserAddress(User Updateuseraddressdto, addressid uint64) (Useraddress, error)
}

type UserRepository interface {
	AddUser(user User) (User, error)
	VerifyCredential(loginid string, password string) interface{}
	CheckEmail(loginid string) (tx *gorm.DB)
	CheckUsername(loginid string) (tx *gorm.DB)
	CheckVehicleRegNo(vehregno string) (tx *gorm.DB)
	AddVehicle(vehicle Uservehicles) (Uservehicles, error)
	GetVehicles(loginid string) ([]Uservehicles, error)
	UpdateUserVehicle(vehicle Uservehicles, vehregno string) (Uservehicles, error)
	DeleteUserVehicle(vehicle Uservehicles) error
	FindVehicle(vehicleregno string) (Uservehicles, error)

	GetUserDetails(loginid string) (User, error)

	AddAddress(address Useraddress) (Useraddress, error)
	GetUserAddress(loginid string) ([]Useraddress, error)
	GetAllUser(roleid uint64) ([]User, error)

	ResetPassword(logindto LoginDTO) error
	UpdateUserDetails(user User, loginid string) (User, error)
	UpdateUserAddress(address Useraddress, addressid uint64) (Useraddress, error)
}
