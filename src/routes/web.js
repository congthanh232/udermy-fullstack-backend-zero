const express = require("express");
const {
  getHomepage,
  postCreateUser,
  getCreatePage,
  getUpdatePage,
  postUpdateUser,
  postDeleteUser,
  postHandleRemoveUser,
} = require("../controllers/homeController");
const upload = require("../middleware/upload");
const authController = require("../controllers/authController");
const roleController = require("../controllers/roleController");
// Kéo "ông bảo vệ" vào
const checkPrivilege = require("../middleware/checkPrivilege");

const router = express.Router();

// Trang chủ: Giả sử ai đăng nhập rồi mới được xem danh sách user
// Quyền yêu cầu: 'VIEW_USER'
router.get("/", checkPrivilege('VIEW_USER'), getHomepage);

// Các tính năng Thêm User (Quyền yêu cầu: 'ADD_USER')
router.get("/create", checkPrivilege('ADD_USER'), getCreatePage);
router.post("/create-user", checkPrivilege('ADD_USER'), upload.single("avatar"), postCreateUser);

// Các tính năng Sửa User (Quyền yêu cầu: 'UPDATE_USER')
router.get("/update/:id", checkPrivilege('UPDATE_USER'), getUpdatePage);
router.post("/update-user", checkPrivilege('UPDATE_USER'), upload.single("avatar"), postUpdateUser);

// Các tính năng Xóa User (Quyền yêu cầu: 'DELETE_USER')
router.post("/delete-user/:id", checkPrivilege('DELETE_USER'), postDeleteUser);
router.post("/delete-user", checkPrivilege('DELETE_USER'), postHandleRemoveUser);

// Routes cho Login/Logout (Không cần bảo vệ, ai cũng vào được)
router.get("/login", authController.getLoginPage);
router.post("/login", authController.handleLogin);
router.get("/logout", authController.logout);

// Màn hình danh sách & tạo Role
router.get("/roles",checkPrivilege('DELETE_USER'), roleController.getRolePage);
router.post("/roles/create",checkPrivilege('DELETE_USER'), roleController.postCreateRole);
router.post("/roles/delete/:id", checkPrivilege('DELETE_USER'), roleController.postDeleteRole);

// Màn hình gán quyền (Assign Privilege)
router.get("/roles/assign/:id",checkPrivilege('DELETE_USER'), roleController.getAssignPrivilegePage);
router.post("/roles/assign/:id",checkPrivilege('DELETE_USER'), roleController.postAssignPrivilege);

module.exports = router;