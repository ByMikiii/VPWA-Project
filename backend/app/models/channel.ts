import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class Channel extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare description: string | null

  @column()
  declare is_deleted: boolean

  @column()
  declare is_private: boolean

  @column.dateTime()
  declare latest_activity: DateTime | null

  @column()
  declare name: string

  @column()
  declare owner_id: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null
}
