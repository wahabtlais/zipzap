import Link from "next/link";
import React from "react";

const Header = () => {
  return (
    <div className="w-full bg-white">
      <div className="w-[80%] py-5 m-auto flex items-center justify-between">
        <div>
          <Link href={"/"}>
            <span className="text-2xl font-bold">ZipZap</span>
          </Link>
        </div>
        <div className="w-[50%] relative">
          <input
            type="text"
            name=""
            id=""
            placeholder="Search for products..."
            className="w-full px-4 font-medium border-[2.5px] border-[#3489FF] outline-none h-[55px] rounded-full"
          />
          <div className="w-[60px] cursor-pointer flex items-center justify-center h-[55px] bg-[#3489FF] rounded-full absolute right-0 top-0"></div>
        </div>
      </div>
    </div>
  );
};

export default Header;
