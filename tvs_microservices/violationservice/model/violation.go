package model

import "time"

type Violationlist struct {
	Violationlistid   uint64           `gorm:"primary_key:auto_increment" json:"violationlistid"`
	Vehicleregno      string           `gorm:"type:varchar(30)" json:"vehicleregno"`
	City              string           `gorm:"type:varchar(50)" json:"city"`
	Longitude         string           `gorm:"type:varchar(10)" json:"longitude"`
	Latitude          string           `gorm:"type:varchar(10)" json:"latitude"`
	State             string           `gorm:"type:varchar(50)" json:"state"`
	Devicetype        string           `gorm:"type:varchar(50)" json:"devicetype"`
	Violationdetailid uint64           `gorm:"not null" json:"-"`
	Createdat         time.Time        `json:"createdat"`
	Updatedat         time.Time        `json:"updatedat"`
	Isopen            uint64           `json:"isopen"`
	Violationdetails  Violationdetails `gorm:"foreignkey:Violationdetailid;constraint:onUpdate:CASCADE,onDelete:CASCADE" json:"violationdetails"`
}

type Violationdetails struct {
	Violationdetailsid uint64 `gorm:"primary_key:auto_increment" json:"violationdetailsid"`
	Name               string `gorm:"type:varchar(50)" json:"name"`
	Code               string `gorm:"type:varchar(30)" json:"code"`
	Charge             uint64 `gorm:"type:double" json:"charge"`
	Description        string `gorm:"type:varchar(255)" json:"description"`
}

type Violationclosedto struct {
	Isopen uint64 `json:"isopen"`
}

type ViolationService interface {
	GetAllVoilations(vno string, isopen string) ([]Violationlist, error)
	CloseViolation(Violationlist Violationclosedto, tvsid uint64) (Violationlist, error)
}

type ViolationRepository interface {
	AllViolation(vno string, isopen string) ([]Violationlist, error)
	CloseViolationStatus(tvs Violationlist, tvsid uint64) (Violationlist, error)
}
