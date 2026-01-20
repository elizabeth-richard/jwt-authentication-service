import { DATABASE_URL } from "../config/constants.js";
import { Sequelize } from "sequelize";

const sequelize = new Sequelize(DATABASE_URL, { logging: false });

export { sequelize };
