import { NextFunction, Request, Response } from "express";
import { prisma } from "../../../../packages/libs/prisma";
import {
  AuthError,
  NotFoundError,
  ValidationError,
} from "../../../../packages/error-handler";
import { imagekit } from "../../../../packages/libs/imagekit";

// Get product categrories
export const getCategories = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const config = await prisma.site_config.findFirst();

    if (!config) {
      return res.status(404).json({ message: "Categories not found!" });
    }

    return res.status(200).json({
      categories: config.categories,
      subCategories: config.subCategories,
    });
  } catch (error) {
    return next(error);
  }
};

// Create discount code
export const createDiscountCode = async (
  req: any,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { public_name, discountType, discountValue, discountCode } = req.body; // Come from prisma schema (same as database)

    const isDiscountCodeExist = await prisma.discount_codes.findUnique({
      where: {
        discountCode,
      },
    });

    if (isDiscountCodeExist) {
      return next(
        new ValidationError(
          "Discount code already exists! Please choose a different code.",
        ),
      );
    }

    const discount_code = await prisma.discount_codes.create({
      data: {
        public_name,
        discountType,
        discountValue: parseFloat(discountValue),
        discountCode,
        sellerId: req.seller.id,
      },
    });

    res.status(201).json({
      success: true,
      discount_code,
    });
  } catch (error) {
    next(error);
  }
};

// Get discount codes
export const getDiscountCodes = async (
  req: any,
  res: Response,
  next: NextFunction,
) => {
  try {
    const discount_codes = await prisma.discount_codes.findMany({
      // Give me all discount codes that belong to this seller.
      where: {
        sellerId: req.seller.id,
      },
    });

    res.status(201).json({
      success: true,
      discount_codes,
    });
  } catch (error) {
    return next(error);
  }
};

// Delete discount code
export const deleteDiscountCode = async (
  req: any,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const sellerId = req.seller?.id;

    const discountCode = await prisma.discount_codes.findUnique({
      where: { id },
      select: { id: true, sellerId: true },
    });

    if (!discountCode) {
      return next(new NotFoundError("Discount code not found!"));
    }
    if (discountCode.sellerId !== sellerId) {
      return next(
        new ValidationError(
          "You are not authorized to delete this discount code!",
        ),
      );
    }

    await prisma.discount_codes.delete({
      where: { id },
    });

    return res.status(200).json({
      success: true,
      message: "Discount code deleted successfully!",
    });
  } catch (error) {
    next(error);
  }
};

// Upload product images
export const uploadProductImage = async (
  req: any,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { fileName } = req.body;

    // fileName is a base64 string, we need to extract the base64 data from it.
    const base64Data = fileName.split(",")[1];

    const response = await imagekit.upload({
      file: base64Data,
      fileName: `product-${Date.now()}.jpg`,
      folder: "/products",
    });

    res.status(201).json({
      file_url: response.url,
      fileId: response.fileId,
    });
  } catch (error) {
    next(error);
  }
};

// Delete product image
export const deleteProductImage = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { fileId } = req.body;
    const response = await imagekit.deleteFile(fileId);
    res.status(201).json({
      success: true,
      response,
    });
  } catch (error) {
    next(error);
  }
};

export const createProdcut = async (
  req: any,
  res: Response,
  next: NextFunction,
) => {
  try {
    const {
      title,
      short_description,
      detailed_description,
      warranty,
      custom_specifications,
      slug,
      tags,
      cash_on_delivery,
      brand,
      video_url,
      category,
      colors = [],
      sizes = [],
      discountCodes = [],
      stock,
      sale_price,
      regular_price,
      subCategory,
      customProperties = {},
      images = [],
    } = req.body;

    const slugSource = slug || title;
    const normalizedSlug = slugSource
      ?.trim()
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");

    const productImages = images.filter(
      (img: any) => img && img.fileId && img.file_url,
    );

    if (
      !title ||
      !short_description ||
      !category ||
      !subCategory ||
      !sale_price ||
      !images ||
      !tags ||
      !regular_price ||
      !stock ||
      !normalizedSlug ||
      productImages.length === 0
    )
      return next(new ValidationError("Missing required fields!"));

    if (!req.seller?.id)
      return next(
        new AuthError("Only authenticated sellers can create products!"),
      );

    if (!req.seller?.shop?.id) {
      return next(
        new ValidationError(
          "You need to create a shop before adding products.",
        ),
      );
    }

    const slugChecking = await prisma.products.findUnique({
      where: {
        slug: normalizedSlug,
      },
    });

    if (slugChecking) {
      return next(
        new ValidationError(
          "Slug already exists! Please choose a different slug.",
        ),
      );
    }

    const newProduct = await prisma.products.create({
      data: {
        title,
        short_description,
        detailed_description,
        warranty,
        cashOnDelivery: cash_on_delivery,
        slug: normalizedSlug,
        shopId: req.seller.shop.id,
        tags: Array.isArray(tags) ? tags : tags.split(","),
        brand,
        video_url,
        category,
        subCategory,
        colors: colors || [],
        discount_codes: Array.isArray(discountCodes)
          ? discountCodes.map((codeId: string) => codeId)
          : [],
        sizes: sizes || [],
        stock: parseInt(stock),
        sale_price: parseFloat(sale_price),
        regular_price: parseFloat(regular_price),
        custom_specifications: custom_specifications || {},
        custom_properties: customProperties || {},
        images: {
          create: productImages.map((image: any) => ({
            file_id: image.fileId,
            url: image.file_url,
          })),
        },
      },
      include: { images: true },
    });

    res.status(201).json({
      success: true,
      newProduct,
    });
  } catch (error) {
    next(error);
  }
};

// Get logged in seller's products
export const getSellerProducts = async (
  req: any,
  res: Response,
  next: NextFunction,
) => {
  try {
    const products = await prisma.products.findMany({
      where: {
        shopId: req?.seller?.shop?.id,
      },
      include: {
        images: true,
      },
    });

    res.status(201).json({
      success: true,
      products,
    });
  } catch (error) {
    next(error);
  }
};
