export class BadRequestError extends Error {
  name: string = 'BadRequestError'
  status: number = 400
}
