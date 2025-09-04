"use client";
import Link from "next/link";
import React from "react";
import { HeartIcon, Search, ShoppingBag } from "lucide-react";
import ProfileIcon from "@/assets/svg/ProfileIcon";
import HeaderBottom from "./HeaderBottom";
import useUser from "@/hooks/useUser";

const Header = () => {
  const { user, isLoading } = useUser();
  return (
    <div className="w-full bg-white">
      <div className="w-[80%] py-5 m-auto flex items-center justify-between">
        <div>
          <Link href={"/"}>
            <span className="text-3xl font-bold font-Poppins">ZipZap</span>
          </Link>
        </div>
        <div className="w-[50%] relative">
          <input
            type="text"
            name=""
            id=""
            placeholder="Search for products..."
            className="w-full px-4 font-medium border-[2.5px] border-[#3489FF] outline-none h-[45px] rounded-full font-Poppins"
          />
          <div className="w-[60px] cursor-pointer flex items-center justify-center h-[45px] bg-[#3489FF] rounded-full absolute right-0 top-0">
            <Search color="#fff" width={20} height={20} />
          </div>
        </div>
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2">
            {!isLoading && user ? (
              <>
                <Link
                  href={"/profile"}
                  className="border-2 w-[50px] h-[50px] flex items-center justify-center rounded-full border-[#010f1c1a]"
                >
                  <ProfileIcon />
                </Link>
                <Link href={"/profile"}>
                  <span className="block font-medium">Hello,</span>
                  <span className="font-semibold">
                    {user?.name?.split(" ")[0]}
                  </span>
                </Link>
              </>
            ) : (
              <>
                <Link
                  href={"/login"}
                  className="border-2 w-[50px] h-[50px] flex items-center justify-center rounded-full border-[#010f1c1a]"
                >
                  <ProfileIcon />
                </Link>
                <Link href={"/login"}>
                  <span className="block font-medium">Hello,</span>
                  <span className="font-semibold">
                    {isLoading ? "..." : "Sign In"}
                  </span>
                </Link>
              </>
            )}
          </div>
          <div className="flex items-center gap-5">
            <Link href={"/wishlist"} className="relative">
              <HeartIcon height={30} width={30} />
              <div className="w-6 h-6 border-2 border-white bg-red-500 rounded-full flex items-center justify-center absolute -top-[7px] -right-[7px]">
                <span className="text-white text-xs">0</span>
              </div>
            </Link>
            <Link href={"/cart"} className="relative">
              <ShoppingBag height={28} width={28} />
              <div className="w-6 h-6 border-2 border-white bg-red-500 rounded-full flex items-center justify-center absolute -top-[7px] -right-[7px]">
                <span className="text-white text-xs">0</span>
              </div>
            </Link>
          </div>
        </div>
      </div>
      <div className="border-b border-b-slate-200" />
      <HeaderBottom />
    </div>
  );
};

export default Header;
