const connection = require("../config/database");
const supabase = require("../config/supabase");
const { sendWelcomeEmail } = require("../services/emailService");
const {
  getAllUsers,
  updateUserById,
  getUserById,
  deleteUserById,
} = require("../services/CRUDService");
const RoleService = require("../services/RoleService");

const getHomepage = async (req, res) => {

  // 2. Đã đăng nhập thì lấy thông tin và danh sách
  let user = req.session.user;
  let results = await getAllUsers();

  // 3. Luôn luôn render trang home (Giao diện EJS sẽ tự lo phần ẩn/hiện nút)
  return res.render("home.ejs", {
    listUsers: results,
    user: user,
  });
};



const getCreatePage = async (req, res) => {
  // Lấy danh sách Role từ DB để truyền sang giao diện
  let listRoles = await RoleService.getAllRoles();

  res.render("create.ejs", { listRoles: listRoles });
};
const postCreateUser = async (req, res) => {
  if (!req.session.user) {
    return res.redirect("/");
  }

  let email = req.body.email;
  let name = req.body.myname;
  let city = req.body.city;
  let password = req.body.password;
  let sendEmailFlag = req.body.sendEmail;
  let role_id = req.body.role_id;

  let avatarUrl = null;

  if (req.file) {
    const fileName = Date.now() + "-" + req.file.originalname;

    const { data, error } = await supabase.storage
      .from("avatars")
      .upload(fileName, req.file.buffer, {
        contentType: req.file.mimetype,
      });

    if (error) {
      console.log("UPLOAD ERROR:", error);
    } else {
      const { data: publicUrlData } = supabase.storage
        .from("avatars")
        .getPublicUrl(fileName);

      avatarUrl = publicUrlData.publicUrl;

    }
  }

  let [result, fields] = await connection.query(
    `INSERT INTO Users (email, name, city, password, avatar) 
     VALUES ($1, $2, $3, $4, $5) RETURNING id`,
    [email, name, city, password, avatarUrl],
  );
  // Lấy ra ID của User vừa được tạo trong database
  const newUserId = result[0].id;
  // SỬA Ở ĐÂY: Gọi hàm gán Role cho User mới
  if (role_id && role_id !== "") {
    await RoleService.assignRoleToUser(newUserId, role_id);
  }
  if (sendEmailFlag) {
    await sendWelcomeEmail(email, name);
  }

  res.redirect("/");
};

const getUpdatePage = async (req, res) => {
  const userId = req.params.id;
  
  // 1. Lấy thông tin cơ bản của User
  let user = await getUserById(userId);

  // 2. Lấy danh sách tất cả các Role để đổ vào thẻ <select>
  let listRoles = await RoleService.getAllRoles();

  // 3. Lấy Role hiện tại của User này (để tick sẵn selected)
  let currentRoles = await RoleService.getRolesByUserId(userId);
  let currentUserRoleId = currentRoles.length > 0 ? currentRoles[0].id : null;

  res.render("update.ejs", { 
    userEdit: user,
    listRoles: listRoles,              // <--- Truyền thêm 2 biến này sang EJS
    currentUserRoleId: currentUserRoleId 
  });
};


const postUpdateUser = async (req, res) => {
  try {
    let { email, myname, city, password, role_id, userId } = req.body;

    // lấy user cũ để giữ avatar nếu không upload mới
    let currentUser = await getUserById(userId);
    let avatarUrl = currentUser.avatar;

    // nếu có upload ảnh mới
    if (req.file) {
      const fileName = Date.now() + "-" + req.file.originalname;

      const { error } = await supabase.storage
        .from("avatars")
        .upload(fileName, req.file.buffer, {
          contentType: req.file.mimetype,
        });

      if (error) {
        console.log("UPLOAD ERROR:", error);
      } else {
        const { data: publicUrlData } = supabase.storage
          .from("avatars")
          .getPublicUrl(fileName);

        avatarUrl = publicUrlData.publicUrl;
      }
    }

    // update database
    await updateUserById({
      email: email,
      name: myname,
      city: city,
      password: password,
      avatar: avatarUrl,
      userId: userId,
    });

    // Gọi hàm gán Role mới cho User
    await RoleService.assignRoleToUser(userId, role_id);

    res.redirect("/");
  } catch (err) {
    console.log(err);
    res.send("Update failed");
  }
};

const postDeleteUser = async (req, res) => {
  let userId = req.params.id;
  let user = await getUserById(userId);
  res.render("delete.ejs", { userEdit: user });
};

const postHandleRemoveUser = async (req, res) => {
  const id = req.body.userId;
  await deleteUserById(id);
  res.redirect("/");
};

module.exports = {
  getHomepage,
  postCreateUser,
  getCreatePage,
  getUpdatePage,
  postUpdateUser,
  postDeleteUser,
  postHandleRemoveUser,
};
