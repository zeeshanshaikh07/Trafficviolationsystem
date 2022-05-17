package repository

import (
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

func (db *violationConnection) AllViolation(vno string, isopen string) ([]model.Violationlist, error) {
	var violationlist []model.Violationlist
	if isopen == "" {
		res := db.connection.Preload("Violationdetails").Where("vehicleregno = ?", vno).Find(&violationlist)
		if res.Error != nil {
			return violationlist, res.Error
		}
	} else {
		res := db.connection.Preload("Violationdetails").Where("vehicleregno = ? AND isopen = ?", vno, isopen).Find(&violationlist)
		if res.Error != nil {
			return violationlist, res.Error
		}
	}
	return violationlist, nil
}

func (db *violationConnection) CloseViolationStatus(tvs model.Violationlist, tvsid uint64) (model.Violationlist, error) {
	resFind := db.connection.Where("violationlistid = ?", tvsid).Updates(&tvs)
	if resFind.Error != nil {
		return tvs, resFind.Error
	}
	return tvs, nil
}
