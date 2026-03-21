// File: src/services/RoleService.js
const connection = require("../config/database");

// 1. Lấy danh sách tất cả các Role
const getAllRoles = async () => {
  let [results, fields] = await connection.query("SELECT * FROM roles ORDER BY id ASC");
  return results;
};

// 2. Lấy danh sách tất cả các Quyền (Privileges) hệ thống đang có
const getAllPrivileges = async () => {
  let [results, fields] = await connection.query("SELECT * FROM privileges ORDER BY id ASC");
  return results;
};

// 3. Lấy danh sách quyền của một Role cụ thể (để mồi dữ liệu lên UI tick checkbox)
const getPrivilegesByRoleId = async (roleId) => {
  let [results, fields] = await connection.query(
    `SELECT p.id, p.privilege_name, p.description 
     FROM privileges p
     JOIN role_privileges rp ON p.id = rp.privilege_id
     WHERE rp.role_id = $1`,
    [roleId]
  );
  return results;
};

// 4. Lấy danh sách Role của một User
const getRolesByUserId = async (userId) => {
    let [results, fields] = await connection.query(
      `SELECT r.id, r.role_name 
       FROM roles r
       JOIN user_roles ur ON r.id = ur.role_id
       WHERE ur.user_id = $1`,
      [userId]
    );
    return results;
};

// Thêm Role mới vào database
const createRole = async (roleName, description) => {
  let [result] = await connection.query(
    "INSERT INTO roles (role_name, description) VALUES ($1, $2)",
    [roleName, description]
  );
  return result;
};

// Cập nhật lại danh sách quyền của một Role
const updateRolePrivileges = async (roleId, privilegeIds) => {
  try {
    // 1. Xóa sạch các quyền cũ của Role này
    await connection.query("DELETE FROM role_privileges WHERE role_id = $1", [roleId]);

    // 2. Thêm lại các quyền mới (nếu có tick chọn trên giao diện)
    if (privilegeIds && privilegeIds.length > 0) {
      for (let privId of privilegeIds) {
        await connection.query(
          "INSERT INTO role_privileges (role_id, privilege_id) VALUES ($1, $2)",
          [roleId, privId]
        );
      }
    }
  } catch (error) {
    console.log("Lỗi khi update quyền:", error);
    throw error;
  }
};

// Cấp 1 Role cho 1 User (Giả định mỗi user chỉ có 1 Role để dễ quản lý)
const assignRoleToUser = async (userId, roleId) => {
  try {
    // 1. Xóa role cũ của user này đi (nếu có)
    await connection.query("DELETE FROM user_roles WHERE user_id = $1", [userId]);
    
    // 2. Thêm role mới
    if (roleId) {
      await connection.query(
        "INSERT INTO user_roles (user_id, role_id) VALUES ($1, $2)",
        [userId, roleId]
      );
    }
  } catch (error) {
    console.log("Lỗi gán role cho user:", error);
    throw error;
  }
};

// Hàm xóa Role khỏi Database
const deleteRoleById = async (roleId) => {
  try {
    // 1. Phải xóa sạch các quyền đang được gán cho Role này trước (để tránh lỗi khóa ngoại)
    await connection.query("DELETE FROM role_privileges WHERE role_id = $1", [roleId]);
    
    // 2. Chém bay luôn Role đó
    let [result] = await connection.query("DELETE FROM roles WHERE id = $1", [roleId]);
    return result;
  } catch (error) {
    console.log("Lỗi xóa role:", error);
    throw error;
  }
};

module.exports = {
  getAllRoles,
  getAllPrivileges,
  getPrivilegesByRoleId,
  getRolesByUserId,
  createRole,          
  updateRolePrivileges,
  assignRoleToUser,
  deleteRoleById
};