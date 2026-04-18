import express, { Router } from "express";
import {
  createDiscountCode,
  deleteDiscountCode,
  deleteProductImage,
  getCategories,
  getDiscountCodes,
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
export default router;
