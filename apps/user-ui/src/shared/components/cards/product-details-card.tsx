import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import Ratings from "../ratings";
import { MapPin, MessageCircle, X } from "lucide-react";
import { useRouter } from "next/navigation";

const ProductDetailsCard = ({
  data,
  setOpen,
}: {
  data: any;
  setOpen: (open: boolean) => void;
}) => {
  const [activeImage, setActiveImage] = useState(0);
  const [isSelected, setIsSelected] = useState(data?.colors?.[0] || "");
  const [isSizeSelected, setIsSizeSelected] = useState(data?.sizes?.[0] || "");
  const router = useRouter();

  return (
    <div
      className="fixed flex items-center justify-center top-0 left-0 h-screen w-full bg-[#0000001d] z-50"
      onClick={() => setOpen(false)}
    >
      <div
        className="w-[90%] md:w-[70%] md:mt-14 2xl:mt-0 h-max min-h-[70vh] p-4 md:p-6 bg-white shadow-md rounded-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-full flex flex-col md:flex-row">
          <div className="w-full md:w-1/2 h-full">
            <Image
              src={data?.images?.[activeImage]?.url}
              alt="Product Image"
              width={400}
              height={400}
              className="w-full rounded-lg object-contain"
            />
            {/* Thumbnails */}
            <div className="flex gap-2 mt-4">
              {data?.images?.map((img: any, index: number) => (
                <div
                  key={index}
                  className={`cursor-pointer border rounded-md ${
                    activeImage === index
                      ? "border-gray-500 pt-1"
                      : "border-transparent"
                  }`}
                  onClick={() => setActiveImage(index)}
                >
                  <Image
                    src={img?.url}
                    alt={`Thumbnail ${index}`}
                    width={80}
                    height={80}
                    className="rounded-md"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="w-full md:w-1/2 md:pl-8 mt-6 md:mt-0">
            {/* Seller Info */}
            <div className="border-b relative pb-3 border-gray-200 flex items-center justify-between">
              <div className="flex items-start gap-3">
                <Image
                  src={data?.Shop?.avatar || "/images/empty_card.png"}
                  alt="Shop Logo"
                  width={60}
                  height={60}
                  className="rounded-full w-[60px] h-[60px] object-cover"
                />
                <div>
                  <Link
                    href={`/shop/${data?.Shop?.id}`}
                    className="text-lg font-medium"
                  >
                    {data?.Shop?.name}
                  </Link>

                  {/* Shop Ratings */}
                  <span className="block mt-1">
                    <Ratings rating={data?.Shop?.ratings} />
                  </span>

                  {/* Shop Location */}
                  <p className="text-gray-600 mt-1 flex items-center gap-2 font-medium">
                    <MapPin size={20} />
                    {data?.Shop?.address || "Location is not available!"}
                  </p>
                </div>
              </div>

              {/* Chat with Seller Button */}
              <button
                className="flex cursor-pointer items-center gap-2 px-4 py-2 rounded-lg text-white bg-blue-600 hover:bg-blue-500 transition"
                onClick={() =>
                  router.push(`/inbox?shopId=${data?.Shop?.sellerId}`)
                }
              >
                <MessageCircle size={20} />
                Chat with Seller
              </button>

              <button className="w-full absolute cursor-pointer right-[-5px] top-[-5px] flex justify-end mt-2 mt-[-10px]">
                <X size={25} onClick={() => setOpen(false)} />
              </button>
            </div>
            <h3 className="text-xl font-semibold mt-3">{data?.title}</h3>
            <p className="mt-2 text-gray-700 whitespace-pre-wrap w-full">
              {data?.short_description}
            </p>

            {/* Brand */}
            {data?.brand && (
              <p className="mt-2">
                <strong>Brand:</strong> {data.brand}
              </p>
            )}

            {/* Color & Size Selection */}
            <div className="flex flex-col md:flex-row items-start gap-5 mt-4">
              {/* Color Options */}
              {data?.colors?.length > 0 && (
                <div>
                  <strong>Color:</strong>
                  <div className="flex gap-2 mt-1">
                    {data.colors.map((color: string, index: number) => (
                      <button
                        key={index}
                        className={`w-8 h-8 cursor-pointer rounded-full border-2 transition ${
                          isSelected === color
                            ? "border-gray-400 scale-110 shadow-md"
                            : "border-transparent"
                        }`}
                        onClick={() => setIsSelected(color)}
                        style={{ backgroundColor: color }}
                      ></button>
                    ))}
                  </div>
                </div>
              )}

              {/* Size Options */}
              {data?.sizes?.length > 0 && (
                <div>
                  <strong>Size:</strong>
                  <div className="flex gap-2 mt-1">
                    {data.sizes.map((size: string, index: number) => (
                      <button
                        key={index}
                        className={`px-4 py-1 cursor-pointer rounded-md transition ${
                          isSizeSelected === size
                            ? "bg-gray-800 text-white"
                            : "bg-gray-300 text-black"
                        }`}
                        onClick={() => setIsSizeSelected(size)}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsCard;
