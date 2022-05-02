package service

import (
	"fmt"

	"trafficsystem.com/vehicleregistrationservice/model"
)

type registrationservice struct {
	repository model.RegistrationRepository
}

func NewRegistrationService(repo model.RegistrationRepository) *registrationservice {
	return &registrationservice{
		repository: repo,
	}
}

func (s *registrationservice) GetVehicleSummary(vehno string) (model.VehicleRegistration, error) {

	var obj model.VehicleRegistration
	obj, err := s.repository.GetVehicleSummary("123")
	fmt.Println("Service getvehvle")
	return obj, err
}
