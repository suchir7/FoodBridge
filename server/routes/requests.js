import { Router } from "express";
import { supabase } from "../db.js";

const router = Router();

// Get all requests
router.get("/", async (req, res) => {
    try {
        const { data, error } = await supabase
            .from("requests")
            .select("*")
            .order("created_at", { ascending: false });

        if (error) throw error;
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Create a request
router.post("/", async (req, res) => {
    try {
        const { requesterEmail, orgName, contact, details, location } = req.body;

        const { data, error } = await supabase
            .from("requests")
            .insert({
                requester_email: requesterEmail,
                org_name: orgName,
                contact,
                details,
                location,
                status: "Pending"
            })
            .select()
            .single();

        if (error) throw error;
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update request status
router.put("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const { data, error } = await supabase
            .from("requests")
            .update({ status })
            .eq("id", id)
            .select()
            .single();

        if (error) throw error;
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
