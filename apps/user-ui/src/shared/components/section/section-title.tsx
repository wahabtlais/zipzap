import React from "react";

const SectionTitle = ({ title }: { title: string }) => {
  return (
    <div className="relative">
      <h1 className="md:text-3xl text-xl relative z-10 font-semibold border-b-4 border-[#114061]/[.1] w-fit pb-1">
        {title}
      </h1>
      {/* <div className="absolute  bg-[#114061]/[.1] w-full h-[10%]"></div> */}
    </div>
  );
};

export default SectionTitle;
