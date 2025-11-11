export interface Notification {
  id: number;
  message: string;
  isSuccess: boolean;
  timestamp: number;
  timeout?: any;
}