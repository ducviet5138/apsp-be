import { MigrationInterface, QueryRunner, TableColumn, TableForeignKey } from "typeorm";

export class FixRelations1733888996192 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // FocusDuration
    await queryRunner.dropForeignKey("focus_durations", "FK_FOCUS_DURATIONS_TASKS");
    await queryRunner.dropColumn("focus_durations", "tasks");
    await queryRunner.addColumn(
      "focus_durations",
      new TableColumn({
        name: "task_id",
        type: "uuid",
        isNullable: false,
      })
    );
    await queryRunner.createForeignKey(
      "focus_durations",
      new TableForeignKey({
        name: "FK_FOCUS_DURATIONS_TASK_ID",
        columnNames: ["task_id"],
        referencedColumnNames: ["id"],
        referencedTableName: "tasks",
        onDelete: "CASCADE",
      })
    );

    // Task
    await queryRunner.addColumn(
      "tasks",
      new TableColumn({
        name: "user_id",
        type: "uuid",
        isNullable: false,
      })
    );
    await queryRunner.createForeignKey(
      "tasks",
      new TableForeignKey({
        name: "FK_TASKS_USER_ID",
        columnNames: ["user_id"],
        referencedColumnNames: ["id"],
        referencedTableName: "users",
        onDelete: "CASCADE",
      })
    );
  }

  public async down(): Promise<void> {
    throw new Error("Method not implemented.");
  }
}
