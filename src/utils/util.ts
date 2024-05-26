import { type Response } from 'express'
import { jsonc } from 'jsonc'
import { type ResponseInfo } from '../models/response-info'

export function formatResponse (statusCode: number, body: object): ResponseInfo {
  return {
    statusCode,
    body
  }
}

export function formatResponseMessage (statusCode: number, message: string): ResponseInfo {
  return formatResponse(statusCode, {
    message
  })
}

export function returnResponse (res: Response, statusCode: number, body: object): void {
  res.status(statusCode).set('Content-Type', 'application/json').send(jsonc.stringify(body))
}
