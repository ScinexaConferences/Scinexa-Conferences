import path from "node:path";
import { fileURLToPath } from "node:url";
import dotenv from "dotenv";

const currentDir = path.dirname(fileURLToPath(import.meta.url));
const apiRoot = path.resolve(currentDir, "..");
const repoRoot = path.resolve(apiRoot, "../..");

dotenv.config({ path: path.join(repoRoot, ".env"), override: false });
dotenv.config({ path: path.join(apiRoot, ".env"), override: true });

function toBoolean(value, fallback) {
  if (value === undefined) {
    return fallback;
  }

  return ["1", "true", "yes", "on"].includes(String(value).trim().toLowerCase());
}

function toNumber(value, fallback) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function toList(value, fallback) {
  if (!value) {
    return fallback;
  }

  return String(value)
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

export const config = {
  port: toNumber(process.env.PORT, 5000),
  mongodbUri: process.env.MONGODB_URI ?? "mongodb://localhost:27017/scinexa_conferences",
  jwtSecret: process.env.JWT_SECRET ?? "scinexa-dev-jwt-secret-key-please-change-2026",
  jwtAccessTokenExpirationMs: toNumber(process.env.JWT_ACCESS_TOKEN_EXPIRATION_MS, 3600000),
  jwtRefreshTokenExpirationMs: toNumber(process.env.JWT_REFRESH_TOKEN_EXPIRATION_MS, 604800000),
  corsOrigins: toList(process.env.CORS_ORIGINS, [
    "http://localhost:5173",
    "http://127.0.0.1:5173"
  ]),
  awsRegion: process.env.AWS_REGION ?? "ap-south-1",
  awsBucketName: process.env.AWS_BUCKET_NAME ?? "",
  awsAccessKey: process.env.AWS_ACCESS_KEY ?? "",
  awsSecretKey: process.env.AWS_SECRET_KEY ?? "",
  devAdminEnabled: toBoolean(process.env.DEV_ADMIN_ENABLED, true),
  devAdminFullName: process.env.DEV_ADMIN_FULL_NAME ?? "Scinexa Admin",
  devAdminEmail: (process.env.DEV_ADMIN_EMAIL ?? "admin@scinexa.local").trim().toLowerCase(),
  devAdminPassword: process.env.DEV_ADMIN_PASSWORD ?? "Admin@12345",
  devAdminResetPasswordOnStartup: toBoolean(process.env.DEV_ADMIN_RESET_PASSWORD_ON_STARTUP, true)
};

if (config.jwtSecret.length < 32) {
  throw new Error("JWT_SECRET must be at least 32 characters for HS256 signing.");
}

export { apiRoot, repoRoot };
