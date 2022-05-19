package service

import (
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

func (s *registrationservice) VerifyVehicle(chasisno, vehno string) (bool, error) {
	return s.repository.VerifyVehicle(chasisno, vehno)
}

func (s *registrationservice) GetVehicleSummary(vehno string) (model.Vehicleregistraionsummary, error) {
	obj, err := s.repository.GetVehicleSummary(vehno)
	return obj, err
}

func (s *registrationservice) GetVehicleRegistration(vehno string) (model.VehicleRegInfo, error) {
	return s.repository.GetVehicleRegistration(vehno)
}

func (s *registrationservice) GetVehicleInsurance(vehno string) (model.Vehicleinsurancedetails, error) {
	return s.repository.GetVehicleInsurance(vehno)
}

func (s *registrationservice) GetVehiclePuc(vehno string) (model.Vehiclepucdetails, error) {
	return s.repository.GetVehiclePuc(vehno)
}

func (s *registrationservice) GetVehicleDetails(vehno string) (model.Vehicledetails, error) {
	return s.repository.GetVehicleDetails(vehno)
}
