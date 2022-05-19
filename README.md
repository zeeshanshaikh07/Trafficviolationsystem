
# Traffic Violation System

Digitation is the rule of the world and is quickly growing and covering the entire nations. There were days when it started with paper-based system now be it anything automation is the key for faster delivery of any system.

So, we propose you a Traffic Violation System, where CCTV captures the vehicle data and process and stores into DB with vehicle and violation information. Our system will capture this data to identify the vehicle owner and violation information and severity of violation based on that vehicle owner should get changed penalties. 
User can pay these penalties using Web application



## Tech Stack

**Server:** Go

**Client:** React, React-Material-UI

**Database:** Mysql




## Run Locally

Clone the project

```bash
  git clone https://github.com/KadirSheikh/trafficviolationsystem.git
```


### Server

Go to the project directory

```bash
  cd trafficviolationsystem
  cd tvs_microservices
```

Install dependencies

```bash
  go mod download
```

Start the server

```bash
  go build main.go
  go run main.go
```
### Front end

Go to the project directory

```bash
  cd trafficviolationsystem
  cd trafficviolationsystemui
```

Install dependencies

```bash
  npm install
```

Start the server

```bash
  npm start
```
Go to http://localhost:8000


## Authors

- #### Kadir Sheikh
- #### Shilpa Uttarwar
- #### Zeeshan Shaikh
- #### Kshtija Gawande
