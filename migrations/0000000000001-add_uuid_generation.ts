import { MigrationInterface, QueryRunner } from "typeorm";

export class AddUuidGeneration0000000000001 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);
  }

  public async down(): Promise<void> {
    throw new Error("Method not implemented.");
  }
}
