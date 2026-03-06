const connection = require("../config/database");
const getAllUsers = async () => {
  let [results, fields] = await connection.query("select * from Users");
  return results;
};

const updateUserById = async (email, city, name, userId) => {
  let [results, fields] = await connection.query(
    `UPDATE Users 
SET email = ?, city= ?, name = ?
WHERE id = ?;`,
    [email, city, name, userId],
  );
};

const getUserById = async (userId) => {
  let [result, fields] = await connection.query(
    "select * from Users where id = ?",
    [userId],
  );
  let user = result && result.length > 0 ? result[0] : {};
  return user;
};

const deleteUserById = async (id) => {
  let [results, fields] = await connection.query(
    `DELETE FROM Users WHERE id = ?`,
    [id],
  );
};
module.exports = { getAllUsers, updateUserById, getUserById, deleteUserById };
