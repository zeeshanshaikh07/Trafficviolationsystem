import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import navImg from "../../assets/Images/tvsfooter.png";
import CallIcon from "@mui/icons-material/Call";
import TwitterIcon from "@mui/icons-material/Twitter";
import FacebookRoundedIcon from "@mui/icons-material/FacebookRounded";

export default function Footer() {
  return (
    <footer>
      <Box
        px={{ xs: 5, sm: 10 }}
        py={{ xs: 5, sm: 10 }}
        bgcolor="#cff4fe"
        color="black"
        marginTop="14%"
      >
        <Container maxWidth="lg">
          <Grid container spacing={3}>
            <Grid item md={3}>
              <Box borderbottom={1}></Box>
              <Box>
                <img
                  src={navImg}
                  width="180px"
                  Height="180px"
                  alt="Traffic Violation System"
                />
              </Box>
            </Grid>

            <Grid item md={3}>
              <Box>
                <h3>About</h3>
              </Box>
              <Box>
                Traffic Violation system are effective tools to help traffic
                administration to monitor the traffic condition
              </Box>
            </Grid>
            <Grid item md={3}>
              <Box>
                <h3>Learn More</h3>
                Traffic Violation system are effective tools to help traffic
                administration to monitor the traffic condition
              </Box>
            </Grid>
            <Grid item md={3}>
              <Box>
                <h3>Contact Us</h3>
              </Box>
              <Box>
                <CallIcon fontSize="large" display="inline-block" />
                <FacebookRoundedIcon fontSize="large" />
                <TwitterIcon fontSize="large" />
              </Box>
            </Grid>
          </Grid>
          <Box textAlign="center">
            Traffic Violation System &reg; {new Date().getFullYear()} Follow
            traffic rules and Be safe!
          </Box>
        </Container>
      </Box>
    </footer>
  );
}
