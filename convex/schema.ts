// @ts-ignore - Type definitions will be available after npm install
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
// @ts-ignore
import { authTables } from "@convex-dev/auth/server";

const applicationTables = {
  inventoryItems: defineTable({
    name: v.string(),
    category: v.string(),
    stock: v.number(),
    price: v.number(),
    expiryDate: v.string(),
  }),
  appointments: defineTable({
    petName: v.string(),
    ownerName: v.string(),
    phone: v.string(),
    email: v.string(),
    date: v.string(),
    time: v.string(),
    reason: v.optional(v.string()),
    vet: v.string(),
    status: v.union(
      v.literal("pending"),
      v.literal("approved"),
      v.literal("rejected"),
      v.literal("cancelled"),
      v.literal("rescheduled")
    ),
    notes: v.optional(v.string()),
    serviceType: v.optional(v.string()),
    price: v.optional(v.number()),
    paymentStatus: v.optional(
      v.union(
        v.literal("pending"),
        v.literal("down_payment_paid"),
        v.literal("fully_paid")
      )
    ),
    paymentData: v.optional(v.any()),
  }).index("by_date", ["date"]),
  schedules: defineTable({
    date: v.string(),
    startTime: v.string(),
    endTime: v.string(),
    veterinarians: v.array(v.string()),
    notes: v.optional(v.string()),
  }).index("by_date", ["date"]),
  services: defineTable({
    name: v.string(),
    description: v.string(),
    price: v.number(),
  }),
  staff: defineTable({
    name: v.string(),
    position: v.union(v.literal("Veterinarian"), v.literal("Vet Staff")),
    email: v.string(),
    phone: v.string(),
    status: v.union(v.literal("active"), v.literal("inactive")),
  }),
};

export default defineSchema({
  ...authTables,
  ...applicationTables,
});
