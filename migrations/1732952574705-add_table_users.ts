import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class AddTableUsers1732952574705 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create the "users" table
    await queryRunner.createTable(
      new Table({
        name: "users",
        columns: [
          {
            name: "id",
            type: "uuid",
            isPrimary: true,
            default: "uuid_generate_v4()", // Generate UUID in PostgreSQL using uuid_generate_v4()
          },
          {
            name: "uid",
            type: "text",
            isNullable: false,
          },
          {
            name: "name",
            type: "text",
            isNullable: false,
          },
          {
            name: "email",
            type: "text",
            isNullable: false,
          },
          {
            name: "avatar",
            type: "uuid",
            isNullable: true,
          },
        ],
        foreignKeys: [
          {
            name: "FK_USERS_AVATAR",
            columnNames: ["avatar"],
            referencedColumnNames: ["id"],
            referencedTableName: "buckets",
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
