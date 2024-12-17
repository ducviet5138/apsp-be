import { MigrationInterface, QueryRunner } from "typeorm";

export class TableTasksAllowNullable1734422926817 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "tasks" ALTER COLUMN "start_time" DROP NOT NULL`);
    await queryRunner.query(`ALTER TABLE "tasks" ALTER COLUMN "estimated_time" DROP NOT NULL`);
  }

  public async down(): Promise<void> {
    throw new Error("Method not implemented.");
  }
}
