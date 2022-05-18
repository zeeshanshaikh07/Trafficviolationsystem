import { useNavigate } from "react-router-dom";
import Card from "../../layouts/Card/Card";
import success from "../../assets/Images/success.png";
import classes from "../../assets/Styling/Auth.module.css";
import Button from "@mui/material/Button";
export default function PaymentSuccess() {
  const navigate = useNavigate();

  const goback = () => {
    navigate("/violations");
  };
  return (
    <Card>
      <div
        style={{
          textAlign: "center",
        }}
      >
        <img src={success} alt="Success" />
        <h1
          style={{
            color: "green",
          }}
        >
          Payment successfull!
        </h1>
        <Button
          className={classes.btn}
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
          onClick={goback}
        >
          go back
        </Button>
      </div>
    </Card>
  );
}
