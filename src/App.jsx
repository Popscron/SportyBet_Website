import React from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { useAppToggle } from "./Context/AppToggleContext";
import Header from "./Layout/Header";
import PageLoader from "./Components/PageLoader";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// SportyBet imports
import SportyBetLogin from "./Pages/Login";
import SportyBetDashboard from "./Pages/Dashboard";
import SportyBetProtectedRoute from "./ProtectedRoute";
import SportyBetAllUsers from "./Components/AllUsers";
import SportyBetAddUser from "./Components/AddUser";
import SportyBetActiveUsers from "./Components/ActiveUsers";
import SportyBetDisableUsers from "./Components/DisableUsers";
import SportyBetExpiredUsers from "./Components/ExpiredUsers";
import IOSHomeScreen from "./Components/IOSHomeScreen";
import MatchUploaded from "./Components/MatchUploaded";
import UserAddon from "./Components/UserAddon";
import PasswordChangeRequests from "./Components/PasswordChangeRequests";
import DeviceRequests from "./Components/DeviceRequests";
import PendingRegistrations from "./Components/PendingRegistrations";
import { useAuth } from "./Context/AuthContext";

// 1Win imports
import { AuthProvider as OneWinAuthProvider } from "./Context/1win/AuthContext";
import OneWinLogin from "./Pages/1win/Login";
import OneWinDashboard from "./Pages/1win/Dashboard";
import OneWinProtectedRoute from "./Components/1win/ProtectedRoute";
import OneWinAllUsers from "./Pages/1win/AllUsers";
import OneWinAddUser from "./Pages/1win/AddUser";
import OneWinEditUser from "./Pages/1win/EditUser";
import OneWinExpiredUsers from "./Pages/1win/ExpiredUsers";
import OneWinDisabledUsers from "./Pages/1win/DisabledUsers";
import OneWinAllAdmins from "./Pages/1win/AllAdmins";
import OneWinWebsiteUsers from "./Pages/1win/WebsiteUsers";

// Wrapper component for 1Win protected routes
const OneWinProtectedWrapper = ({ children }) => {
  return (
    <OneWinAuthProvider>
      <OneWinProtectedRoute>{children}</OneWinProtectedRoute>
    </OneWinAuthProvider>
  );
};

const App = () => {
  const { activeApp, switchToApp } = useAppToggle();
  const { authUser, authLoading } = useAuth();
  const location = useLocation();
  const isAuthenticated = Boolean(authUser);

  // Determine which app to show based on URL pathname
  const isOneWinRoute = location.pathname.startsWith('/1win');

  // Sync activeApp with URL path
  React.useEffect(() => {
    if (isOneWinRoute) {
      if (activeApp !== '1win') {
        switchToApp('1win');
      }
    } else {
      if (activeApp !== 'sportybet') {
        switchToApp('sportybet');
      }
    }
  }, [location.pathname, activeApp, switchToApp, isOneWinRoute]);

  // Ensure default app is sportybet on initial load if no valid app is set
  React.useEffect(() => {
    const savedApp = localStorage.getItem('activeApp');
    if (!savedApp || (savedApp !== 'sportybet' && savedApp !== '1win')) {
      switchToApp('sportybet');
    }
  }, [switchToApp]);

  if (authLoading) return <PageLoader />;

  return (
    <div className="min-h-screen">
      <Header />
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
      <Routes>
        {/* 1Win Routes */}
        <Route
          path="/1win/login"
          element={
            <OneWinAuthProvider>
              <OneWinLogin />
            </OneWinAuthProvider>
          }
        />
        <Route
          path="/1win"
          element={
            <OneWinProtectedWrapper>
              <OneWinDashboard />
            </OneWinProtectedWrapper>
          }
        />
        <Route
          path="/1win/users"
          element={
            <OneWinProtectedWrapper>
              <OneWinAllUsers />
            </OneWinProtectedWrapper>
          }
        />
        <Route
          path="/1win/users/add"
          element={
            <OneWinProtectedWrapper>
              <OneWinAddUser />
            </OneWinProtectedWrapper>
          }
        />
        <Route
          path="/1win/users/edit/:id"
          element={
            <OneWinProtectedWrapper>
              <OneWinEditUser />
            </OneWinProtectedWrapper>
          }
        />
        <Route
          path="/1win/expired"
          element={
            <OneWinProtectedWrapper>
              <OneWinExpiredUsers />
            </OneWinProtectedWrapper>
          }
        />
        <Route
          path="/1win/disabled"
          element={
            <OneWinProtectedWrapper>
              <OneWinDisabledUsers />
            </OneWinProtectedWrapper>
          }
        />
        <Route
          path="/1win/admins"
          element={
            <OneWinProtectedWrapper>
              <OneWinAllAdmins />
            </OneWinProtectedWrapper>
          }
        />
        <Route
          path="/1win/users/website"
          element={
            <OneWinProtectedWrapper>
              <OneWinWebsiteUsers />
            </OneWinProtectedWrapper>
          }
        />

        {/* SportyBet Routes */}
        <Route
          path="/login"
          element={!isAuthenticated ? <SportyBetLogin /> : <Navigate to="/" replace />}
        />
        <Route element={<SportyBetProtectedRoute isAuthenticated={isAuthenticated} />}>
          <Route path="/" element={<SportyBetDashboard />} />
          <Route path="/users" element={<SportyBetAllUsers />} />
          <Route path="/addUser" element={<SportyBetAddUser />} />
          <Route path="/activeUsers" element={<SportyBetActiveUsers />} />
          <Route path="/disableUsers" element={<SportyBetDisableUsers />} />
          <Route path="/expiredUsers" element={<SportyBetExpiredUsers />} />
          <Route path="/IOSHomeScreen" element={<IOSHomeScreen />} />
          <Route path="/match-uploaded" element={<MatchUploaded />} />
          <Route path="/user-addons/:userId" element={<UserAddon />} />
          <Route path="/password-change-requests" element={<PasswordChangeRequests />} />
          <Route path="/device-requests" element={<DeviceRequests />} />
          <Route path="/pending-registrations" element={<PendingRegistrations />} />
        </Route>
        <Route path="*" element={<Navigate to={isAuthenticated ? "/" : "/login"} replace />} />
      </Routes>
    </div>
  );
};

export default App;
