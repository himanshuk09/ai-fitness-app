"use client";
import { useEffect, useRef, useState } from "react";
import Header from "@/components/Header";
import { DietIntro } from "@/components/Intro";
import UserForm from "@/components/UserForm";
import TableToPDF from "@/components/TableToPDF";
import { useUser } from "@/context/UserContext";
import { account } from "../api/appwriter";
import { useRouter } from "next/navigation";
export default function Home() {
  const { user, setUser, logout, loading, showLoader, hideLoader } = useUser();
  const [data, setData] = useState([]);
  const router = useRouter();

  useEffect(() => {
    setTimeout(() => {
      hideLoader();
    }, 1000);
  }, []);
  const scrollRef = useRef<any>(null);

  useEffect(() => {
    if (data.length > 0 && scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [data]);
  // Fetch user data
  const fetchUser = async () => {
    try {
      const userData = await account.get();
      setUser(userData);
    } catch (error: any) {
      router.push("/");
      console.log("User not authenticated:", error.message);
      setUser(null);
    } finally {
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);
  return (
    <main className="flex flex-col min-h-screen bg-black">
      <div
        className={"w-full min-h-screen  flex-grow"}
        style={{
          backgroundImage: "url('/images/new.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <Header />
        <div className={"mt-24 px-4 my-6"}>
          <div className={"max-w-5xl rounded-lg p-4 mx-auto bg-black/80 backdrop-blur-sm"}>
            <DietIntro name={user?.name} />
            <div className={"w-full"}>
              <UserForm setData={setData} />
            </div>
          </div>
        </div>
      </div>
      <div className={`${data.length > 0 ? "mt-24 px-14 my-6" : ""}`}>
        {loading ? (
          <div
            className={
              "w-full text-center text-secondary-light p-2 text-xl font-normal"
            }
          >
            Working on it...
          </div>
        ) : data.length > 0 ? (
          <>
            <div ref={scrollRef} />{" "}
            <TableToPDF data={data} file_name={user?.name} />
          </>
        ) : undefined}
      </div>
    </main>
  );
}
