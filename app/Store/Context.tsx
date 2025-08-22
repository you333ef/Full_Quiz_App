'use client';

import { createContext, useState, ReactNode, Dispatch, SetStateAction } from "react";

type AuthContextType = {
  data_User: any;
  setData_User: Dispatch<SetStateAction<any>>;
};

export const AuthContext = createContext<AuthContextType | null>(null);

type Props = {
  children: ReactNode;
};

export const Fun_Provider = ({ children }: Props) => {
  const [data_User, setData_User] = useState<any>(null);

  return (
    <AuthContext.Provider value={{ data_User, setData_User }}>
      {children}
    </AuthContext.Provider>
  );
};
