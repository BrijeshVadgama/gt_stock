import express from "express";
import {
  getAllOrderTotalCount,
  getDataList,
  getDetails,
  getOrderDescriptionByID,
  getOrderDetails,
  getOrderDetailsByID,
  getTotalOrderCount_By_OrderID,
  getTotalStockCount,
  seNameDetails,
  stockDetails,
  stockDetailsWithBatchAndManufacturing,
  getOrderDetailsByGencode_Btcode_Shcode_MsCode,
  getOrderDetailsByGencode_pfname,
  getOrderDetailsByGencode_pfnameList,
  filterStockDetails,
  getOrderFilterDetails,
  PlaceOrder,
  AddToCart,
  UpdateCart,
  scanQr,
  GetCart,
  DeleteCart,
  getGrName,
} from "../controllers/admin.js";
import authenticateJWT from "../controllers/authorization.js";
const router = express.Router();

router.get("/data/list/v1", authenticateJWT, getDataList);
router.get("/details/v1", authenticateJWT, getDetails); // use less
router.get("/stock/details/filter/v1", authenticateJWT, filterStockDetails);
router.get("/stock/details/:gencode/v1", authenticateJWT, stockDetails);
router.get(
  "/stock/details/batch/manufacturing/:gencode/:shname/v1",
  authenticateJWT,
  stockDetailsWithBatchAndManufacturing
);

// Oder Cart and order
router.post("/order", authenticateJWT, PlaceOrder);

// router.post('/order/cart',authenticateJWT,AddToCart);
router.post("/order/cart", AddToCart);
router.put("/order/update/cart", authenticateJWT, UpdateCart);
router.put("/order/delete/cart", authenticateJWT, DeleteCart);
router.get("/order/cart/:user_id", authenticateJWT, GetCart);

router.get("/scan/qr/:id", authenticateJWT, scanQr);
router.get("/gr", authenticateJWT, getGrName);

router.get("/order/details/filter/v1", authenticateJWT, getOrderFilterDetails);
router.get("/order/details/v1", authenticateJWT, getOrderDetails);
router.get(
  "/order/details/totalcount/v1",
  authenticateJWT,
  getAllOrderTotalCount
);
router.get("/order/details/totalstock/v1", authenticateJWT, getTotalStockCount);
router.get("/order/details/:ordNo/v1", authenticateJWT, getOrderDetailsByID);
router.get(
  "/order/details/totalorder/:ordNo/v1",
  authenticateJWT,
  getTotalOrderCount_By_OrderID
);
router.get(
  "/order/details/description/:ordNo/v1",
  authenticateJWT,
  getOrderDescriptionByID
);
router.get("/data/details/sename/v1", authenticateJWT, seNameDetails);
router.get(
  "/order/details/:gencode/:btcode/:shcode/:mscode/v1",
  authenticateJWT,
  getOrderDetailsByGencode_Btcode_Shcode_MsCode
);
router.get(
  "/order/details/:gencode/:pfname/v1",
  authenticateJWT,
  getOrderDetailsByGencode_pfname
);
router.get(
  "/order/details/list/:gencode/:pfname/v1",
  authenticateJWT,
  getOrderDetailsByGencode_pfnameList
);
// router.get('/data/list/v2', getDataListV2); // old one
// router.get('/stock/list/data/v1', stockListData);
// router.get('/product/list/description/:gencode/:shcode/v1', productDescriptionData);

export default router;
