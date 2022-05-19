package repository

import (
	"errors"
	"fmt"

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

	//TODO: AUtomigration will implement in helper function
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

	fmt.Println("Rows and error ", result.RowsAffected, result.Error)
	fmt.Printf("Repo getvehvle %#v \n", obj)

	return true, result.Error
}

func (repo *registrationrepo) GetVehicleSummary(vehno string) (model.Vehicleregistraionsummary, error) {

	var obj model.Vehicleregistraionsummary

	//result := repo.db.First(&obj, vehno)

	result := repo.db.Where("regno = ?", vehno).First(&obj)

	fmt.Println("Rows and error ", result.RowsAffected, result.Error)
	fmt.Printf("Repo getvehicle %#v \n", obj)

	return obj, result.Error
}

func (repo *registrationrepo) GetVehicleRegistration(vehno string) (model.VehicleRegInfo, error) {
	var obj model.VehicleRegInfo

	var summary model.Vehicleregistraionsummary
	var vehicledetails model.Vehicledetails
	var insurance model.Vehicleinsurancedetails
	var puc model.Vehiclepucdetails

	result := repo.db.Where("regno = ?", vehno).First(&summary)

	fmt.Println("summary", summary)
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
	fmt.Println("Details", vehicledetails)

	result = repo.db.Where("vehicleinsuranceid = ?", summary.Insuranceid).First(&insurance)

	if result.RowsAffected == 0 {
		return obj, errors.New("no record found in insurance table")
	}

	if result.Error != nil {
		return obj, result.Error
	}
	fmt.Println("insurance", insurance)

	result = repo.db.Where("vehiclepucid = ?", summary.Pucid).First(&puc)
	if result.RowsAffected == 0 {
		return obj, errors.New("no record found in puc table")
	}

	if result.Error != nil {
		return obj, result.Error
	}
	fmt.Println("puc", puc)

	obj.Summary = summary
	obj.Vehicledetails = vehicledetails
	obj.Insurance = insurance
	obj.Puc = puc

	fmt.Println("Object", obj)

	return obj, result.Error
}

func (repo *registrationrepo) GetVehicleInsurance(vehno string) (model.Vehicleinsurancedetails, error) {

	var summary model.Vehicleregistraionsummary
	var insurance model.Vehicleinsurancedetails

	result := repo.db.Where("regno = ?", vehno).First(&summary)

	fmt.Println("summary", summary)
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
	fmt.Println("insurance", insurance)

	return insurance, result.Error
}

func (repo *registrationrepo) GetVehiclePuc(vehno string) (model.Vehiclepucdetails, error) {

	var summary model.Vehicleregistraionsummary
	var puc model.Vehiclepucdetails

	result := repo.db.Where("regno = ?", vehno).First(&summary)

	fmt.Println("summary", summary)
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
	fmt.Println("puc", puc)

	return puc, result.Error
}

func (repo *registrationrepo) GetVehicleDetails(vehno string) (model.Vehicledetails, error) {

	var summary model.Vehicleregistraionsummary
	var details model.Vehicledetails

	result := repo.db.Where("regno = ?", vehno).First(&summary)

	fmt.Println("summary", summary)
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
	fmt.Println("Details", details)

	return details, result.Error
}
