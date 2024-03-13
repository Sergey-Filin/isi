import { NotificationComponent } from "@modules/notification/components/notification/notification.component";
import { ModuleWithProviders, NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ModalModule, OverlayService } from "@modules/modal";
import { MODAL_CONFIG } from "@modules/modal/classes";
import { NotificationService } from "@modules/notification/services/notification.service";

export const NotificationServiceFactory = (overlayService: OverlayService): NotificationService => new NotificationService(overlayService);

@NgModule({
  declarations: [NotificationComponent],
  imports: [
    CommonModule,
    ModalModule
  ],
  providers: [
    {
      provide: MODAL_CONFIG,
      useValue: {},
    },
  ],
})
export class NotificationModule {
  static forRoot(): ModuleWithProviders<NotificationModule> {
    return {
      ngModule: NotificationModule,
      providers: [
        {
          provide: NotificationService,
          useFactory: NotificationServiceFactory,
          deps: [OverlayService],
        },
      ],
    };
  }
}
