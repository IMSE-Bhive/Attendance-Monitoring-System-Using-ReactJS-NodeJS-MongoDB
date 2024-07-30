import React, { createContext, useEffect, useState } from "react";
const AppContext = createContext();

const AppProvider = ({children})=>{
    const [user, setUser] = useState(()=>{
        const savedUser = localStorage.getItem('user');
        return savedUser ? JSON.parse(savedUser):null;
    });

    useEffect(() => {
        // Store the user in localStorage whenever it changes
        if (user) {
          localStorage.setItem('user', JSON.stringify(user));
        } else {
          localStorage.removeItem('user');
        }
      }, [user]);

    return (
        <AppContext.Provider value={{user, setUser}}>
            {children}
        </AppContext.Provider>
    )
}

export {AppContext, AppProvider}