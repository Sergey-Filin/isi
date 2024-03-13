import { Subject, take, takeUntil } from "rxjs";
import { OverlayCloseEvent, OverlayCloseEventType } from "@modules/modal/interface/overlay-close-event";
import { OverlayRef } from "@angular/cdk/overlay";
import { DestroyRef, inject, TemplateRef, Type } from "@angular/core";
import { OverlayService } from "@modules/modal/services/overlay.service";
import { CustomOverlayConfig } from "@modules/modal/interface/custom-overlay-config";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";

export class CustomOverlayRef<R = any | null, T = any> {
  private static uid = 0;
  id = CustomOverlayRef.uid++;
  afterClosed$ = new Subject<OverlayCloseEvent<T | null>>();
  private destroyStream$ = new Subject<void>();
  backdropClickData: T | null = null;

  get overlayElement(): HTMLElement {
    return this.overlay.overlayElement;
  }

  constructor(
    public readonly overlay: OverlayRef,
    public readonly content: string | TemplateRef<any> | Type<any>,
    public readonly data: T,
    public readonly overlayService: OverlayService,
    private customOverlayConfig?: CustomOverlayConfig,
  ) {
    this.onBackdropClick();
  }

  close(data: T | null, closeType: OverlayCloseEventType = 'close') {
    this.dispose(closeType, data);
  }

  setBackdropClickData(data: T): void {
    this.backdropClickData = data;
  }

  private dispose(type: OverlayCloseEventType, data: T | null) {
    this.overlay.dispose();
    this.afterClosed$.next({
      type,
      data,
    });
    this.destroy();
  }

  removeLastModalRef(): void {
    this.overlayService.removeLastModalRef(this.content, this.id);
  }

  private onBackdropClick(): void {
    const config = this.customOverlayConfig;
    const preventBackdropClick = config && config.preventBackdropClick;
    if (preventBackdropClick) {
      return;
    }
    this.overlay.backdropClick()
      .pipe(
        take(1),
        takeUntil(this.destroyStream$),
      )
      .subscribe(() => this.dispose('backdropClick', this.backdropClickData));
  }

  private destroy(): void {
    this.destroyStream$.next();
    this.destroyStream$.complete();
    this.afterClosed$.complete();
  }
}
