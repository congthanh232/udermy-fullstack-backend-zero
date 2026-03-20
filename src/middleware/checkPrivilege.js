// File: src/middleware/checkPrivilege.js

const checkPrivilege = (requiredPrivilege) => {
  return (req, res, next) => {
    // 1. Kiểm tra xem user đã đăng nhập chưa (có session không)
    if (!req.session || !req.session.user) {
      return res.redirect("/login");
    }

    // 2. Lấy danh sách quyền của user từ session (nếu mảng rỗng thì gán mặc định là mảng trống)
    const userPrivileges = req.session.user.privileges || [];

    // 3. Kiểm tra xem user có cái quyền (requiredPrivilege) đang yêu cầu không
    if (userPrivileges.includes(requiredPrivilege)) {
      next(); // Có chìa khóa -> Cho đi tiếp vào Controller
    } else {
      // Không có chìa khóa -> Báo lỗi 403 (Cấm truy cập)
      return res.status(403).send("Access Denied: Bạn không đủ quyền để truy cập trang hoặc thực hiện hành động này!");
    }
  };
};

module.exports = checkPrivilege;