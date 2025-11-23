import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class Member extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare is_kicked: boolean

  @column()
  declare kick_count: number

  @column()
  declare user_id: number

  @column()
  declare channel_id: number

  @column()
  declare role: 'Owner' | 'Admin' | 'Moderator' | 'Guest'

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null
}
