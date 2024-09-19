import { z } from "zod";

export const bugReportSchema = z.object({
  deviceModel: z.string(),
  appVersion: z.string(),
  osVersion: z.string(),
  reason: z.enum([
    "loyalty_program",
    "restaurant_info",
    "account_issues",
    "app_navigation",
    "app_performance",
    "other",
  ]),
  description: z.string().min(10, "Please provide a more detailed description"),
  userId: z.string(),
});
