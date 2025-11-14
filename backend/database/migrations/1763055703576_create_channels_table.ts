import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'channels'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('description')
      table.boolean('is_deleted').defaultTo(false).notNullable()
      table.boolean('is_private').notNullable()
      table.timestamp('latest_activity')
      table.string('name').notNullable().unique()
      table.integer('owner_id').references('id').inTable('users')

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
