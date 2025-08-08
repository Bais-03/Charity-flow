// controllers/authController.js

export const adminLogin = async (req, res) => {
  const { email, password } = req.body;

  // 🔐 Hardcoded admin credentials (only for development/testing)
  const hardcodedAdmin = {
    email: "admin@example.com",
    password: "admin123", // Plaintext password
  };

  // Check credentials
  if (email === hardcodedAdmin.email && password === hardcodedAdmin.password) {
    // Optional: return fake token
    const token = "hardcoded-admin-token";

    return res.json({
      message: "Login successful",
      admin: {
        email,
        isAdmin: true,
      },
      token,
    });
  } else {
    return res.status(401).json({ message: "Invalid email or password" });
  }
};
