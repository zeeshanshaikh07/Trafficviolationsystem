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

func (db *violationConnection) AllViolation(vno string, closure string) ([]model.Trafficviolationsystem, error) {
	var trafficviolationsystem []model.Trafficviolationsystem
	if closure == "" {
		res := db.connection.Preload("Violationdetails").Where("vehicleregno = ?", vno).Find(&trafficviolationsystem)
		if res.Error != nil {
			return trafficviolationsystem, res.Error
		}
	} else {
		res := db.connection.Preload("Violationdetails").Where("vehicleregno = ? AND closure = ?", vno, closure).Find(&trafficviolationsystem)
		if res.Error != nil {
			return trafficviolationsystem, res.Error
		}
	}
	return trafficviolationsystem, nil
}
