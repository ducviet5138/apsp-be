import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class AddTableTasks1733887200091 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "tasks",
        columns: [
          {
            name: "id",
            type: "uuid",
            isPrimary: true,
            isGenerated: true,
            generationStrategy: "uuid",
          },
          {
            name: "name",
            type: "text",
            isNullable: false,
            default: "''",
          },
          {
            name: "description",
            type: "text",
            isNullable: false,
            default: "''",
          },
          {
            name: "priority_level",
            type: "enum",
            enum: ["LOW", "MEDIUM", "HIGH"],
            default: "'LOW'",
          },
          {
            name: "start_time",
            type: "timestamp",
            isNullable: false,
          },
          {
            name: "estimated_time",
            type: "int",
            isNullable: false,
          },
          {
            name: "status",
            type: "enum",
            enum: ["TODO", "IN_PROGRESS", "COMPLETED", "EXPIRED"],
            default: "'TODO'",
          },
        ],
      })
    );
  }

  public async down(): Promise<void> {
    throw new Error("Method not implemented.");
  }
}
