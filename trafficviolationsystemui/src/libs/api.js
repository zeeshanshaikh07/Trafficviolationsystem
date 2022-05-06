// import axios from "axios";

const ROOT_ROUTE = "http://localhost:8000/api/v1/users";

export async function login(userData) {
  const response = await fetch(`${ROOT_ROUTE}/login`, {
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
  const response = await fetch(`${ROOT_ROUTE}/`, {
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
  const response = await fetch(`${ROOT_ROUTE}/vehicles`, {
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
