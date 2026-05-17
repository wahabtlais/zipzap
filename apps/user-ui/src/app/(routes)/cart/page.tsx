"use client";
import useDeviceTracking from "@/hooks/useDeviceTracking";
import useLocationTracking from "@/hooks/useLocationTracking";
import useUser from "@/hooks/useUser";
import { useStore } from "@/store";
import { Trash } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

const CartPage = () => {
  const router = useRouter();
  const { user } = useUser();
  const location = useLocationTracking();
  const deviceInfo = useDeviceTracking();
  const cart = useStore((state: any) => state.cart);
  const removeFromCart = useStore((state: any) => state.removeFromCart);
  const [loading, setLoading] = useState(false);
  const [discountedProductId, setDiscountedProductId] = useState("");
  const [discountPercentage, setDiscountPercentage] = useState(0);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [couponCode, setCouponCode] = useState("");
  const [selectedAddressId, setSelectedAddressId] = useState("");

  const decreaseQuantity = (id: string) => {
    useStore.setState((state: any) => ({
      cart: state.cart.map((item: any) =>
        item.id === id && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item,
      ),
    }));
  };

  const increaseQuantity = (id: string) => {
    useStore.setState((state: any) => ({
      cart: state.cart.map((item: any) =>
        item.id === id ? { ...item, quantity: (item.quantity ?? 1) + 1 } : item,
      ),
    }));
  };

  const removeItem = (id: string) => {
    removeFromCart(id, user, location, deviceInfo);
  };

  const subTotal = cart.reduce(
    (total: number, item: any) => total + item.quantity * item.sale_price,
    0,
  );

  return (
    <div className="w-full bg-white">
      <div className="md:w-[80%] w-[95%] mx-auto min-h-screen">
        <div className="pb-[50px]">
          <h1 className="md:pt-[50px] font-medium text-[44px] leading-[1] mb-[16px] font-Roboto">
            Shopping Cart
          </h1>
          <Link href={"/"} className="text-[#55585b] hover:underline">
            Home
          </Link>
          <span className="inline-block p-[1.5px] mx-1 bg-[#a8acb0] rounded-full"></span>
          <span className="text-[#55585b]">Cart</span>
        </div>

        {/* If cart is empty */}
        {cart.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-6 py-20">
            <div className="text-center text-gray-600 text-lg">
              Your cart is empty. Start adding your favorite products!
            </div>
            <button
              className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition-all"
              onClick={() => router.push("/")}
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <div className="lg:flex items-start gap-10">
            <table className="w-full lg:w-[70%] border-collapse">
              <thead className="bg-[#f1f3f4] rounded">
                <tr>
                  <th className="py-3 text-left pl-4">Product</th>
                  <th className="py-3 text-left">Price</th>
                  <th className="py-3 text-left">Quantity</th>
                  <th className="py-3 text-left"></th>
                </tr>
              </thead>
              <tbody>
                {cart.map((item: any) => (
                  <tr key={item.id} className="border-b border-b-[#0000000e]">
                    <td className="flex items-center gap-4 p-4">
                      <Image
                        src={item?.images[0]?.url}
                        alt={item?.title}
                        width={80}
                        height={80}
                        className="rounded"
                      />
                      <div className="flex flex-col">
                        <span className="font-medium">{item.title}</span>
                        {item?.selectedOptions && (
                          <div className="text-sm text-gray-500">
                            {item?.selectedOptions?.color && (
                              <span>
                                Color: {}
                                <span
                                  style={{
                                    backgroundColor:
                                      item?.selectedOptions?.color,
                                    width: "12px",
                                    height: "12px",
                                    borderRadius: "100%",
                                    display: "inline-block",
                                  }}
                                />
                              </span>
                            )}
                            {item?.selectedOptions?.size && (
                              <span className="ml-2">
                                Size: {item?.selectedOptions?.size}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </td>

                    <td className="text-lg">
                      {item?.id === discountedProductId ? (
                        <div className="flex flex-col items-center">
                          <span className="line-through text-gray-500 text-sm">
                            ${item.sale_price.toFixed(2)}
                          </span>
                          <span className="text-green-600 font-semibold">
                            $
                            {(
                              (item.sale_price * (100 - discountPercentage)) /
                              100
                            ).toFixed(2)}
                          </span>
                          <span className="text-xs text-green-700 bg-green-100 rounded-full">
                            Discount Applied
                          </span>
                        </div>
                      ) : (
                        <span>${item.sale_price.toFixed(2)}</span>
                      )}
                    </td>

                    <td>
                      <div className="flex justify-center items-center border border-gray-200 rounded-3xl w-24 p-[2px]">
                        <button
                          className="text-black cursor-pointer text-xl"
                          onClick={() => decreaseQuantity(item?.id)}
                        >
                          -
                        </button>
                        <span className="px-5">{item?.quantity}</span>
                        <button
                          className="text-black cursor-pointer text-xl"
                          onClick={() => increaseQuantity(item?.id)}
                        >
                          +
                        </button>
                      </div>
                    </td>

                    <td>
                      <button
                        className="flex items-center gap-2 bg-red-600 hover:bg-red-700 cursor-pointer text-white px-5 py-2 rounded-md transition-all"
                        onClick={() => removeItem(item.id)}
                      >
                        <Trash size={17} /> Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="p-6 shadow-md w-full lg:w-[30%] bg-[#f9f9f9] rounded-lg">
              {discountAmount > 0 && (
                <div className="flex justify-between items-center text-[#010f1c] text-base font-medium pb-1">
                  <span>Discount ({discountPercentage}%)</span>
                  <span className="text-green-600">
                    - ${discountAmount.toFixed(2)}
                  </span>
                </div>
              )}

              <div className="flex justify-between items-center text-[#010f1c] text-[20px] font-[550] pb-3">
                <span>Subtotal</span>
                <span>${(subTotal - discountAmount).toFixed(2)}</span>
              </div>
              <hr className="my-4 text-slate-200" />
              <div className="mb-4">
                <h4 className="mb-[7px] font-medium text-[15px]">
                  Have a coupon code?
                </h4>
                <div className="flex">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e: any) => setCouponCode(e.target.value)}
                    placeholder="Enter coupon code"
                    className="w-full border border-gray-300 rounded-l-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button className="bg-blue-600 hover:bg-blue-700 transition-all cursor-pointer text-white px-4 py-2 rounded-r-md">
                    Apply
                  </button>
                  {/* {error && (
                    <p className="text-sm pt-2 text-red-500">{error}</p>
                  )} */}
                </div>

                <hr className="my-4 text-slate-200" />

                <h4 className="mb-[7px] font-medium text-[15px]">
                  Select Shipping Address
                </h4>
                <select
                  className="w-full p-2 border border-gray-200 rounded-md focus:outline-none focus:border-blue-500"
                  value={selectedAddressId}
                  onChange={(e) => setSelectedAddressId(e.target.value)}
                >
                  option
                </select>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;
