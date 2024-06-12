import React, { ReactNode, useState } from 'react'
import { createContext, useContext } from 'react';
interface AuthContextProps{
    isLoggedIn: boolean;
    setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
    adminCredentials: {
        username: string;
        password: string;
    }
    setAdminCredentials: React.Dispatch<React.SetStateAction<{username: string, password: string}>>
   
}

const AuthContext = createContext<AuthContextProps>({
    isLoggedIn: false,
    adminCredentials:{
        username: '',
        password: ''
    },
    setIsLoggedIn: () => {},
    setAdminCredentials: () => {}
}
)

export default AuthContext;

