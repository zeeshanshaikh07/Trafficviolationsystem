package repository

import (
	"errors"

	"github.com/jinzhu/gorm"
	_ "gorm.io/gorm"
	"trafficsystem.com/vehicleregistrationservice/model"
)

type registrationrepo struct {
	db *gorm.DB
}

func NewRegistrationRepo(db *gorm.DB) *registrationrepo {
	return &registrationrepo{
		db: db,
	}

}

func (repo *registrationrepo) VerifyVehicle(chasisno, vehno string) (bool, error) {

	var obj model.Vehicleregistraionsummary

	result := repo.db.Where("chasisnumber = ? and regno = ?", chasisno, vehno).First(&obj)

	if result.RowsAffected == 0 {
		return false, nil
	}

	if result.Error != nil {
		return false, result.Error
	}

	return true, result.Error
}

func (repo *registrationrepo) GetVehicleSummary(vehno string) (model.Vehicleregistraionsummary, error) {

	var obj model.Vehicleregistraionsummary
	result := repo.db.Where("regno = ?", vehno).First(&obj)
	return obj, result.Error
}

func (repo *registrationrepo) GetVehicleRegistration(vehno string) (model.VehicleRegInfo, error) {
	var obj model.VehicleRegInfo

	var summary model.Vehicleregistraionsummary
	var vehicledetails model.Vehicledetails
	var insurance model.Vehicleinsurancedetails
	var puc model.Vehiclepucdetails

	result := repo.db.Where("regno = ?", vehno).First(&summary)
	if result.RowsAffected == 0 {
		return obj, errors.New("no record found in vehicle regostration table")
	}

	if result.Error != nil {
		return obj, result.Error
	}
	result = repo.db.Where("vehicledetailsid = ?", summary.Vehicledetailsid).First(&vehicledetails)

	if result.RowsAffected == 0 {
		return obj, errors.New("no record found in vehicle details table")
	}

	if result.Error != nil {
		return obj, result.Error
	}

	result = repo.db.Where("vehicleinsuranceid = ?", summary.Insuranceid).First(&insurance)

	if result.RowsAffected == 0 {
		return obj, errors.New("no record found in insurance table")
	}

	if result.Error != nil {
		return obj, result.Error
	}

	result = repo.db.Where("vehiclepucid = ?", summary.Pucid).First(&puc)
	if result.RowsAffected == 0 {
		return obj, errors.New("no record found in puc table")
	}

	if result.Error != nil {
		return obj, result.Error
	}

	obj.Summary = summary
	obj.Vehicledetails = vehicledetails
	obj.Insurance = insurance
	obj.Puc = puc

	return obj, result.Error
}

func (repo *registrationrepo) GetVehicleInsurance(vehno string) (model.Vehicleinsurancedetails, error) {

	var summary model.Vehicleregistraionsummary
	var insurance model.Vehicleinsurancedetails

	result := repo.db.Where("regno = ?", vehno).First(&summary)

	if result.RowsAffected == 0 {
		return insurance, errors.New("no record found in vehicle regostration table")
	}

	if result.Error != nil {
		return insurance, result.Error
	}

	result = repo.db.Where("vehicleinsuranceid = ?", summary.Insuranceid).First(&insurance)

	if result.RowsAffected == 0 {
		return insurance, errors.New("no record found in insurance table")
	}

	if result.Error != nil {
		return insurance, result.Error
	}

	return insurance, result.Error
}

func (repo *registrationrepo) GetVehiclePuc(vehno string) (model.Vehiclepucdetails, error) {

	var summary model.Vehicleregistraionsummary
	var puc model.Vehiclepucdetails

	result := repo.db.Where("regno = ?", vehno).First(&summary)

	if result.RowsAffected == 0 {
		return puc, errors.New("no record found in vehicle regostration table")
	}

	if result.Error != nil {
		return puc, result.Error
	}

	result = repo.db.Where("vehiclepucid = ?", summary.Pucid).First(&puc)
	if result.RowsAffected == 0 {
		return puc, errors.New("no record found in puc table")
	}

	if result.Error != nil {
		return puc, result.Error
	}

	return puc, result.Error
}

func (repo *registrationrepo) GetVehicleDetails(vehno string) (model.Vehicledetails, error) {

	var summary model.Vehicleregistraionsummary
	var details model.Vehicledetails

	result := repo.db.Where("regno = ?", vehno).First(&summary)

	if result.RowsAffected == 0 {
		return details, errors.New("no record found in vehicle regostration table")
	}

	if result.Error != nil {
		return details, result.Error
	}

	result = repo.db.Where("vehicledetailsid = ?", summary.Vehicledetailsid).First(&details)

	if result.RowsAffected == 0 {
		return details, errors.New("no record found in vehicle details table")
	}

	if result.Error != nil {
		return details, result.Error
	}

	return details, result.Error
}
