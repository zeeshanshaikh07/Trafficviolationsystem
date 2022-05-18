import { useNavigate } from "react-router-dom";
import Card from "../../layouts/Card/Card";
import failed from "../../assets/Images/failed.png";
import classes from "../../assets/Styling/Auth.module.css";
import Button from "@mui/material/Button";

export default function PaymentFailure() {
  const navigate = useNavigate();

  const retry = () => {
    navigate("/violations");
  };
  return (
    <Card>
      <div
        style={{
          textAlign: "center",
        }}
      >
        <img src={failed} alt="failed" />
        <h1
          style={{
            color: "red",
          }}
        >
          Payment failed!
        </h1>
        <Button
          className={classes.btn}
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
          onClick={retry}
        >
          retry
        </Button>
      </div>
    </Card>
  );
}
