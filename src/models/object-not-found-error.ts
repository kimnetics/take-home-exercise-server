export class ObjectNotFoundError extends Error {
  name: string = 'ObjectNotFoundError'
  status: number = 404

  constructor (
    objectName: string
  ) {
    const message = `${objectName} was not found.`
    super(message)
  }
}
