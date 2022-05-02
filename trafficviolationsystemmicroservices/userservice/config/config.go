package config

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
	Dbname   string
	User     string
	Password string
}

func NewConfig() *Config {
	var conf Config
	if _, err := toml.DecodeFile("./config.toml", &conf); err != nil {
		fmt.Println(err)
	}
	return &conf
}
