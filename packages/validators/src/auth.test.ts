import { describe, expect, it } from "vitest";

import { signInSchema, signUpSchema } from "./auth.js";

describe("authentication schemas", () => {
    it("normalizes and accepts valid sign-up credentials", () => {
        const result = signUpSchema.safeParse({
            email: "  hello@example.com ",
            name: "  Ada Lovelace ",
            password: "correct-horse-battery-staple",
        });

        expect(result).toMatchObject({ success: true });

        if (result.success) {
            expect(result.data).toEqual({
                email: "hello@example.com",
                name: "Ada Lovelace",
                password: "correct-horse-battery-staple",
            });
        }
    });

    it("rejects malformed email addresses and short passwords", () => {
        const result = signInSchema.safeParse({
            email: "not-an-email",
            password: "short",
        });

        expect(result.success).toBe(false);
    });

    it("requires a non-empty name when signing up", () => {
        const result = signUpSchema.safeParse({
            email: "hello@example.com",
            name: "   ",
            password: "correct-horse-battery-staple",
        });

        expect(result.success).toBe(false);
    });
});
