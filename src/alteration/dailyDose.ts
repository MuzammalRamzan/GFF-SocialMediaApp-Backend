import { DataTypes } from "sequelize";
import { DATABASE_TABLES } from "../constants/db_tables";
import { queryInterface, sequelize } from "../database";
import { Alteration } from "./controller";

export const addCreatedAtColumn = async () => {
  const migration = new Alteration(
    12,
    `Added new created_at column to ${DATABASE_TABLES.DAILY_ARTICLE}`,
    new Date().toISOString(),
    async () => {
      try {
        const table = await queryInterface.describeTable(DATABASE_TABLES.DAILY_ARTICLE);

        if (table.created_at) {
          return true;
        }

        await queryInterface.addColumn(
          DATABASE_TABLES.DAILY_ARTICLE,
          'created_at',
          {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize.fn('now'),
          }
        );

        return true;
      } catch (error) {
        console.log(error);
        return false;
      }
    },
  )

  migration.run();
}

export const removeContentBodyColumn = async () => {
  const migration = new Alteration(
    13,
    `Remove contentBody column to ${DATABASE_TABLES.DAILY_ARTICLE}`,
    new Date().toISOString(),
    async () => {
      try {
        const table = await queryInterface.describeTable(DATABASE_TABLES.DAILY_ARTICLE);

        if (table.contentBody) {
          await queryInterface.removeColumn(DATABASE_TABLES.DAILY_ARTICLE, 'contentBody');
          return true;
        }
        return true;
      } catch (error) {
        console.log(error);
        return false;
      }
    },
  )

  migration.run();
}