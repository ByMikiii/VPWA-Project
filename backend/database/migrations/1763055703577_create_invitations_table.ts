import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'invitations'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.boolean('accepted').defaultTo('false').notNullable()
      table.string("string_code")
      table.integer('channel_id').references('id').inTable('channels')
      table.integer('invited_by').references('id').inTable('users')
      table.integer('receiver_id').references('id').inTable('users')
      table.timestamp('valid_till')

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
