import express, { Router } from "express";
import {
  createDiscountCode,
  createProdcut,
  deleteDiscountCode,
  deleteProduct,
  deleteProductImage,
  getCategories,
  getDiscountCodes,
  getSellerProducts,
  restoreProduct,
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
router.delete("/delete-product/:productId", isAuthenticated, deleteProduct);
router.put("/restore-product/:productId", isAuthenticated, restoreProduct);
export default router;
