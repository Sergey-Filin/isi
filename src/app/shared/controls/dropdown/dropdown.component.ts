import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  HostListener,
  Inject,
  Input,
  OnDestroy,
  Output,
  ViewChild
} from '@angular/core';
import { CdkPortal } from "@angular/cdk/portal";
import {
  ConnectedPosition,
  FlexibleConnectedPositionStrategy,
  Overlay,
  OverlayConfig,
  OverlayRef
} from "@angular/cdk/overlay";
import { Subject, take, takeUntil } from "rxjs";
import { CustomOverlayRef } from "@modules/modal/classes";
import { overlayClickOutside } from "@helpers/functions";

@Component({
  selector: 'app-dropdown',
  standalone: true,
  imports: [
    CdkPortal
  ],
  templateUrl: './dropdown.component.html',
  styleUrl: './dropdown.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DropdownComponent implements OnDestroy {

  showing = false;
  protected overlayRef: OverlayRef;

  private readonly destroyStream$ = new Subject<void>();

  @Input() reference: HTMLElement;
  @Input() readonly = false;
  @Input() hasBackdrop = true;
  @Input() minWidth: number | undefined;
  @Input() positionPair: ConnectedPosition[];
  @Input() additionalClass: string | null = null;

  @Output() outsideClick = new EventEmitter<void>();

  @ViewChild(CdkPortal) portal: CdkPortal;

  private get documentHeight(): number {
    const doc = window && window.document;
    if (!doc) {
      return 0;
    }
    return doc.body && doc.body.offsetHeight;
  }

  private get isNarrowScreen(): boolean {
    const doc = window && window.document;
    if (!doc) {
      return false;
    }
    return doc.body && doc.body.offsetWidth <= 480;
  }

  private get isSmallScreen(): boolean {
    const actualHeight = this.documentHeight;
    return actualHeight < this.initialDocumentHeight;
  }

  private readonly initialDocumentHeight = this.documentHeight;

  constructor(
    protected overlay: Overlay,
    @Inject(CustomOverlayRef) private readonly customOverlayRef: CustomOverlayRef,
  ) {
  }

  ngOnDestroy(): void {
    const destroy = this.destroyStream$;
    destroy.next();
    destroy.complete();
  }

  show() {
    if (this.readonly) {
      return;
    }
    this.overlayRef = this.overlay.create(this.getOverlayConfig());
    this.overlayRef.attach(this.portal);
    this.syncWidth();
    this.overlayRef.backdropClick().pipe(
      take(1),
      takeUntil(this.destroyStream$),
    ).subscribe(() => this.hide());
    this.showing = true;
  }

  hide() {
    if (this.overlayRef) {
      this.overlayRef.detach();
    }
    this.showing = false;
    const isModal = !!this.customOverlayRef.overlay;
    if (isModal) {
      return;
    }
  }

  toggle(): void {
    this.showing ? this.hide() : this.show();
  }

  private closeOnClickOutsideOverlay(): void {
    const overlayRef = this.overlayRef;
    if (!overlayRef) {
      return;
    }
    overlayClickOutside(overlayRef, this.reference)
      .pipe(takeUntil(this.destroyStream$))
      .subscribe(_ => {
        this.hide();
        this.outsideClick.emit();
      });
  }

  @HostListener('window:resize')
  onWinResize() {
    this.syncWidth();
  }

  protected getOverlayConfig(): OverlayConfig {
    const positionStrategy = this.getOverlayPositionStrategy();
    const scrollStrategyBlock = this.overlay.scrollStrategies.block();
    return new OverlayConfig({
      positionStrategy,
      scrollStrategy: scrollStrategyBlock,
      hasBackdrop: this.hasBackdrop,
      disposeOnNavigation: true,
      backdropClass: 'cdk-overlay-transparent-backdrop',
      panelClass: this.additionalClass || '',
      minWidth: this.minWidth,
    });
  }

  private getOverlayPositionStrategy(): FlexibleConnectedPositionStrategy {
    const offsetX = this.isSmallScreen && !this.isNarrowScreen ? 15 : 0;
    const positions = this.positionPair || this.getOverlayPositions();
    return this.overlay.position()
      .flexibleConnectedTo(this.reference)
      .withPush(false)
      .withDefaultOffsetX(offsetX)
      .withPositions(positions);
  }

  private getOverlayPositions(): ConnectedPosition[] {
    if (this.isSmallScreen && this.hasBackdrop) {
      return [{
        originX: 'center',
        originY: 'top',
        overlayX: 'center',
        overlayY: 'top',
      }];
    }
    return [{
      originX: 'start',
      originY: 'bottom',
      overlayX: 'start',
      overlayY: 'top',
    }, {
      originX: 'start',
      originY: 'top',
      overlayX: 'start',
      overlayY: 'bottom',
    }];
  }

  private syncWidth() {
    if (!this.overlayRef) {
      return;
    }
    const refRect = this.reference.getBoundingClientRect();
    this.overlayRef.updateSize({
      width: refRect.width,
    });
  }
}

