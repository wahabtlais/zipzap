import React from "react";

const GoogleButton = ({ ...props }) => {
  return (
    <div className="flex justify-center my-4">
      <button
        className="w-full flex justify-center items-center py-2 px-4 border border-[#4285F4] rounded-full shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all"
        {...props}
      >
        <img src="/images/google.png" alt="Google Logo" className="h-5 mr-2" />
        Sign in with Google
      </button>
    </div>
  );
};

export default GoogleButton;
