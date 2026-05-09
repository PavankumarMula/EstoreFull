import {
  createContext,
  useContext,
  useMemo,
} from "react";

import { useCurrentUser } from "../hooks/userHook";

const AuthContext = createContext(null);

export const AuthProvider = ({
  children,
}) => {

  const accessToken =
    localStorage.getItem(
      "accessToken"
    );

  const {
    data: user = null,
    isLoading: loading,
    refetch: fetchUser,
  } = useCurrentUser({
    enabled: !!accessToken,
  });

  const logout = () => {

    localStorage.removeItem(
      "accessToken"
    );

    localStorage.removeItem(
      "refreshToken"
    );

    window.location.href =
      "/signin";
  };

  const value = useMemo(
    () => ({
      user,
      loading,
      fetchUser,
      logout,
      isAuthenticated:
        !!user && !!accessToken,
    }),
    [
      user,
      loading,
      accessToken,
      fetchUser,
    ]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {

  const context =
    useContext(AuthContext);

  if (!context) {

    throw new Error(
      "useAuth must be used inside AuthProvider"
    );
  }

  return context;
};