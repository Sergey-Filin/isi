import { ChangeDetectionStrategy, Component, Inject, OnInit } from "@angular/core";
import { NotificationData, NotificationType } from "@modules/notification/models/notification.model";
import { MODAL_DATA } from "@modules/modal/classes";

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotificationComponent implements OnInit {

  readonly notificationTypes = NotificationType;
  constructor(@Inject(MODAL_DATA) public readonly data: NotificationData) {
  }

  ngOnInit() {
  }

}
