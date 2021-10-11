import {MigrationInterface, QueryRunner} from "typeorm";

export class User1633835594026 implements MigrationInterface {
    name = 'User1633835594026'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "User" (
                "id" varchar NOT NULL,
                "username" varchar NOT NULL,
                "email" varchar NOT NULL,
                "verified" boolean NOT NULL,
                "passwordHash" varchar NOT NULL,
                "role" varchar NOT NULL,
                "createdAt" datetime NOT NULL DEFAULT (datetime('now')),
                "updatedAt" datetime NOT NULL DEFAULT (datetime('now')),
                PRIMARY KEY ("id", "username", "email")
            )
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DROP TABLE "User"
        `);
    }

}