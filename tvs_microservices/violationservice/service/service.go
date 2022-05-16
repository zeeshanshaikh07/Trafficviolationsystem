package service

import (
	"violationdetails/model"
)

type violationService struct {
	violationRepository model.ViolationRepository
}

func NewViolationService(violationRepo model.ViolationRepository) *violationService {
	return &violationService{
		violationRepository: violationRepo,
	}
}

func (service *violationService) All(vno string, closure string) ([]model.Trafficviolationsystem, error) {
	res, err := service.violationRepository.AllViolation(vno, closure)
	if err != nil {
		return res, err
	}
	return res, nil
}
