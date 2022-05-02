package repository

import (
	"errors"
	"fmt"

	"gorm.io/gorm"
	"trafficsystem.com/vehicleregistrationservice/model"
)

type registrationrepo struct {
	db *gorm.DB
}

func NewRegistrationRepo(db *gorm.DB) *registrationrepo {
	return &registrationrepo{
		db: db,
	}

	//TODO: AUtomigration will implement in helper function
}

func (repo *registrationrepo) GetVehicleSummary(vehno string) (model.VehicleRegistration, error) {

	var obj model.VehicleRegistration

	obj.ID = 1
	obj.RTOName = "Pune"
	obj.VehicleNumber = "MH31NC3635"
	//Query will come here
	fmt.Println("Repo getvehvle")
	return obj, errors.New("Success")
}
