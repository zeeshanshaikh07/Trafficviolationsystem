package helper

import (
	"fmt"

	"github.com/BurntSushi/toml"
)

type Config struct {
	Db   database             `toml:"database"`
	Srv  server               `toml:"server"`
	Comm servicecommunication `toml:"servicecommunication"`
}

type database struct {
	Server   string
	Port     string
	Name     string
	User     string
	Password string
}

type server struct {
	Port string
}

type servicecommunication struct {
	Port string
}

func NewConfig() *Config {
	var conf Config

	if _, err := toml.DecodeFile("./infrastructure/config.toml", &conf); err != nil {
		fmt.Println(err)
	}
	fmt.Printf("%#v\n", conf)
	fmt.Println("db value \n", conf.Db.Port)
	return &conf
}
