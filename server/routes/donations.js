import { Router } from "express";
import { supabase } from "../db.js";

const router = Router();

// Get all donations
router.get("/", async (req, res) => {
    try {
        const { data, error } = await supabase
            .from("donations")
            .select("*")
            .order("created_at", { ascending: false });

        if (error) throw error;
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Create a donation
router.post("/", async (req, res) => {
    try {
        const { donorName, donorEmail, details, location, image } = req.body;

        const { data, error } = await supabase
            .from("donations")
            .insert({
                donor_name: donorName,
                donor_email: donorEmail,
                details,
                location,
                image_url: image, // Schema uses image_url
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

// Update donation status
router.put("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const { data, error } = await supabase
            .from("donations")
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
