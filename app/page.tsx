"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useUser } from "@/context/UserContext";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { account } from "./api/appwriter";

export default function Home() {
  const { user, setUser, logout, loading, showLoader, hideLoader } = useUser();
  const router = useRouter();
  const fetchUser = async () => {
    try {
      const userData = await account.get();
      router.push("/home");
      setUser(userData);
    } catch (error: any) {
      console.log("please login");
      setUser(null);
    } finally {
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <div
      className="flex min-h-screen flex-col items-center justify-center p-4 text-center"
      style={{
        backgroundImage: "url('/images/main.avif')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-black/60" />
      <div className="z-10 flex flex-col items-center bg-black/50 p-8 rounded-lg backdrop-blur-sm">
        <h1 className="mb-6 text-5xl font-bold text-white">
          AI Fitness Trainer
        </h1>
        <p className="mb-8 max-w-md text-white text-lg">
          Welcome to your fitness journey. Login or register to get started with
          your personalized coaching experience.
        </p>
        <div className="flex flex-col gap-4 sm:flex-row">
          <Button
            asChild
            variant="outline"
            className="px-8 text-lg font-semibold bg-black/60 hover:bg-white/90"
            onClick={() => showLoader()}
          >
            <Link href="/login" className="text-white hover:text-black/90">
              Login
            </Link>
          </Button>
          <Button
            onClick={() => showLoader()}
            asChild
            variant="outline"
            className="px-8 text-lg font-semibold  bg-black/60 hover:bg-white/90"
          >
            <Link href="/register" className="text-white hover:text-black/90">
              Register
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
