const connection = require("../config/database");
const getAllUsers = async () => {
  let [results, fields] = await connection.query("select * from Users");
  return results;
};

const updateUserById = async (email, city, name, userId) => {
  let [results, fields] = await connection.query(
    `UPDATE Users 
SET email = $1, city= $2, name = $3
WHERE id = $4;`,
    [email, city, name, userId],
  );
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
module.exports = { getAllUsers, updateUserById, getUserById, deleteUserById };
