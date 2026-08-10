import jwt from 'jsonwebtoken';

export const loginAdmin = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({
      status: 'error',
      message: 'Please provide both username and password'
    });
  }

  // Get credentials from environment variables, fallback for local dev
  const adminUser = process.env.ADMIN_USERNAME || 'admin';
  const adminPass = process.env.ADMIN_PASSWORD || 'admin123';

  if (username === adminUser && password === adminPass) {
    // Generate JWT token
    const token = jwt.sign(
      { username },
      process.env.JWT_SECRET || 'fallback_secret_for_local_dev',
      { expiresIn: '24h' }
    );

    return res.status(200).json({
      status: 'success',
      token,
      message: 'Logged in successfully'
    });
  }

  return res.status(401).json({
    status: 'error',
    message: 'Invalid username or password'
  });
};
