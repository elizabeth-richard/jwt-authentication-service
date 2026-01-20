import { Router } from "express";
import { User, getUserByLogin } from "../models/user.js";
import { generateToken } from "../util/hash.js";
import middleware from "../middleware/index.js";

const router = Router();

// Register Route
router.post("/register", async (req, res) => {
	try {
		const { firstName, lastName, login, password } = req.body;

		if (!firstName || !lastName || !login || !password) {
			return res.status(400).json({ error: "All fields are required" });
		}

		const existingUser = await User.findOne({ where: { login } });
		if (existingUser) {
			return res.status(409).json({ error: "User already exists" });
		}

		const user = await User.create({ firstName, lastName, login, password });

		// Return user without password
		const userData = user.get({ plain: true });
		delete userData.password;

		res.status(201).json(userData);
	} catch (error) {
		console.error("Registration error:", error);
		res.status(500).json({ error: "Internal server error" });
	}
});

// Login Route
router.post("/login", async (req, res) => {
	try {
		const { login, password } = req.body;

		if (!login || !password) {
			return res.status(400).json({ error: "Login and password are required" });
		}

		const user = await getUserByLogin(login, password); // Here we replaced with keycloack

		if (!user) {
			return res.status(401).json({ error: "Invalid credentials" });
		}

		const token = await generateToken({ id: user.id, login: user.login });
		res.json({ token, user });
	} catch (error) {
		console.error("Login error:", error);
		res.status(500).json({ error: "Internal server error" });
	}
});

// Return the user info
router.get("/me", middleware, async (req, res) => {
	try {
		const user = await User.findByPk(req.user.id);
		if (!user) {
			return res.status(404).json({ error: "User not found" });
		}
		const userData = user.get({ plain: true });
		delete userData.password;
		res.json(userData);
	} catch (error) {
		console.error("Me error:", error);
		res.status(500).json({ error: "Internal server error" });
	}
});

export default router;
