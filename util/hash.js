import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/constants.js";

/**
 * Produce hash of the password
 * @param {string} password to hash
 * @return {Promise<string>} a hash promise
 */
export async function hashPassword(password) {
	return await bcrypt.hash(password, 10);
}

/**
 * Check validity of hash for the password
 * @param {string} password to compare against a hash
 * @param {string} hash immutable hash
 * @return {Promise<boolean>} a boolean promise
 */
export async function isValidHash(password, hash) {
	return await bcrypt.compare(password, hash);
}

/**
 * Generate JWT token
 * @param {Object} payload
 * @return {Promise<string>}
 */
export async function generateToken(payload) {
	return jwt.sign(payload, JWT_SECRET, {
		algorithm: "HS256",
		expiresIn: "1h",
	});
}

/**
 * Verify JWT token
 * @param {string} token
 * @return {Promise<Object>}
 */
export async function verifyToken(token) {
	return jwt.verify(token, JWT_SECRET, {
		algorithms: ["HS256"],
	});
}
