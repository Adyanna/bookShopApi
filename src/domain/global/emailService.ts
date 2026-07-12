export interface emailService {
  send: (params: { email: string; message: string; subject?: string }) => Promise<void>;
}
