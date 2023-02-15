import React, { createContext, useState } from "react";

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [Auth, setAuth] = useState(null);
  const [profile, setProfile] = useState({});
  const [paginationNumber, setPaginationNumber] = useState(5);
  return (
    <AuthContext.Provider
      value={{
        Auth,
        setAuth,
        paginationNumber,
        profile,
        setProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
