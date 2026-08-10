import jwt from 'jsonwebtoken';

const protect = async (req, res, next) => {
  const token = req.cookies.admin_token;

  if (!token) {
    return res.status(401).json({
      status: 'error',
      message: 'Not authorized, no token provided'
    });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret_for_local_dev');

    // Add user to request
    req.user = decoded;

    return next();
  } catch (error) {
    console.error('Token verification failed:', error.message);
    return res.status(401).json({
      status: 'error',
      message: 'Not authorized, token failed'
    });
  }
};

export default protect;
