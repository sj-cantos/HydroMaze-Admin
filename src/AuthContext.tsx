import React, { ReactNode, useState } from 'react'
import { createContext, useContext } from 'react';
interface AuthContextProps{
    isLoggedIn: boolean;
    setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
}

const AuthContext = createContext<AuthContextProps>({
    isLoggedIn: false,
    setIsLoggedIn: () => {}
}
)

export default AuthContext;

