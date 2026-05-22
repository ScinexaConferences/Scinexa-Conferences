import mongoose from "mongoose";
import { createApp } from "./app.js";
import { hashPassword } from "./auth.js";
import { config } from "./config.js";
import { User } from "./models.js";

async function seedDevelopmentAdmin() {
  if (!config.devAdminEnabled) {
    return;
  }

  const existingUser = await User.findOne({ email: config.devAdminEmail });

  if (!existingUser) {
    await User.create({
      fullName: config.devAdminFullName,
      email: config.devAdminEmail,
      passwordHash: await hashPassword(config.devAdminPassword),
      roles: ["ADMIN"],
      active: true
    });
    return;
  }

  let updated = false;

  if (existingUser.fullName !== config.devAdminFullName) {
    existingUser.fullName = config.devAdminFullName;
    updated = true;
  }

  if (!existingUser.active) {
    existingUser.active = true;
    updated = true;
  }

  const nextRoles = new Set(Array.isArray(existingUser.roles) ? existingUser.roles : []);
  if (!nextRoles.has("ADMIN")) {
    nextRoles.add("ADMIN");
    existingUser.roles = [...nextRoles];
    updated = true;
  }

  if (config.devAdminResetPasswordOnStartup) {
    existingUser.passwordHash = await hashPassword(config.devAdminPassword);
    updated = true;
  }

  if (updated) {
    await existingUser.save();
  }
}

async function start() {
  await mongoose.connect(config.mongodbUri);
  await seedDevelopmentAdmin();

  const app = createApp();
  const server = app.listen(config.port, () => {
    console.log(`Scinexa API listening on port ${config.port}`);
  });

  const shutdown = async () => {
    server.close(async () => {
      await mongoose.disconnect();
      process.exit(0);
    });
  };

  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
}

start().catch((error) => {
  console.error("Failed to start Scinexa API", error);
  process.exit(1);
});
