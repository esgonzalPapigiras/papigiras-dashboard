// src/app/models/response-upload-bus.ts
export interface ResponseUploadBus {
  code: string;      // "0" for success, anything else for error
  response: string;  // human-readable message
}
