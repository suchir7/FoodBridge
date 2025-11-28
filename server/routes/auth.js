import { Router } from "express";
import { supabase } from "../db.js";

const router = Router();

router.post("/", async (req, res) => {
    const { action, email, password, name, organization, role } = req.body;

    try {
        if (action === "signup") {
            // 1. Create auth user in Supabase Auth
            const { data: authData, error: authError } = await supabase.auth.signUp({
                email,
                password,
            });

            if (authError) throw authError;
            if (!authData.user) throw new Error("Failed to create user");

            // 2. Create profile in our 'users' table
            const { error: profileError } = await supabase
                .from("users")
                .insert({
                    id: authData.user.id, // Link to auth user
                    email,
                    password_hash: "managed_by_supabase", // We don't store passwords directly if using Supabase Auth, but for this demo we might be mixing approaches. 
                    // If using pure Supabase Auth, we don't need password_hash here. 
                    // However, the existing schema has it. Let's keep it simple for now.
                    name,
                    organization,
                    role: role || "donor",
                });

            if (profileError) {
                // Cleanup auth user if profile creation fails (optional but good practice)
                // await supabase.auth.admin.deleteUser(authData.user.id); 
                throw profileError;
            }

            return res.json({ success: true, user: { ...authData.user, name, organization, role } });

        } else if (action === "signin") {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) throw error;

            // Fetch user profile details
            const { data: profile } = await supabase
                .from("users")
                .select("*")
                .eq("id", data.user.id)
                .single();

            return res.json({ success: true, user: { ...data.user, ...profile } });
        } else {
            return res.status(400).json({ error: "Invalid action" });
        }
    } catch (error) {
        console.error("Auth error:", error);
        res.status(400).json({ error: error.message || "Authentication failed" });
    }
});

export default router;
