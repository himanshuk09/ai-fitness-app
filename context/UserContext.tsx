"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { account } from "@/app/api/appwriter"; // Adjust the path accordingly
// import { useRouter } from "next/router";
import { useRouter } from "next/navigation";

// Create User Context
const UserContext = createContext<any>(null);

// Custom Hook to use the context
export const useUser = () => useContext(UserContext);

// User Provider Component
export const UserProvider = ({ children }: any) => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState<any>(false);
  const router = useRouter();

  // Function to start loader
  const showLoader = () => setLoading(true);

  // Function to stop loader
  const hideLoader = () => setLoading(false);
  const checkSession = async () => {
    try {
      const session = await account.getSession("current");
      if (!session) {
        console.log("No active session, redirecting to login...");
        router.push("/");
      }
    } catch (error: any) {
      console.error("Session error:", error?.message);
      router.push("/");
    }
  };
  // Logout function
  const logout = async () => {
    try {
      showLoader();
      await account.deleteSession("current");
      setUser(null);
      router.push("/"); // Redirect to login page after logout
    } catch (error: any) {
      console.error("Logout error:", error?.message);
    } finally {
      hideLoader();
    }
  };

  return (
    <UserContext.Provider
      value={{ user, setUser, loading, showLoader, hideLoader, logout }}
    >
      {/* {loading && ( // Show loader only when loading is true
        <div className="fixed inset-0 flex items-center justify-center bg-black/30 bg-opacity-50 z-50">
          <div className="cursor-pointer bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent font-bold text-lg ">
            <div className="flex justify-center items-center h-screen">
              <div className="animate-spin ease-linear rounded-full w-10 h-10 border-t-2 border-b-2 border-purple-500"></div>
              <div className="animate-spin ease-linear rounded-full w-10 h-10 border-t-2 border-b-2 border-red-500 ml-3"></div>
              <div className="animate-spin ease-linear rounded-full w-10 h-10 border-t-2 border-b-2 border-blue-500 ml-3"></div>
            </div>
          </div>
        </div>
      )} */}
      {/* {loading && (
       
        <div className="fixed inset-0 flex items-center justify-center bg-black/30 bg-opacity-50 z-50">
          <div className="flex-col gap-4 w-full flex items-center justify-center">
            <div className="w-20 h-20 border-4 border-transparent  text-black text-4xl animate-spin flex items-center justify-center border-t-black rounded-full">
              <div className="w-16 h-16 border-4 border-transparent text-white  text-2xl animate-spin flex items-center justify-center border-t-white rounded-full"></div>
            </div>
          </div>
        </div>
      )} */}
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 bg-opacity-50 z-50">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-gray mx-auto"></div>
            <h2 className="text-zinc-900 dark:text-white mt-4">Loading...</h2>
            <p className="text-zinc-600 dark:text-zinc-400">
              Your adventure is about to begin
            </p>
          </div>
        </div>
      )}
      {children}
    </UserContext.Provider>
  );
};
