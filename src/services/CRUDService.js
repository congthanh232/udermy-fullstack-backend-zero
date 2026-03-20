const connection = require("../config/database");
const getAllUsers = async () => {
  let [results, fields] = await connection.query("select * from Users");
  return results;
};

 
const updateUserById = async (data) => {
  const { email, name, city, password, avatar, userId } = data;

  if (!userId) {
    throw new Error("Missing userId");
  }

  try {
    const [result] = await connection.query(
      `UPDATE users 
       SET email = $1,
           name = $2,
           city = $3,
           password = $4,
           avatar = $5
       WHERE id = $6`,
      [email, name, city, password, avatar, userId],
    );

    return result;
  } catch (error) {
    console.log("Update error:", error);
    throw error;
  }
};
const getUserById = async (userId) => {
  let [result, fields] = await connection.query(
    "select * from Users where id = $1",
    [userId],
  );
  let user = result && result.length > 0 ? result[0] : {};
  return user;
};

const deleteUserById = async (id) => {
  let [results, fields] = await connection.query(
    `DELETE FROM Users WHERE id = $1`,
    [id],
  );
};

const getUserByEmail = async (email) => {
  let [result, fields] = await connection.query(
    "select * from Users where email = $1",
    [email],
  );

  let user = result && result.length > 0 ? result[0] : null;

  return user;
};

// Thêm hàm này vào CRUDService.js
const getUserByEmailWithPrivileges = async (email) => {
  // Câu lệnh SQL này dùng JOIN để nối 4 bảng lại với nhau
  // array_agg() giúp gom tất cả tên quyền (privilege_name) thành một mảng
  // array_remove(..., NULL) để loại bỏ giá trị null nếu user chưa có quyền nào
  const query = `
    SELECT u.*, array_remove(array_agg(p.privilege_name), NULL) as privileges
    FROM users u
    LEFT JOIN user_roles ur ON u.id = ur.user_id
    LEFT JOIN role_privileges rp ON ur.role_id = rp.role_id
    LEFT JOIN privileges p ON rp.privilege_id = p.id
    WHERE u.email = $1
    GROUP BY u.id;
  `;

  try {
    let [result, fields] = await connection.query(query, [email]);
    let user = result && result.length > 0 ? result[0] : null;
    return user;
  } catch (error) {
    console.log("Lỗi khi lấy user và quyền:", error);
    throw error;
  }
};
module.exports = {
  getAllUsers,
  updateUserById,
  getUserById,
  deleteUserById,
  getUserByEmail,
  getUserByEmailWithPrivileges,
};
