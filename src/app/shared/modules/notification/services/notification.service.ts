import { Injectable } from "@angular/core";
import { CustomOverlayRef } from "@modules/modal/classes";
import { OverlayService } from "@modules/modal";
import { EMPTY, Observable, take } from "rxjs";
import { OverlayCloseEvent } from "@modules/modal/interface/overlay-close-event";
import {NotificationData, NotificationType} from "@shared/modules/notification/models/notification.model";
import { NotificationComponent } from "@modules/notification/components/notification/notification.component";

let service: NotificationService;

@Injectable()
export class NotificationService {

  private overlayRef: CustomOverlayRef | null;

  constructor(
    private readonly overlayService: OverlayService,
  ) {
    service = this;
  }

  info(message: string, timeout: number | null = 2000): Observable<OverlayCloseEvent<null>> {
    return this.openModal(message, NotificationType.INFO, timeout);
  }

  error(message: string, timeout: number | null = 1000, preventBackdropClick = false): Observable<OverlayCloseEvent<null>> {
    return this.openModal(message, NotificationType.ERROR, timeout, preventBackdropClick);
  }

  success(message: string, timeout: number | null = 2000): Observable<OverlayCloseEvent<null>> {
    return this.openModal(message, NotificationType.SUCCESS, timeout);
  }

  warning(message: string, timeout: number | null = 2000): Observable<OverlayCloseEvent<null>> {
    return this.openModal(message, NotificationType.WARNING, timeout);
  }

  openByType(message: string, type: NotificationType, timeout: number | null = 3000, translate = false)
    : Observable<OverlayCloseEvent<null>> {
    return this.openModal(message, type, timeout, translate);
  }

  private openModal(
    message: string,
    type: NotificationType,
    timeout: number | null = 2000,
    preventBackdropClick = false,
  )
    : Observable<OverlayCloseEvent<null>> {
    const data = new NotificationData(type, message);
    this.overlayRef = this.overlayService.open(
      NotificationComponent,
      data,
      {disposeOnNavigation: false, hasBackdrop: false, panelClass: 'notification-modal'},
      {preventBackdropClick, disableCloseBtn: true},
    );
    if (timeout) {
      setTimeout(() => {
        const ref = this.overlayRef;
        if (ref) {
          ref.close(null);
        }
      }, timeout);
    }
    if (!this.overlayRef) {
      return EMPTY;
    }
    const closed$ = this.overlayRef.afterClosed$;
    closed$
      .pipe(take(1))
      .subscribe(() => this.overlayRef = null);
    return closed$;
  }

}
