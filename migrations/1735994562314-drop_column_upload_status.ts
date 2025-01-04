import { MigrationInterface, QueryRunner } from "typeorm";

export class DropColumnUploadStatus1735994562314 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "buckets" DROP COLUMN "upload_status"`);
  }

  public async down(): Promise<void> {
    throw new Error("Method not implemented.");
  }
}
