import "./App.css";
import React from "react";
import { Link } from "react-router-dom";
import Stack from "@mui/material/Stack";
import { Box, Typography } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import { useProfileStore } from "./globalState/useProfileStore";
import Popper from "@mui/material/Popper";
import Fade from "@mui/material/Fade";
import Paper from "@mui/material/Paper";
import LogoutIcon from "@mui/icons-material/Logout";
import { Button } from "@mui/material";
import { useAuth0 } from "@auth0/auth0-react";
import { Divider } from "@mui/material";
import AnimatedPage from "./transition/AnimatedPage";
import { useNavigate } from "react-router-dom";
import { storage } from "./firebase/firebaseConfig";
import { ref, getDownloadURL } from "firebase/storage";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { db } from "./firebase/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";

export default function Navbar() {
  const { logout, user } = useAuth0();

  const pic = useProfileStore((state) => state.profilePic);
  const name = useProfileStore((state) => state.profileName);
  const setProfilePic = useProfileStore((state) => state.setProfilePic);
  const setProfileName = useProfileStore((state) => state.setProfileName);
  const navigate = useNavigate();

  useEffect(() => {
  async function fetchData() {
    getDownloadURL(ref(storage, "ProfilePic/" + user.name)).then((url) => {
      setProfilePic(url);
    });

    getDoc(doc(db, "info", user.name)).then((docSnap) => {
      if (docSnap.exists()) {
        // console.log("Document data:", docSnap.data());
  
        setProfileName(docSnap.data().name);

      } else {
        console.log("No such document!");
      }
    });
  }
  try {
    fetchData();
  } catch (error) {
    console.log(error.message, "error getting image");
  }
}, []);

  const [anchorEl, setAnchorEl] = React.useState(null);
  const [open, setOpen] = React.useState(false);
  const [placement, setPlacement] = React.useState();

  const handleClick = (newPlacement) => (event) => {
    setAnchorEl(event.currentTarget);
    setOpen((prev) => placement !== newPlacement || !prev);
    setPlacement(newPlacement);
  };

  const navigateProfile = () => {
    navigate("/Profile");
  };

  const logoutUser = () => {
    logout({ returnTo: window.location.origin });
  };

  return (
    <AnimatedPage>
      <nav
        style={{ position: "sticky", maxHeight: "200px", padding: "30px" }}
        className="navbar"
      >
        <div className="links">
          <Popper
            className="popper"
            sx={{ width: "180px" }}
            open={open}
            anchorEl={anchorEl}
            placement={placement}
            transition
          >
            {({ TransitionProps }) => (
              <Fade {...TransitionProps} timeout={350}>
                <Paper sx={{ borderRadius: "10%", padding: "10px" }}>
                  <Box onClick={navigateProfile}>
                    <Typography sx={{ p: 2 }}>{name}</Typography>
                  </Box>
                  <Divider />
                  <Button
                    variant="contained"
                    sx={[
                      { width: "100%" },
                      { backgroundColor: "#fff" },
                      { color: "#FF0000" },
                      { "&:hover": { backgroundColor: "white" } },
                    ]}
                    disableElevation
                    onClick={logoutUser}
                    endIcon={<LogoutIcon />}
                  >
                    Log Out
                  </Button>
                </Paper>
              </Fade>
            )}
          </Popper>

          <Stack
            direction="row"
            justifyContent={"center"}
            alignItems="center"
            gap={20}
          >
            <Link to="/Home">
              <div className="clayButton p-2 px-7">
                <Typography variant="h6" className="custom">
                  Home
                </Typography>
              </div>
            </Link>
            <Link to="/Home/MyCards">
              <div className="clayButton p-2 px-7">
                <Typography variant="h6" className="custom">
                  Card Bucket
                </Typography>
              </div>
            </Link>

            <motion.div
              className="avatar right-12 absolute"
              whileTap={{ scale: 0.9 }}
            >
              <Avatar
                onClick={handleClick("bottom-end")}
                sx={{ width: 55, height: 55, border: "4px solid  #3366ff" }}
                alt={name}
                src={pic}
              />
            </motion.div>
          </Stack>
        </div>
      </nav>
    </AnimatedPage>
  );
}
