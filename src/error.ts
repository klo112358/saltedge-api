export class SaltEdgeError extends Error {
  public readonly class: string
  public readonly documentation_url: string
  public readonly request_id: string
  public readonly request: any

  constructor(response: any, public readonly code: number) {
    super(response.error.message)
    this.class = response.error.class
    this.documentation_url = response.error.documentation_url
    this.request_id = response.error.request_id
    this.request = response.request

    Object.setPrototypeOf(this, SaltEdgeError.prototype)
  }
}
