export class SnackBarData {
  constructor(
    public message: string,
    public title: string = null,
    public icon: 'warning' | 'done' | 'report' = null,
    public action: string | 'Close' = null,
    public duration: number = 5000,
  ) { }
}

export class NotificationDto {
  constructor(
    public message: string,
    public title: string = null,
    public action: 'Close' | string = 'Close',
    public duration: number = 5000,
  ) { }
}
