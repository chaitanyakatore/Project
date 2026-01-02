import { z } from "zod";

// Roles in our system
export const UserRole = z.enum(["ADMIN", "UNDERWRITER", "CMO"]);

// The core Underwriting Case
export const CaseSchema = z.object({
  id: z.string().uuid(),
  insuredName: z.string().min(3, "Name is too short"),
  benefitType: z.enum(["LIFE", "HEALTH", "CRITICAL_ILLNESS"]),
  sumAssured: z.number().positive(),
  status: z.enum([
    "DRAFT",
    "PENDING_UW",
    "PENDING_CMO",
    "APPROVED",
    "REJECTED",
  ]),

  // This part goes to MongoDB later
  medicalHistory: z.object({
    hasPreExistingConditions: z.boolean(),
    details: z.string().optional(),
    cmoNotes: z.string().optional(),
  }),

  // Audit trail fields
  createdBy: z.string(), // Admin ID
  assignedTo: z.string().optional(), // UW or CMO ID
  updatedAt: z.string().datetime(),
});

export type UnderwritingCase = z.infer<typeof CaseSchema>;
