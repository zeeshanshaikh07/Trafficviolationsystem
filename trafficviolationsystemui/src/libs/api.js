// import axios from "axios";

const ROOT_ROUTE_USERS = "http://localhost:8000/api/v1/users";
const ROOT_ROUTE_VEHICLE = "http://localhost:9001/api/v1/vehicle";
const ROOT_ROUTE_VIOLATION = "http://localhost:8002/api/v1/violation";

export async function login(userData) {
  const response = await fetch(`${ROOT_ROUTE_USERS}/login`, {
    method: "POST",
    body: JSON.stringify(userData),
    headers: {
      "Content-Type": "application/json",
    },
  });
  const resData = await response.json();
  if (resData.status_code === 200) {
    localStorage.setItem("token", resData.data.token);
    localStorage.setItem("roleid", resData.data.roleid);
    localStorage.setItem("isLoggedIn", "Y");
  }

  return resData;
}

export async function register(userData) {
  const response = await fetch(`${ROOT_ROUTE_USERS}/`, {
    method: "POST",
    body: JSON.stringify(userData),
    headers: {
      "Content-Type": "application/json",
    },
  });
  const resData = await response.json();

  return resData;
}

export async function addVehicle(vehicleData) {
  const response = await fetch(`${ROOT_ROUTE_USERS}/vehicles`, {
    method: "POST",
    body: JSON.stringify(vehicleData),
    headers: {
      "Content-Type": "application/json",
      Authorization: localStorage.getItem("token"),
    },
  });
  const resData = await response.json();

  return resData;
}

export async function getVehicles() {
  const response = await fetch(`${ROOT_ROUTE_USERS}/vehicles`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: localStorage.getItem("token"),
    },
  });
  const resData = await response.json();
  if (resData.status_code === 200) {
    const vehicleData = resData.data;

    return vehicleData;
  }
}

export async function updateVehicle(vehicleData, vehicleid) {
  const response = await fetch(`${ROOT_ROUTE_USERS}/vehicles/${vehicleid}`, {
    method: "PUT",
    body: JSON.stringify(vehicleData),
    headers: {
      "Content-Type": "application/json",
      Authorization: localStorage.getItem("token"),
    },
  });
  const resData = await response.json();

  return resData;
}

export async function deleteVehicle(vehicleid) {
  const response = await fetch(`${ROOT_ROUTE_USERS}/vehicles/${vehicleid}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: localStorage.getItem("token"),
    },
  });
  const resData = await response.json();

  return resData;
}

export async function getVehicleSummary(vehicleregno) {
  const response = await fetch(
    `${ROOT_ROUTE_VEHICLE}/registration?vehicleregno=${vehicleregno}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: localStorage.getItem("token"),
      },
    }
  );

  return response;
}

export async function getViolations() {
  const response = await fetch(`${ROOT_ROUTE_USERS}/vehicles`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: localStorage.getItem("token"),
    },
  });

  const loadedViolations = [];

  const resData = await response.json();
  resData.data.map(async (v) => {
    const response = await fetch(`${ROOT_ROUTE_VIOLATION}/${v.regno}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const resData = await response.json();
    console.log("RESDATA", resData.data);

    for (const key in resData.data) {
      loadedViolations.push({
        regnumber: resData.data[key].vehicleregno,
        city: resData.data[key].city,
        violationname: resData.data[key].violationdetails.name,
        violationdate: resData.data[key].createdat,
        state: resData.data[key].state,
        device: resData.data[key].devicetype,
        violationdetails: {
          violationcode: resData.data[key].violationdetails.code,
          longitude: resData.data[key].longitude,
          latitude: resData.data[key].latitude,
          violationcharge: resData.data[key].violationdetails.charge,
          description: resData.data[key].violationdetails.description,
        },
      });
    }
  });

  const loadedData = await loadedViolations;
  console.log("FROM API", loadedData);
  return loadedData;
}
