package service

import (
	"violationdetails/model"
	"violationdetails/repository"
)

type ViolationService interface {
	All(vno string) []model.Trafficviolationsystem
}

type violationService struct {
	violationRepository repository.ViolationRepository
}

func NewViolationService(violationRepo repository.ViolationRepository) ViolationService {
	return &violationService{
		violationRepository: violationRepo,
	}
}

func (service *violationService) All(vno string) []model.Trafficviolationsystem {
	return service.violationRepository.AllViolation(vno)
}
