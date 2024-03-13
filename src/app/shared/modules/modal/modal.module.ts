import { Overlay, OverlayModule } from "@angular/cdk/overlay";
import { Injector, NgModule, NgZone } from "@angular/core";
import { ModalConfig } from "@modules/modal/interface/modal-config";
import { OverlayRefStorageService } from "@modules/modal/services/overlay-ref-storage.service";
import { OverlayService } from "@modules/modal/services/overlay.service";
import { OverlayComponent } from "@modules/modal/components/overlay/overlay.component";
import { CommonModule } from "@angular/common";
import { PortalModule } from "@angular/cdk/portal";
import { CustomOverlayRef, MODAL_CONFIG, MODAL_DATA } from "@modules/modal/classes";

export const overlayServiceFactory = (
  overlay: Overlay,
  injector: Injector,
  config: ModalConfig,
  zone: NgZone,
  overlayRefStorageService: OverlayRefStorageService,
): OverlayService => new OverlayService(overlay, injector, config, zone, overlayRefStorageService);

@NgModule({
  declarations: [
    OverlayComponent,
  ],
  imports: [
    CommonModule,
    OverlayModule,
    PortalModule,
  ],
  providers: [
    {provide: MODAL_DATA, useValue: {}},
    {provide: MODAL_CONFIG, useValue: {}},
    {provide: CustomOverlayRef, useValue: {}},
    {
      provide: OverlayService,
      useFactory: overlayServiceFactory,
      deps: [Overlay, Injector, MODAL_CONFIG, NgZone, OverlayRefStorageService],
    },
  ],
})
export class ModalModule {
}
