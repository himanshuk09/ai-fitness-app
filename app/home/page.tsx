"use client";
import { useEffect } from "react";
import Header from "@/components/Header";
import { account, ID } from "@/app/api/appwriter";
import Image from "next/image";
import { useUser } from "@/context/UserContext";
import { FitnessGrid } from "@/components/FitnessGrid";
import { SECTIONS } from "@/constants";
import { useRouter } from "next/navigation";

const HomeScreen = () => {
  const { user, setUser, loading, logout } = useUser();
  const router = useRouter();
  // Initialize useRouter

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
    <div className="min-h-screen bg-black text-white px-6 pb-12">
      <Header />
      <section className="relative min-h-screen mb-5 ">
        <Image
          src="/images/register.avif"
          alt="Fitness Hero"
          layout="fill"
          objectFit="cover"
          className="brightness-75 grayscale"
        />

        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <h1 className="text-4xl font-bold">Welcome, {user?.name}!</h1>
          <p className="mt-2 text-lg">Your AI-powered personal trainer</p>
        </div>
      </section>

      {SECTIONS.map((section: any) => (
        <div key={section.title} className="mb-12">
          <h2 className="text-3xl font-semibold text-center mb-6">
            {section.title}
          </h2>
          <FitnessGrid section={section} />
        </div>
      ))}
    </div>
  );
};

export default HomeScreen;
