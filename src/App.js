import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import NavBar from "./components/NavBar";
import LandingPage from "./components/LandingPage";
import BrowseBonds from "./components/BrowseBonds";
import Users from "./components/Users";
import IssueBond from "./components/IssueBond";
import BondIssuanceFlow from "./components/IssueBondV2";
import About from "./components/About";
import Profile from "./components/Profile";

const Layout = ({ children }) => {
  const location = useLocation();
  const hideNavBar = location.pathname === "/";
  return (
    <>
      {!hideNavBar && <NavBar />}
      {children}
    </>
  );
};

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route
          path="/home"
          element={
            <Layout>
              <LandingPage />
            </Layout>
          }
        />
        <Route
          path="/browse-bonds"
          element={
            <Layout>
              <BrowseBonds />
            </Layout>
          }
        />
        <Route
          path="/users"
          element={
            <Layout>
              <Users />
            </Layout>
          }
        />
        <Route
          path="/issue-bond"
          element={
            <Layout>
              {/* <IssueBond /> */}
              <BondIssuanceFlow />
            </Layout>
          }
        />
        <Route
          path="/about"
          element={
            <Layout>
              <About />
            </Layout>
          }
        />
        <Route path="/profile/:userId" element={<Layout><Profile /></Layout>} />
      </Routes>
    </Router>
  );
};

export default App;
