import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
} from "react";
import axios, { AxiosInstance } from "axios";
import { jwtDecode } from "jwt-decode";
export interface AuthContextProps {
  isLoggedIn: boolean;
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
  adminCredentials: {
    username: string;
    password: string;
    token: string;
  };
  setAdminCredentials: React.Dispatch<
    React.SetStateAction<{ username: string; password: string; token: string }>
  >;
  refreshToken: () => Promise<unknown>;
  axiosJWT: AxiosInstance;
  logout: () => object;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [adminCredentials, setAdminCredentials] = useState<{
    username: string;
    password: string;
    token: string;
  }>({
    username: "",
    password: "",
    token: "",
  });

  const refreshToken = async () => {
    try {
      const response = await axios.post("http://127.0.0.1:4001/auth/token", {
        token: localStorage.getItem("refreshToken"),
      });
      setAdminCredentials((prevState) => ({
        ...prevState,
        token: response.data.accessToken,
      }));
      localStorage.setItem("authToken", response.data.accessToken);
      return response.data;
    } catch (error) {
      console.log("Error refreshing token", error);
      setIsLoggedIn(false);
    }
  };
  const axiosJWT = axios.create();
  axiosJWT.interceptors.request.use(
    async (config) => {
      const currentdate = new Date();
      const decodedToken = jwtDecode(adminCredentials.token);
      if (
        decodedToken &&
        decodedToken.exp &&
        decodedToken.exp * 1000 < currentdate.getTime()
      ) {
        const data = await refreshToken();
        config.headers["authorization"] = "Bearer " + data.accessToken;
      }
      return config;
    },
    (error) => {
      Promise.reject(error);
    }
  );
  const logout = async () => {
    try {
      const response = await axios.delete("http://127.0.0.1:4001/auth/logout");
      if (response.status === 204) {
        localStorage.removeItem("authToken");
        localStorage.removeItem("refreshToken");
        setIsLoggedIn(false);
      }
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    const storedToken = localStorage.getItem("authToken");
    const storedRefreshToken = localStorage.getItem("refreshToken");
    if (storedToken && storedRefreshToken) {
      setAdminCredentials({ username: "", password: "", token: storedToken });
      setIsLoggedIn(true);
    }
  }, []);
  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     refreshToken();
  //   }, 15 * 60 * 1000); // Refresh token every 15 minutes
  //   return () => clearInterval(interval);
  // }, [refreshToken]);

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        setIsLoggedIn,
        adminCredentials,
        setAdminCredentials,
        refreshToken,
        axiosJWT,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
