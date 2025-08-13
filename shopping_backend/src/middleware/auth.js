const { verifyJwt } = require('../utils/jwt');

// PUBLIC_INTERFACE
function authMiddleware(req, res, next) {
  /** Express middleware that verifies a JWT from the Authorization header (Bearer token). */
  const header = req.headers.authorization || '';
  const [scheme, token] = header.split(' ');

  if (scheme !== 'Bearer' || !token) {
    return res.status(401).json({ error: 'Unauthorized: missing or invalid Authorization header' });
  }

  try {
    const payload = verifyJwt(token);
    req.user = payload;
    return next();
  } catch (err) {
    return res.status(401).json({ error: 'Unauthorized: invalid token' });
  }
}

module.exports = {
  authMiddleware,
};
