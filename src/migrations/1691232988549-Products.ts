import { MigrationInterface, QueryRunner, Table } from "typeorm"

export class Products1691232988549 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'products',
                columns: [
                    {
                        name: 'id',
                        type: 'varchar',
                        isPrimary: true,
                        length: '36',
                        isNullable: false
                    },
                    {
                        name: 'name',
                        type: 'varchar',
                        length: '100',
                        isNullable: false,
                    },
                    {
                        name: 'production_date',
                        type: 'date',
                        isNullable: false,
                    },
                    {
                        name: 'qty',
                        type: 'int',
                        default: 0,
                        isNullable: false,
                    },
                    {
                        name: 'price',
                        type: 'double unsigned',
                        default: 0,
                        isNullable: false,
                    },
                    {
                        name: 'description',
                        type: 'text',
                        isNullable: false,
                    },
                    {
                        name: 'created_at',
                        type: 'datetime(6)',
                        default: 'CURRENT_TIMESTAMP(6)',
                        isNullable: false,
                    },
                    {
                        name: 'updated_at',
                        type: 'datetime(6)',
                        default: 'CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)',
                        isNullable: true,
                    },
                ],
            })
        )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('DROP TABLE IF EXISTS products');
    }

}
