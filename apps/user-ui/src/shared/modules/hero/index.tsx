"use client";

import { MoveRight } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";

const Hero = () => {
  const router = useRouter();
  return (
    <div className="bg-[#114061] h-[85vh] flex flex-col justify-center w-full">
      <div className="md:w-[80%] w-[90%] m-auto md:flex h-full items-center">
        <div className="md:w-1/2">
          <p className="font-Roboto font-normal text-white pb-2 text-xl">
            Starting from 40$
          </p>
          <h1 className="text-white text-6xl font-extrabold font-Roboto">
            Discover Our Products
          </h1>
          <p className="font-Oregano text-3xl pt-4 text-white">
            Exclusive Offer <span className="text-yellow-400">10%</span> This
            Week!
          </p>
          <br />
          <button
            onClick={() => router.push("/products")}
            className="w-[140px] gap-2 font-semibold h-[40px] hover:text-white hover:bg-[#114061] bg-white text-[#114061] hover:border-white border-2 transition rounded-md flex items-center justify-center"
          >
            Shop Now <MoveRight />
          </button>
        </div>
        <div className="md:w-1/2 flex justify-center">
          <Image src={"/images/vr.png"} alt="" width={800} height={800} />
        </div>
      </div>
    </div>
  );
};

export default Hero;
