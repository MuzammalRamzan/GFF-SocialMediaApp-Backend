import { AlterationModel } from "./model";

export interface IMigration {
  alterationsId: string | number;
  description: string;
  timestamps: string;
  execute: () => Promise<boolean>;
}

export class Alteration implements IMigration {
  alterationsId: string | number;
  description: string;
  timestamps: string;
  execute: () => Promise<boolean>;

  // Use the ID as UUID
  public constructor(alterationsId: string | number, description: string, timestamps: string, execute: () => Promise<boolean>) {
    this.alterationsId = alterationsId;
    this.description = description;
    this.timestamps = timestamps;
    this.execute = execute;
  }

  public async run() {
    const migration = await AlterationModel.findByPk(this.alterationsId);
    if (migration) {
      // skipping this migration because it has been executed at some point
      console.log(`Alteration ${this.alterationsId} has already been executed on ${migration.get('timestamps')}`);
    } else {
      const isSuccess = await this.execute();
      if (isSuccess) {
        const newMigration = new AlterationModel({
          id: this.alterationsId,
          description: this.description,
          timestamps: this.timestamps,
        });
        const savedMigration = await newMigration.save();
        if (!savedMigration) {
          throw 'Error saving migration!';
        }
      } else {
        throw 'Error saving migration!';
      }
    }
  }
}
