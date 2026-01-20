import { sequelize } from "../database/index.js";
import { DataTypes } from "sequelize";
import { hashPassword, isValidHash } from "../util/hash.js";

/**
 * Get user by login info
 *
 * @param {string} login
 * @param {string} password
 * @returns {Promise<User | null>}
 */

async function getUserByLogin(login, password) {
	/**
	 * 1. Fetch User
	 * 2. If user is not found return null
	 * 3. Verify password
	 * 4. Return user
	 * 5. Otherwise return null
	 */
	const user = await User.findOne({ where: { login } });

	if (!user) return null;

	const isValid = await isValidHash(password, user.password);

	if (isValid) {
		const userData = user.get({ plain: true });
		delete userData.password;
		return userData;
	}

	return null;
}

export const User = sequelize.define("users", {
	id: {
		type: DataTypes.INTEGER,
		primaryKey: true,
		autoIncrement: true,
	},
	firstName: {
		type: DataTypes.STRING,
		allowNull: false,
	},
	lastName: {
		type: DataTypes.STRING,
		allowNull: false,
	},
	login: {
		type: DataTypes.STRING,
		unique: true,
		allowNull: false,
	},
	password: {
		type: DataTypes.STRING,
		allowNull: false,
	},
	fullName: {
		type: DataTypes.VIRTUAL,
		get() {
			return `${this.firstName} ${this.lastName}`;
		},
		set(value) {
			throw new Error("Do not try to set full name directly");
		},
	},
});

User.beforeCreate(async (user) => {
	const hashed = await hashPassword(user.password);
	return (user.password = hashed);
});

User.beforeBulkCreate(async (users) => {
	return Promise.all(
		users.map((user) =>
			hashPassword(user.password).then((hashed) => (user.password = hashed)),
		),
	);
});

export { getUserByLogin };
