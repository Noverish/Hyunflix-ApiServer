import _smi2vtt from './subtitle';

export const ForbiddenError = createError(403, 'Forbidden');

export function createError(statusCode: number, message: string) {
  return {
    status: statusCode,
    msg: message 
  }
}

export const smi2vtt = _smi2vtt;