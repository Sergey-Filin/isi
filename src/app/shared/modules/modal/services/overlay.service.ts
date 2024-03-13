import {ConnectedPosition, Overlay, OverlayConfig, PositionStrategy} from '@angular/cdk/overlay';
import {ComponentPortal} from '@angular/cdk/portal';
import {
  ElementRef,
  Inject,
  Injectable,
  Injector,
  NgZone,
  StaticProvider,
  TemplateRef,
  Type,
} from '@angular/core';
import { MODAL_ADDITIONAL_CONFIG, MODAL_CONFIG, MODAL_DATA } from "@modules/modal/classes/modal-data";
import { ModalConfig } from "@modules/modal/interface/modal-config";
import { OverlayRefStorageService } from "@modules/modal/services/overlay-ref-storage.service";
import { CustomOverlayConfig } from "@modules/modal/interface/custom-overlay-config";
import { CustomOverlayRef } from "@modules/modal/classes/custom-overlay-ref";
import { OverlayComponent } from "@modules/modal/components/overlay/overlay.component";

@Injectable()
export class OverlayService {

  private lastOverlayRefs = new Set<string | TemplateRef<any> | Type<any>>();

  constructor(
    private readonly overlay: Overlay,
    private readonly injector: Injector,
    @Inject(MODAL_CONFIG) private readonly config: ModalConfig,
    private readonly zone: NgZone,
    private readonly overlayRefStorageService: OverlayRefStorageService,
  ) {
  }

  open<R = any, T = any>(
    content: string | TemplateRef<any> | Type<any>,
    data: T,
    config?: OverlayConfig,
    additionalConfig: CustomOverlayConfig = {},
    host: ElementRef | null = null,
    positions: ConnectedPosition[] | null = null,
  ): CustomOverlayRef<R> | null {

    const positionStrategy = positions ? this.getPositionStrategy(host, positions)
      :
      this.overlay.position()
        .global()
        .centerHorizontally()
        .centerVertically();

    const defaultConfig = new OverlayConfig({
      hasBackdrop: true,
      panelClass: ['is-active'],
      backdropClass: 'modal-background',
      disposeOnNavigation: true,
      scrollStrategy: this.overlay.scrollStrategies.block(),
      positionStrategy,
    });
    const configs = {...defaultConfig, ...config};
    if (this.config) {
      const {panelClass, backdropClass} = this.config;
      if (panelClass) {
        configs.panelClass = this.updateOverlayClasses(configs.panelClass as string | string[], panelClass);
      }
      if (backdropClass) {
        configs.backdropClass = this.updateOverlayClasses(configs.backdropClass as string | string[], backdropClass);
      }
    }
    const isModalOpened = this.lastOverlayRefs.has(content);
    if (isModalOpened) {
      return null;
    }
    const overlayRef = this.overlay.create(configs);
    const customOverlayRef = new CustomOverlayRef<R, T>(overlayRef, content, data, this, additionalConfig);
    const injector = this.createInjector(customOverlayRef, this.injector, data, additionalConfig);
    this.zone.run(() => {
      overlayRef.attach(new ComponentPortal(OverlayComponent, null, injector));
    });
    this.lastOverlayRefs.add(customOverlayRef.content);
    this.overlayRefStorageService.addOpenedModal(overlayRef, customOverlayRef.id);
    return customOverlayRef;
  }

  removeLastModalRef(content: string | TemplateRef<any> | Type<any>, id: number): void {
    this.overlayRefStorageService.removeOpenedModal(id);
    this.lastOverlayRefs.delete(content);
  }

  private createInjector(
    ref: CustomOverlayRef,
    inj: Injector,
    data: any | null = null,
    additionalConfig: CustomOverlayConfig | null = null,
  ): Injector {
    const tokens: StaticProvider[] = [
      {
        provide: CustomOverlayRef,
        useValue: ref,
      },
      {
        provide: MODAL_DATA,
        useValue: data,
      },
      {
        provide: MODAL_ADDITIONAL_CONFIG,
        useValue: additionalConfig,
      },
    ];
    return Injector.create({
      parent: inj,
      providers: [tokens],
    });
  }

  private updateOverlayClasses(configClasses: string | string[], classes: string | string[]): string | string[] {
    return [configClasses, classes]
      .reduce((acc: string[], val: string | string[]) => acc.concat(val), []);
  }

  private getPositionStrategy(host: ElementRef, positions: ConnectedPosition[]): PositionStrategy {
    return this.overlay
      .position()
      .flexibleConnectedTo(host)
      .withPositions(positions)
      .withFlexibleDimensions(false);
  }
}
