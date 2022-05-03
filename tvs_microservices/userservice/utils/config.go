package utils

import (
	"fmt"

	"github.com/BurntSushi/toml"
)

type Config struct {
	Database database
}

type database struct {
	Host     string
	Port     string
	Database string
	User     string
	Password string
	Secret   string
}

func NewConfig() *Config {
	var conf Config
	if _, err := toml.DecodeFile("./config.toml", &conf); err != nil {
		fmt.Println(err)
	}
	fmt.Printf("%#v\n", conf)
	return &conf
}
