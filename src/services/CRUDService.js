const connection = require("../config/database");
const getAllUsers = async () => {
  let [results, fields] = await connection.query("select * from Users");
  return results;
};

// const updateUserById = async (email, city, name, userId) => {
//   let [results, fields] = await connection.query(
//     `UPDATE Users
// SET email = $1, city= $2, name = $3
// WHERE id = $4;`,
//     [email, city, name, userId],
//   );
// };
const updateUserById = async (data) => {
  const { email, name, city, password, role, avatar, userId } = data;

  if (!userId) {
    throw new Error("Missing userId");
  }

  try {
    const [result] = await connection.query(
      `UPDATE Users 
       SET email = $1,
           name = $2,
           city = $3,
           password = $4,
           role = $5,
           avatar = $6
       WHERE id = $7`,
      [email, name, city, password, role, avatar, userId],
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
module.exports = {
  getAllUsers,
  updateUserById,
  getUserById,
  deleteUserById,
  getUserByEmail,
};
