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
	Userid      uint64 `gorm:"type:bigint(11)" json:"userid"`
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

type UservehiclesDTO struct {
	Userid    uint64 `json:"userid,omitempty" form:"userid,omitempty"`
	Regno     string `json:"regno" form:"regno" binding:"required"`
	Chassisno string `json:"chassisno" form:"chassisno" binding:"required"`
}

type UservehiclesupdateDTO struct {
	Uservehicleid uint64 `json:"uservehicleid,omitempty" form:"uservehicleid,omitempty"`
	Userid        uint64 `json:"userid,omitempty" form:"userid,omitempty"`
	Regno         string `json:"regno" form:"regno" binding:"required"`
	Chassisno     string `json:"chassisno" form:"chassisno" binding:"required"`
}

// -------------------------------------- INTERFACES --------------------------------------
type UserService interface {
	RegisterUser(user RegisterDTO) (User, error)
	VerifyCredential(loginid string, password string) interface{}
	IsDuplicateEmail(loginid string) bool
	IsDuplicateUsername(loginid string) bool
	IsDuplicateVehicleRegNo(vehregno string) bool
	AddVehicle(vehicle UservehiclesDTO) (Uservehicles, error)
	GetAllUserVehicles(userid uint64) ([]Uservehicles, error)
	UpdateUserVehicle(Uservehicles UservehiclesupdateDTO, vehregno string) (Uservehicles, error)
	DeleteUserVehicle(vehicle Uservehicles) error
	IsAllowedToUpdateDelete(userid uint64, vehicleregno string) (bool, error)
}

type UserRepository interface {
	AddUser(user User) (User, error)
	VerifyCredential(loginid string, password string) interface{}
	CheckEmail(loginid string) (tx *gorm.DB)
	CheckUsername(loginid string) (tx *gorm.DB)
	CheckVehicleRegNo(vehregno string) (tx *gorm.DB)
	AddVehicle(vehicle Uservehicles) (Uservehicles, error)
	Get(userid uint64) ([]Uservehicles, error)
	Update(vehicle Uservehicles, vehregno string) (Uservehicles, error)
	Delete(vehicle Uservehicles) error
	FindVehicle(vehicleregno string) (Uservehicles, error)
}
