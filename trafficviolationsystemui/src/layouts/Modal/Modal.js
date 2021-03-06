import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { PaytmButton } from "../../utils/Payment/paytmButton";

export default function Modal({
  isOpen,
  handleClose,
  title,
  children,
  charge,
  tvsid,
  regno,
  vname,
}) {
  const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    "& .MuiDialogContent-root": {
      padding: theme.spacing(2),
    },
    "& .MuiDialogActions-root": {
      padding: theme.spacing(1),
    },
  }));

  const BootstrapDialogTitle = (props) => {
    const { children, onClose, ...other } = props;

    return (
      <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
        {children}
        {onClose ? (
          <IconButton
            aria-label="close"
            onClick={onClose}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        ) : null}
      </DialogTitle>
    );
  };
  return (
    <BootstrapDialog
      onClose={handleClose}
      aria-labelledby="customized-dialog-title"
      open={isOpen}
      color="white"
      fullWidth
    >
      <BootstrapDialogTitle
        id="customized-dialog-title"
        onClose={handleClose}
        style={{
          backgroundColor: "#313082",
          color: "white",
        }}
      >
        {title}
      </BootstrapDialogTitle>
      <DialogContent dividers>{children}</DialogContent>
      <DialogActions>
        <PaytmButton
          violationname={vname}
          amount={charge}
          orderid={tvsid}
          regno={regno}
        >
          Confirm
        </PaytmButton>
        <Button
          variant="contained"
          autoFocus
          onClick={handleClose}
          style={{
            backgroundColor: "#DC143C",
            color: "white",
            marginLeft: "1rem",
          }}
        >
          Cancel
        </Button>
      </DialogActions>
    </BootstrapDialog>
  );
}
