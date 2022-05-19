package service

import (
	"log"
	"violationdetails/model"

	"github.com/mashingan/smapping"
)

type violationService struct {
	violationRepository model.ViolationRepository
}

func NewViolationService(violationRepo model.ViolationRepository) *violationService {
	return &violationService{
		violationRepository: violationRepo,
	}
}

func (service *violationService) GetAllViolations(vno string, isclose string) ([]model.Violationlist, error) {
	res, err := service.violationRepository.AllViolation(vno, isclose)
	if err != nil {
		return res, err
	}
	return res, nil
}

func (service *violationService) GetViolations(filter string, value string) ([]model.Violationlist, error) {
	return service.violationRepository.GetViolation(filter, value)
}

func (service *violationService) CloseViolation(tvs model.ViolationCloseDto, tvsid uint64) (model.Violationlist, error) {
	closeviolation := model.Violationlist{}
	err := smapping.FillStruct(&closeviolation, smapping.MapFields(&tvs))
	if err != nil {
		log.Fatalf("Failed map %v:", err)
	}
	closeViolation, err := service.violationRepository.CloseViolationStatus(closeviolation, tvsid)
	if err != nil {
		return closeViolation, err

	}

	return closeViolation, nil
}
