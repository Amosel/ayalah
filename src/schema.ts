import { z } from 'zod';

export const rsvpFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  attendees: z.number().max(10).or(
    z.string().refine((val) => parseInt(val), { message: "Please select a number of attendees" })),
  dish: z.string().optional().default("none"), // Assuming dish is optional
  games: z.string().optional().default("none").transform(t => t === "on"),
});

export const rsvpDBSchema = z.object({
  name: z.string(),
  email: z.string(),
  attendees: z.number(),
  dish: z.string(),
  games: z.boolean(),
  iscancelled: z.boolean().default(false),
});

export type RSVPDB = z.infer<typeof rsvpDBSchema>;

export type RSVPForm = z.infer<typeof rsvpFormSchema>;
