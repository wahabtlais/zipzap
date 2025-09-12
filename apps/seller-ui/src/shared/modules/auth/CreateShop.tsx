import shopCategories from "@/utils/Categories";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import React from "react";
import { useForm } from "react-hook-form";

const CreateShop = ({
  sellerId,
  setActiveStep,
}: {
  sellerId: string;
  setActiveStep: (step: number) => void;
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const shopCreateMutation = useMutation({
    mutationFn: async (data: FormData) => {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URI}/api/create-shop`,
        data
      );
      return response.data;
    },
    onSuccess: () => {
      setActiveStep(2);
    },
  });

  const onSubmit = async (data: any) => {
    const shopData = { ...data, sellerId };
    shopCreateMutation.mutate(shopData);
  };

  const countWords = (text: string) => text.trim().split(/\s+/).length;
  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <h3 className="text-2xl font-semibold text-center mb-2">
          Setup Your Shop
        </h3>

        <label className="block text-gray-700 mb-1">Shop Name *</label>
        <input
          type="text"
          placeholder="Enter your shop name"
          className="border border-gray-300 p-2 rounded-md w-full mb-4 outline-[#4285F4]"
          {...register("name", {
            required: "Shop name is required",
          })}
        />
        {errors.name && (
          <p className="text-red-500 text-sm">{String(errors.name.message)}</p>
        )}

        <label className="block text-gray-700 mb-1">
          Bio * <span className="text-gray-400 text-sm">(max 100 words)</span>
        </label>
        <textarea
          placeholder="Tell us about your shop"
          className="border border-gray-300 p-2 rounded-md w-full mb-4 outline-[#4285F4] resize-none"
          {...register("bio", {
            required: "Bio is required",
            validate: (value) =>
              countWords(value) <= 100 || "Bio cannot exceed 100 words",
          })}
        />
        {errors.bio && (
          <p className="text-red-500 text-sm">{String(errors.bio.message)}</p>
        )}

        <label className="block text-gray-700 mb-1">Shop Address *</label>
        <input
          type="text"
          placeholder="Enter your shop address"
          className="border border-gray-300 p-2 rounded-md w-full mb-4 outline-[#4285F4]"
          {...register("address", {
            required: "Shop address is required",
          })}
        />
        {errors.address && (
          <p className="text-red-500 text-sm">
            {String(errors.address.message)}
          </p>
        )}

        <label className="block text-gray-700 mb-1">Opening Hours *</label>
        <input
          type="text"
          placeholder="Ex: Mon-Fri 9am-5pm"
          className="border border-gray-300 p-2 rounded-md w-full mb-4 outline-[#4285F4]"
          {...register("opening_hours", {
            required: "Opening hours are required",
          })}
        />
        {errors.opening_hours && (
          <p className="text-red-500 text-sm">
            {String(errors.opening_hours.message)}
          </p>
        )}

        <label className="block text-gray-700 mb-1">Website</label>
        <input
          type="url"
          placeholder="https://www.example.com"
          className="border border-gray-300 p-2 rounded-md w-full mb-4 outline-[#4285F4]"
          {...register("website", {
            pattern: {
              value: /^(https?:\/\/)?([\w\d-]+\.)+\w{2,}(\/.*)?$/,
              message: "Invalid URL format",
            },
          })}
        />
        {errors.website && (
          <p className="text-red-500 text-sm">
            {String(errors.website.message)}
          </p>
        )}

        <label className="block text-gray-700 mb-1">Category *</label>
        <select
          className="border border-gray-300 p-2 rounded-md w-full mb-4 outline-[#4285F4] text-gray-900"
          {...register("category", {
            required: "Category is required",
          })}
          defaultValue=""
        >
          <option value="" disabled className="text-gray-400">
            Select your category
          </option>
          {shopCategories.map((category) => (
            <option
              key={category.value}
              value={category.value}
              className="text-gray-900"
            >
              {category.label}
            </option>
          ))}
        </select>
        {errors.category && (
          <p className="text-red-500 text-sm">
            {String(errors.category.message)}
          </p>
        )}

        <button
          type="submit"
          disabled={shopCreateMutation.isPending}
          className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition-all mt-4 disabled:bg-blue-400"
        >
          {shopCreateMutation.isPending ? "Creating Shop..." : "Create Shop"}
        </button>
        {shopCreateMutation.isError &&
          shopCreateMutation.error instanceof AxiosError && (
            <p className="text-red-500 text-sm">
              {shopCreateMutation.error.response?.data?.message ||
                shopCreateMutation.error.message}
            </p>
          )}
      </form>
    </div>
  );
};

export default CreateShop;
