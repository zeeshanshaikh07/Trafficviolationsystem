package model

type Userpayment struct {
	Userpaymentid     uint64 `gorm:"primary_key:auto_increment" json:"userpaymentid"`
	Loginid           string `gorm:"type:varchar(50)" json:"loginid"`
	Transactionid     string `gorm:"type:varchar(100)" json:"transactionid"`
	Transactionstatus uint64 `gorm:"type:uint64" json:"transactionstatus"`
	// Userviolationid   uint64  `gorm:"type:bigint(11)" json:"userviolationid"`
	Violationname   string  `gorm:"type:varchar(100)" json:"violationname"`
	Amount          float64 `gorm:"type:float64" json:"amount"`
	Paymentmode     string  `gorm:"type:varchar(50)" json:"paymentmode"`
	Vehicleregno    string  `gorm:"type:varchar(50)" json:"vehicleregno"`
	Transactiondate string  `gorm:"type:date" json:"transactiondate"`
}
type Paymentdto struct {
	Loginid           string `json:"loginid" form:"loginid"`
	Transactionid     string `json:"transactionid" form:"transactionid"`
	Transactionstatus uint64 `json:"transactionstatus" form:"transactionstatus"`
	// Userviolationid   uint64  `json:"userviolationid" form:"userviolationid"`
	Violationname   string  `json:"violationname" form:"violationname"`
	Amount          float64 `json:"amount" form:"amount"`
	Paymentmode     string  `json:"paymentmode" form:"paymentmode"`
	Vehicleregno    string  `json:"vehicleregno" form:"vehicleregno"`
	Transactiondate string  `json:"transactiondate" form:"transactiondate" `
}
type PaymentService interface {
	MakePayment(payment Paymentdto) (Userpayment, error)
	GetAllPaymentDetails(loginid string) ([]Userpayment, error)
}
type PaymentRepository interface {
	Add(payment Userpayment) (Userpayment, error)
	Get(loginid string) ([]Userpayment, error)
}
