import { DataTypes } from "sequelize";
import { DATABASE_TABLES } from "../constants/db_tables";
import { queryInterface } from "../database";
import { Alteration } from "./controller";

export const changeIdDatatype = async () => {
  const migration = new Alteration(
    99,
    `Change ID datatype of table ${DATABASE_TABLES.ALTERATIONS}`,
    new Date().toISOString(),
    async () => {
      try {

        await queryInterface.changeColumn(
          DATABASE_TABLES.ALTERATIONS,
          'id',
          {
            type: DataTypes.STRING
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