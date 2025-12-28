import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { backend_URL } from "../config/config.js";
import PageLoader from "../Components/PageLoader.jsx";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authUser, setAuthUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  const fetchUser = async () => {
    try {
      const res = await axios.get(
        `${backend_URL}/auth/me`,
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );
      setAuthUser(res.data.user);
    } catch (err) {
      setAuthUser(null);
    } finally {
      setAuthLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <AuthContext.Provider value={{ authUser, setAuthUser, authLoading }}>
      {authLoading ? <PageLoader /> : children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
