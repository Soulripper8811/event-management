import axiosInstance from "@/lib/axios";
import { createContext, useEffect, useState } from "react";

export const userContext = createContext();

const UserContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      setIsLoading(true);
      try {
        const response = await axiosInstance.get("/users/profile", {
          withCredentials: true, // Make sure this is set if you're using cookies
        });
        setUser(response.data.user);
      } catch (error) {
        console.error("Failed to fetch user profile:", error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, []);

  return (
    <userContext.Provider value={{ user, setUser, isLoading, setIsLoading }}>
      {children}
    </userContext.Provider>
  );
};

export default UserContextProvider;
