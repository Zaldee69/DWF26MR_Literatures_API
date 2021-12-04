const express = require("express");
const router = express.Router();

const { addCollection, getCollection } = require("../controllers/collection");

const { register, login, checkAuth } = require("../controllers/auth");
const {
  addLiteratures,
  getLiteratures,
  getDetailLiteratures,
  deleteLiteratures,
  getSearchLiteratures,
  getLiteraturesByUserID,
  literaturesVerifying,
  editLiterature,
} = require("../controllers/literature");
const { editUser } = require("../controllers/user");

//middlewares
const { uploadFile } = require("../middelwares/uploadFile");
const { uploadPdf } = require("../middelwares/uploadPdf");
const { auth } = require("../middelwares/auth");

router.post("/register", register);
router.post("/login", login);
router.get("/check-auth", auth, checkAuth);

//
router.post("/literatures", uploadPdf("image"), auth, addLiteratures);
router.get("/literatures", getLiteratures);
router.get("/literatures/user", auth, getLiteraturesByUserID);
router.get("/literatures/:search", auth, getSearchLiteratures);
router.get("/literatures/detail/:id", auth, getDetailLiteratures);
router.delete("/literatures/:id", auth, deleteLiteratures);
router.patch("/literatures/:id", auth, literaturesVerifying);
router.patch("/literature/:id", auth, uploadPdf("image"), editLiterature);

//
router.patch("/users", uploadFile("image"), auth, editUser);

//
router.post("/collections", auth, addCollection);
router.get("/collections", auth, getCollection);

module.exports = router;
