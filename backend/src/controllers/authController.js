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

    // Set token in HttpOnly cookie
    res.cookie('admin_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
      path: '/'
    });

    return res.status(200).json({
      status: 'success',
      message: 'Logged in successfully'
    });
  }

  return res.status(401).json({
    status: 'error',
    message: 'Invalid username or password'
  });
};

export const logoutAdmin = async (req, res) => {
  res.cookie('admin_token', '', {
    httpOnly: true,
    expires: new Date(0),
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    path: '/'
  });

  return res.status(200).json({
    status: 'success',
    message: 'Logged out successfully'
  });
};
