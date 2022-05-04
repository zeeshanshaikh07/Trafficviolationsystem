package utils

type Response struct {
	Error_message string      `json:"error_message"`
	Error_code    int         `json:"error_code"`
	Data          interface{} `json:"data"`
}

type EmptyObj struct{}

func BuildResponse(message string, code int, data interface{}) Response {

	res := Response{

		Error_message: message,
		Error_code:    code,
		Data:          data,
	}
	return res
}
