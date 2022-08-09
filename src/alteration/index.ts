import { addRecurringStatusColumn, addTransactionTypeColumn, allowNullInDueAndPaidAtColumns, changeStatusColumnDataType, renameIconColumnInCategory } from "./transaction";

export class AlterationsManager {
  public static async run() {
    // Transaction table alterations
    await addRecurringStatusColumn();
    await changeStatusColumnDataType();
    await allowNullInDueAndPaidAtColumns();

    await renameIconColumnInCategory();


  }
}