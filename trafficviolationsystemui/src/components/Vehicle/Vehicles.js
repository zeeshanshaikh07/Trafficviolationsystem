import { Fragment } from "react";
import { useState, useEffect } from "react";
import { getVehicles } from "../../libs/api";
import SingleVehicle from "./SingleVehicle";

export default function Vehicles() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState();
  const [vehicles, setVehicles] = useState([]);
  const [isVehiclesEmpty, setIsVehiclesEmpty] = useState(false);

  useEffect(() => {
    async function fetchVehicleData() {
      await getVehicles().then((data) => {
        if (data.length !== 0) {
          setVehicles(data);
          setIsVehiclesEmpty(false);
        } else {
          setIsVehiclesEmpty(true);
        }

        setIsLoading(false);
      });
    }
    fetchVehicleData().catch((err) => {
      setIsLoading(false);
      setError(err.message);
    });
  }, []);

  if (isLoading) {
    return (
      <section
        style={{
          textAlign: "center",
          fontSize: "20px",
        }}
      >
        <p>Loading...</p>
      </section>
    );
  }

  const vehicleList = vehicles.map((vehicle) => (
    <SingleVehicle
      key={vehicle.uservehicleid}
      uservehicleid={vehicle.uservehicleid}
      chassisno={vehicle.chassisno}
      regno={vehicle.regno}
    />
  ));

  const vehiclesData = (
    <Fragment>
      {error && (
        <section
          style={{
            textAlign: "center",
            fontSize: "20px",
            color: "red",
          }}
        >
          <p>{error}</p>
        </section>
      )}
      {vehicleList}
    </Fragment>
  );

  return (
    <Fragment>
      {isVehiclesEmpty && (
        <section
          style={{
            textAlign: "center",
            fontSize: "20px",
            color: "red",
          }}
        >
          <p>No vehicle added.</p>
        </section>
      )}
      {!isVehiclesEmpty && vehiclesData}
    </Fragment>
  );
}
