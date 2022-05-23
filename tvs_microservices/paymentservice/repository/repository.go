package repository

import (
	"paymentMicroservice/model"

	"gorm.io/gorm"
)

type paymentConnection struct {
	connection *gorm.DB
}

func NewPaymentRepository(db *gorm.DB) *paymentConnection {
	return &paymentConnection{
		connection: db,
	}
}

func (db *paymentConnection) Add(payment model.Userpayment) (model.Userpayment, error) {
	res := db.connection.Save(&payment)
	return payment, res.Error

}

func (db *paymentConnection) Get(loginid string) ([]model.Userpayment, error) {
	var userPayment []model.Userpayment
	resFind := db.connection.Where("loginid = ?", loginid).Take(&userPayment)
	if resFind.Error == nil {
		res := db.connection.Where("loginid = ?", loginid).Find(&userPayment)
		return userPayment, res.Error
	}
	return userPayment, resFind.Error

}
