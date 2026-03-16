const express = require("express");
const {
  getHomepage,
  getABC,
  getHoiDanIT,
  postCreateUser,
  getCreatePage,
  getUpdatePage,
  postUpdateUser,
  postDeleteUser,
  postHandleRemoveUser,
} = require("../controllers/homeController");
const upload = require("../middleware/upload");

const authController = require("../controllers/authController");

const router = express.Router();

// router.method('/', handler)

router.get("/", getHomepage);

router.get("/abc", getABC);

// router.get("/hoidanit", getHoiDanIT);

router.get("/create", getCreatePage);
router.get("/update/:id", getUpdatePage);

router.post("/create-user", upload.single("avatar"), postCreateUser);

router.post("/update-user", postUpdateUser);

router.post("/delete-user/:id", postDeleteUser);
router.post("/delete-user", postHandleRemoveUser);

router.get("/login", authController.getLoginPage);
router.post("/login", authController.handleLogin);
router.get("/logout", authController.logout);

module.exports = router;
