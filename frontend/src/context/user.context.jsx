
import React, { createContext, useState, useContext } from 'react';

export const UserContext = createContext();


export const UserProvider = ({ children }) => {
    const [ user, setUser ] = useState(null);

    const signout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    return (
        <UserContext.Provider value={{ user, setUser, signout }}>
            {children}
        </UserContext.Provider>
    );
};