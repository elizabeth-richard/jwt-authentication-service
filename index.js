import express from "express";
import authRoutes from "./routes/auth.js";
import { sequelize } from "./database/index.js";

const app = express();
const port = 3434;

app.use(express.json()); // Parse JSON bodies

app.use("/auth", authRoutes); // Mount auth routes

// Synchronize database
sequelize
	.sync()
	.then(() => {
		console.log("[Database synchronized]");
		app.listen(port, () => {
			console.log(`[Server running on port ${port}]`);
		});
	})
	.catch((err) => {
		console.error("[Database sync error]", err);
	});
