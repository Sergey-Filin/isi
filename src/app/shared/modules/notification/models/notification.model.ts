export enum NotificationType {
  SUCCESS = 'success',
  ERROR = 'error',
  WARNING = 'warning',
  INFO = 'info',
}

export class NotificationData {
  constructor(
    public readonly type: NotificationType,
    public readonly message: string,
  ) {
  }
}
