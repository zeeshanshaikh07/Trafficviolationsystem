package service

import (
	"log"

	"paymentMicroservice/model"

	"github.com/mashingan/smapping"
)

type paymentService struct {
	paymentRepository model.PaymentRepository
}

func NewPaymentService(userRep model.PaymentRepository) *paymentService {
	return &paymentService{
		paymentRepository: userRep,
	}
}
func (service *paymentService) MakePayment(user model.Paymentdto) (model.Userpayment, error) {
	userPayment := model.Userpayment{}
	err := smapping.FillStruct(&userPayment, smapping.MapFields(&user))
	if err != nil {
		log.Fatalf("Mapping between user and user payment is failed %v", err)
		return userPayment, err
	}
	return service.paymentRepository.Add(userPayment)

}

func (service *paymentService) GetAllPaymentDetails(loginid string) ([]model.Userpayment, error) {
	return service.paymentRepository.Get(loginid)

}
