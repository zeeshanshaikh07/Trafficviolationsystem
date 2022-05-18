const ROOT_ROUTE_USERS = "http://localhost:8000/api/v1/users";
const ROOT_ROUTE_VEHICLES = "http://localhost:8001/api/v1/vehicle";
const ROOT_ROUTE_VIOLATIONS = "http://localhost:8002/api/v1/violation";
const ROOT_ROUTE_PAYMENTS = "http://localhost:8004/api/v1/payments";

export async function login(userData) {
  const response = await fetch(`${ROOT_ROUTE_USERS}/login`, {
    method: "POST",
    body: JSON.stringify(userData),
    headers: {
      "Content-Type": "application/json",
    },
  });
  const resData = await response.json();
  console.log(resData.data);
  if (resData.status_code === 200) {
    localStorage.setItem("token", resData.data.token);
    localStorage.setItem("roleid", resData.data.roleid);
    localStorage.setItem("loginid", resData.data.loginid);
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
  if (resData.status_code === 200) {
    localStorage.setItem("token", resData.data.token);
    localStorage.setItem("roleid", resData.data.roleid);
    localStorage.setItem("loginid", resData.data.loginid);
    localStorage.setItem("isLoggedIn", "Y");
  }
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
    `${ROOT_ROUTE_VEHICLES}/registration?vehicleregno=${vehicleregno}`,
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

export async function getViolations(type) {
  console.log("DROPDOWNVALUE", type);

  let violationUrl;

  let loadedViolations = [];
  const response = await fetch(`${ROOT_ROUTE_USERS}/vehicles`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: localStorage.getItem("token"),
    },
  });

  const resData = await response.json();
  if (resData.status_code === 200) {
    await Promise.all(
      resData.data.map(async (v) => {
        if (type === "Open") {
          violationUrl = `${ROOT_ROUTE_VIOLATIONS}/${v.regno}?isopen=0`;
        } else if (type === "Close") {
          violationUrl = `${ROOT_ROUTE_VIOLATIONS}/${v.regno}?isopen=1`;
        } else {
          violationUrl = `${ROOT_ROUTE_VIOLATIONS}/${v.regno}`;
        }
        const response = await fetch(violationUrl, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: localStorage.getItem("token"),
          },
        });

        const resData = await response.json();

        if (resData.status_code === 200) {
          await Promise.all(
            resData.data.map(async (item) => {
              await loadedViolations.push({
                violationid: item.violationlistid,
                regnumber: item.vehicleregno,
                city: item.city,
                violationname: item.violationdetails.name,
                violationdate: item.createdat,
                state: item.state,
                charge: item.violationdetails.charge,
                violationdetails: {
                  violationid: item.violationlistid,
                  violationcode: item.violationdetails.code,
                  longitude: item.longitude,
                  latitude: item.latitude,
                  device: item.devicetype,
                  charge: item.violationdetails.charge,
                  description: item.violationdetails.description,
                  violationname: item.violationdetails.name,
                  violationdate: item.createdat,
                  regnumber: item.vehicleregno,
                },
              });
            })
          );
        }
      })
    );
  }

  return loadedViolations;
}

export async function storePayment(paymentData) {
  const response = await fetch(`${ROOT_ROUTE_PAYMENTS}/`, {
    method: "POST",
    body: JSON.stringify(paymentData),
    headers: {
      "Content-Type": "application/json",
      Authorization: localStorage.getItem("token"),
    },
  });
  const resData = await response.json();

  return resData;
}

export async function violationClosure(violationData, violationid) {
  const response = await fetch(`${ROOT_ROUTE_VIOLATIONS}/${violationid}`, {
    method: "PUT",
    body: JSON.stringify(violationData),
    headers: {
      "Content-Type": "application/json",
      Authorization: localStorage.getItem("token"),
    },
  });
  const resData = await response.json();

  return resData;
}
