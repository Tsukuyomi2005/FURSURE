// @ts-ignore - Type definitions will be available after npm install
import { defineSchema } from "convex/server";
// @ts-ignore
import { authTables } from "@convex-dev/auth/server";

const applicationTables = {};

export default defineSchema({
  ...authTables,
  ...applicationTables,
});
