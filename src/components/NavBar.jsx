import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Menu,
  MenuItem,
  IconButton,
  Avatar,
  Box,
  Button,
} from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useNavigate } from "react-router-dom";
import UserMenu from "./UserMenu";  // Import UserMenu component

const NavBar = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [userMenuAnchorEl, setUserMenuAnchorEl] = useState(null);  // State for user menu
  const navigate = useNavigate();

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleUserMenuOpen = (event) => {
    setUserMenuAnchorEl(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setUserMenuAnchorEl(null);
  };

  const handleProfile = () => {
    navigate("/users");
    handleClose();
  };

  const handleActivity = () => {
    navigate("/activity");
    handleClose();
  };

  const handleIssueBond = () => {
    navigate("/issue-bond");
    handleClose();
  };

  const handleDisconnect = () => {
    // Add logic to disconnect wallet
    handleClose();
  };

  const handleUserSwitch = (userId) => {
    // Handle user switch logic
    handleUserMenuClose();
  };

  return (
    <AppBar position="static" sx={{ backgroundColor: "#1976d2" }}>
      <Toolbar>
        <Typography
          variant="h6"
          sx={{ flexGrow: 1, cursor: "pointer" }}
          onClick={() => navigate("/home")}
        >
          IOU Finance
        </Typography>
        <Button color="inherit" onClick={() => navigate("/")}>
          Home
        </Button>
        <Button color="inherit" onClick={() => navigate("/browse-bonds")}>
          Browse Bonds
        </Button>
        <Button color="inherit" onClick={() => navigate("/about")}>
          About
        </Button>
        <IconButton edge="end" color="inherit" onClick={handleUserMenuOpen}>
          <AccountCircleIcon />
        </IconButton>
        <UserMenu
          anchorEl={userMenuAnchorEl}
          open={Boolean(userMenuAnchorEl)}
          onClose={handleUserMenuClose}
          onUserSwitch={handleUserSwitch}
        />
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;
