import { MigrationInterface, QueryRunner, TableForeignKey } from "typeorm";

export class RemoveOnDeleteCascadeUsers1733888093149 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey("users", "FK_USERS_AVATAR");
    await queryRunner.createForeignKey(
      "users",
      new TableForeignKey({
        name: "FK_USERS_AVATAR",
        columnNames: ["avatar"],
        referencedColumnNames: ["id"],
        referencedTableName: "buckets",
        onDelete: "SET NULL",
      })
    );
  }

  public async down(): Promise<void> {
    throw new Error("Method not implemented.");
  }
}
