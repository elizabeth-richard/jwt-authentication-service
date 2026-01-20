// Default database path
const DEFAULT_DATABASE_URL = "sqlite:../auth.db";

const JWT_SECRET = process.env.JWT_SECRET || "elizabeth-shija";
const DATABASE_URL = process.env.DATABASE_URL || DEFAULT_DATABASE_URL;

export { DATABASE_URL, JWT_SECRET };
