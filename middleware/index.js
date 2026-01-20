import { verifyToken } from "../util/hash";

export default async function authenticate(req, res, next) {
	const auth_header = req.headers.authorization;

	if (!auth_header) {
		return res.status(401).json({ error: "Authorization header is required" });
	}

	const token = auth_header.split(" ")[1];

	try {
		const decode = await verifyToken(token);
		req.user = decode; // Attach user info to the request
		next();
	} catch (error) {
		return res.status(401).json({ error: "Invalid token" });
	}
}
