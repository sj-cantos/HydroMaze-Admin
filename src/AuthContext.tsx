import React, { ReactNode, useState } from 'react'
import { createContext, useContext } from 'react';
export interface AuthContextProps{
    isLoggedIn: boolean;
    setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
    adminCredentials: {
        username: string;
        password: string;
        token: string;
    }
    setAdminCredentials: React.Dispatch<React.SetStateAction<{username: string, password: string, token: string}>>
   
}

const AuthContext = createContext<AuthContextProps>({
    isLoggedIn: false,
    adminCredentials:{
        username: '',
        password: '',
        token: ''
    },
    setIsLoggedIn: () => {},
    setAdminCredentials: () => {}
}
)

export default AuthContext;

