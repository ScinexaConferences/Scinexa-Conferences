import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { config } from "./config.js";
import { AccessDeniedError, AuthenticationError } from "./errors.js";

function expiresInSeconds(milliseconds) {
  return Math.max(1, Math.floor(milliseconds / 1000));
}

export async function hashPassword(password) {
  return bcrypt.hash(password, 10);
}

export async function comparePassword(password, hashedPassword) {
  return bcrypt.compare(password, hashedPassword);
}

export function generateAccessToken(user) {
  return jwt.sign(
    { roles: user.roles },
    config.jwtSecret,
    {
      subject: user.email,
      expiresIn: expiresInSeconds(config.jwtAccessTokenExpirationMs)
    }
  );
}

export function generateRefreshToken(user) {
  return jwt.sign(
    { type: "refresh" },
    config.jwtSecret,
    {
      subject: user.email,
      expiresIn: expiresInSeconds(config.jwtRefreshTokenExpirationMs)
    }
  );
}

export function buildAuthResponse(user) {
  return {
    accessToken: generateAccessToken(user),
    refreshToken: generateRefreshToken(user),
    email: user.email,
    fullName: user.fullName,
    roles: [...new Set(user.roles ?? ["ATTENDEE"])]
  };
}

export function authenticateRequest(req, _res, next) {
  const authorizationHeader = req.headers.authorization ?? "";

  if (!authorizationHeader.startsWith("Bearer ")) {
    next();
    return;
  }

  const token = authorizationHeader.slice("Bearer ".length).trim();

  try {
    const payload = jwt.verify(token, config.jwtSecret);
    req.user = {
      email: payload.sub,
      roles: Array.isArray(payload.roles) ? payload.roles : []
    };
    next();
  } catch (_error) {
    next(new AuthenticationError("Invalid or expired token"));
  }
}

export function requireAuth(req, _res, next) {
  if (!req.user?.email) {
    next(new AuthenticationError("Authenticated user is required for this operation"));
    return;
  }

  next();
}

export function requireRoles(roles) {
  return function roleGuard(req, _res, next) {
    if (!req.user?.email) {
      next(new AuthenticationError("Authenticated user is required for this operation"));
      return;
    }

    const userRoles = new Set(req.user.roles ?? []);
    const allowed = roles.some((role) => userRoles.has(role));

    if (!allowed) {
      next(new AccessDeniedError("You do not have permission to perform this action"));
      return;
    }

    next();
  };
}
