export const ForbiddenError = createError(403, 'Forbidden');

export function createError(statusCode: number, message: string) {
  return {
    status: statusCode,
    msg: message 
  }
}