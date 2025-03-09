"use client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useUser } from "@/context/UserContext";

export default function Header() {
  const { user, setUser, loading, showLoader, hideLoader, logout } = useUser();
  const router = useRouter(); // Initialize router

  return (
    <div className="p-4 border-b fixed w-full z-50 bg-black/80">
      <div className="px-3 flex flex-wrap items-center justify-between">
        {/* Logo + User Greeting */}
        <div className="flex flex-wrap gap-4 items-center">
          <Link
            href={"/home"}
            className="text-transparent cursor-pointer bg-clip-text text-3xl md:text-5xl font-bold bg-gradient-to-r from-[#999999] to-[#FFFFFF]"
          >
            AI Fitness Trainer
          </Link>
          <h1 className="text-white text-lg md:text-xl">
            Hii 🖐️, {user?.name}
          </h1>
        </div>

        {/* Navigation Buttons */}
        <div className="flex flex-wrap gap-2 mt-2 md:mt-0">
          <button
            type="submit"
            onClick={() => {
              showLoader();
              router.push("/diet");
              setTimeout(() => {
                hideLoader();
              }, 3000);
            }}
            className="rounded-md border cursor-pointer border-white bg-black/60 px-3 py-2 text-xs md:text-sm font-semibold text-white shadow-sm hover:bg-black/90 disabled:bg-black/15 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Diet
          </button>
          <button
            type="submit"
            onClick={() => {
              showLoader();
              router.push("/exercise");
              setTimeout(() => {
                hideLoader();
              }, 3000);
            }}
            className="rounded-md border cursor-pointer border-white bg-black/60 px-3 py-2 text-xs md:text-sm font-semibold text-white shadow-sm hover:bg-black/90 disabled:bg-black/15 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Exercise
          </button>
          <button
            type="submit"
            onClick={logout}
            className="rounded-md border cursor-pointer border-white bg-black/60 px-3 py-2 text-xs md:text-sm font-semibold text-white shadow-sm hover:bg-black/90 disabled:bg-black/15 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
