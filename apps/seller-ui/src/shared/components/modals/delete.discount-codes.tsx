import { X } from "lucide-react";
import React from "react";

const DeleteDiscountCodeModal = ({
  discount,
  onClose,
  onConfirm,
  isDeleting,
}: {
  discount: any;
  onClose: () => void;
  onConfirm?: any;
  isDeleting?: boolean;
}) => {
  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-gray-800 p-6 rounded-lg w-[450px] shadow-lg">
        {/* Header */}
        <div className="flex justify-between items-center border-b border-gray-700 pb-3">
          <h3 className="text-xl text-white">Delete Discount Code</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition"
          >
            <X size={22} />
          </button>
        </div>
        {/* Content */}
        <div className="mt-4">
          <p className="text-gray-300">
            Are you sure you want to delete the discount code{" "}
            <span className="font-semibold">{discount?.public_name}</span>?
          </p>
        </div>
        {/* Footer */}
        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-md text-white transition"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isDeleting}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-md text-white transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteDiscountCodeModal;
