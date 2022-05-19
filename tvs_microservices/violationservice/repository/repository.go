package repository

import (
	"errors"
	"fmt"
	"violationdetails/model"

	"gorm.io/gorm"
)

type violationConnection struct {
	connection *gorm.DB
}

func NewViolationRepository(dbConn *gorm.DB) *violationConnection {
	return &violationConnection{
		connection: dbConn,
	}
}

func (db *violationConnection) AllViolation(vno string, isclose string) ([]model.Violationlist, error) {
	var violationlist []model.Violationlist
	resFind := db.connection.Where("vehicleregno = ?", vno).Take(&violationlist)
	if resFind.Error != nil {
		return violationlist, resFind.Error
	}
	if isclose == "" {
		res := db.connection.Preload("Violationdetails").Where("vehicleregno = ?", vno).Find(&violationlist)
		if res.Error != nil {
			return violationlist, res.Error
		}
	} else {
		resFind := db.connection.Where("vehicleregno = ? AND isclose = ?", vno, isclose).Take(&violationlist)
		if resFind.Error != nil {
			return violationlist, resFind.Error
		}
		res := db.connection.Preload("Violationdetails").Where("vehicleregno = ? AND isclose = ?", vno, isclose).Find(&violationlist)
		if res.Error != nil {
			return violationlist, res.Error
		}
	}
	return violationlist, nil
}

func (db *violationConnection) GetViolation(filter string, value string) ([]model.Violationlist, error) {
	fmt.Println("Repo", filter, value)
	var violationlist []model.Violationlist
	switch {
	case filter == "city":
		resFind := db.connection.Where("city = ?", value).Take(&violationlist)
		if resFind.Error != nil {
			return violationlist, resFind.Error
		}
		res := db.connection.Preload("Violationdetails").Where("city = ?", value).Find(&violationlist)
		fmt.Println("Result repo", violationlist, res, res.Error)
		return violationlist, res.Error
	case filter == "state":
		resFind := db.connection.Where("state = ?", value).Take(&violationlist)
		if resFind.Error != nil {
			return violationlist, resFind.Error
		}
		res := db.connection.Preload("Violationdetails").Where("state = ?", value).Find(&violationlist)
		return violationlist, res.Error
	}
	return nil, errors.New("invalid filter")
}

func (db *violationConnection) CloseViolationStatus(tvs model.Violationlist, tvsid uint64) (model.Violationlist, error) {
	resFind := db.connection.Where("violationlistid = ?", tvsid).Updates(&tvs)
	if resFind.Error != nil {
		return tvs, resFind.Error
	}
	res := db.connection.Where("violationlistid = ?", tvsid).Take(&tvs)
	if res.Error != nil {
		return tvs, res.Error
	}
	return tvs, nil
}
