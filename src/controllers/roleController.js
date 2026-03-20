// File: src/controllers/roleController.js
const RoleService = require("../services/RoleService");

// 1. Hiển thị trang danh sách Role
const getRolePage = async (req, res) => {
  const roles = await RoleService.getAllRoles();
  res.render("roles.ejs", { listRoles: roles });
};

// 2. Xử lý form tạo Role mới
const postCreateRole = async (req, res) => {
  const { role_name, description } = req.body;
  try {
    await RoleService.createRole(role_name, description);
    res.redirect("/roles"); // Tạo xong thì quay lại trang danh sách
  } catch (error) {
    console.log(error);
    res.send("Lỗi tạo Role! Có thể tên Role đã tồn tại.");
  }
};

// 3. Hiển thị trang cấu hình quyền cho 1 Role
const getAssignPrivilegePage = async (req, res) => {
  const roleId = req.params.id;
  
  // Lấy tất cả quyền đang có trong hệ thống
  const allPrivileges = await RoleService.getAllPrivileges();
  
  // Lấy các quyền mà Role này đang sở hữu
  const rolePrivileges = await RoleService.getPrivilegesByRoleId(roleId);
  
  // Biến mảng object thành mảng ID để giao diện dễ tick checkbox (VD: [1, 2, 4])
  const rolePrivilegeIds = rolePrivileges.map(p => p.id);

  res.render("assign-privilege.ejs", { 
    roleId: roleId, 
    allPrivileges: allPrivileges, 
    rolePrivilegeIds: rolePrivilegeIds 
  });
};

// 4. Xử lý form lưu quyền
const postAssignPrivilege = async (req, res) => {
  const roleId = req.params.id;
  let { privileges } = req.body; // privileges sẽ chứa các ID quyền được tick

  // Chuẩn hóa dữ liệu (Nếu tick 1 ô thì nó là chuỗi, nhiều ô thì là mảng)
  if (!privileges) privileges = [];
  if (typeof privileges === 'string') privileges = [privileges];

  await RoleService.updateRolePrivileges(roleId, privileges);
  res.redirect("/roles");
};

module.exports = {
  getRolePage,
  postCreateRole,
  getAssignPrivilegePage,
  postAssignPrivilege
};