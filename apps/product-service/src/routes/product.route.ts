import express, { Router } from "express";
import {
  createDiscountCode,
  createProdcut,
  deleteDiscountCode,
  deleteProductImage,
  getCategories,
  getDiscountCodes,
  getSellerProducts,
  uploadProductImage,
} from "../controllers/product.controller";
import isAuthenticated from "../../../../packages/middleware/isAuthenticated";

const router: Router = express.Router();

router.get("/get-categories", getCategories);
router.post("/create-discount-codes", isAuthenticated, createDiscountCode);
router.get("/get-discount-codes", isAuthenticated, getDiscountCodes);
router.delete("/delete-discount-code/:id", isAuthenticated, deleteDiscountCode);
router.post("/upload-product-image", isAuthenticated, uploadProductImage);
router.delete("/delete-product-image", isAuthenticated, deleteProductImage);
router.post("/create-product", isAuthenticated, createProdcut);
router.get("/get-shop-products", isAuthenticated, getSellerProducts);
export default router;
