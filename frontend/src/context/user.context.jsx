import { createContext, useState, useContext } from "react";

export const UserContext = createContext();

export const Contexts = {
  UserProvider: ({ children }) => {
    const [user, setUser] = useState(null);
    return (
      <UserContext.Provider value={{ user, setUser }}>
        {children}
      </UserContext.Provider>
    );
  },

  useUSer: () => {
    return useContext(UserContext);
  },
};
