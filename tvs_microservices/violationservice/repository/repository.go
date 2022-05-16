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

func (db *violationConnection) AllViolation(vno string, isopen string) ([]model.Trafficviolationsystem, error) {
	var trafficviolationsystem []model.Trafficviolationsystem
	if isopen == "" {
		res := db.connection.Preload("Violationdetails").Where("vehicleregno = ?", vno).Find(&trafficviolationsystem)
		if res.Error != nil {
			return trafficviolationsystem, res.Error
		}
	} else {
		res := db.connection.Preload("Violationdetails").Where("vehicleregno = ? AND isopen = ?", vno, isopen).Find(&trafficviolationsystem)
		if res.Error != nil {
			return trafficviolationsystem, res.Error
		}
	}
	return trafficviolationsystem, nil
}
