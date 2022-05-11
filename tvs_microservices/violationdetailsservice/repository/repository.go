package repository

import (
	"violationdetails/model"

	"gorm.io/gorm"
)

type ViolationRepository interface {
	AllViolation(vno string) []model.Trafficviolationsystem
}

type violationConnection struct {
	connection *gorm.DB
}

func NewViolationRepository(dbConn *gorm.DB) ViolationRepository {
	return &violationConnection{
		connection: dbConn,
	}
}

func (db *violationConnection) AllViolation(vno string) []model.Trafficviolationsystem {
	var trafficviolationsystem []model.Trafficviolationsystem
	db.connection.Preload("Violationdetails").Where("vehicleregno = ?", vno).Find(&trafficviolationsystem)
	return trafficviolationsystem
}
