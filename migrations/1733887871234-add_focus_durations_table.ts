import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class AddFocusDurationsTable1733887871234 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "focus_durations",
        columns: [
          {
            name: "id",
            type: "uuid",
            isPrimary: true,
            isGenerated: true,
            generationStrategy: "uuid",
          },
          {
            name: "start",
            type: "timestamp",
            isNullable: false,
          },
          {
            name: "duration",
            type: "int",
            isNullable: false,
          },
          {
            name: "tasks",
            type: "uuid",
            isNullable: false,
          },
        ],
        foreignKeys: [
          {
            name: "FK_FOCUS_DURATIONS_TASKS",
            columnNames: ["tasks"],
            referencedColumnNames: ["id"],
            referencedTableName: "tasks",
            onDelete: "CASCADE",
          },
        ],
      })
    );
  }

  public async down(): Promise<void> {
    throw new Error("Method not implemented.");
  }
}
