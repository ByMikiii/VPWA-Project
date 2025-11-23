import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class Invitation extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare accepted: boolean

  @column()
  declare string_code: string | null

  @column()
  declare channel_id: number

  @column()
  declare invited_by: number

  @column()
  declare receiver_id: number

  @column.dateTime()
  declare valid_till: DateTime | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null
}
