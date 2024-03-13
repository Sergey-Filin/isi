import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  Inject,
  inject,
  OnDestroy,
  OnInit,
  TemplateRef
} from "@angular/core";
import { CustomOverlayRef, MODAL_ADDITIONAL_CONFIG } from "@modules/modal/classes";
import { CustomOverlayConfig } from "@modules/modal/interface/custom-overlay-config";
import { ActivatedRoute, Router, RoutesRecognized } from "@angular/router";
import { OverlayRefStorageService } from "@modules/modal/services/overlay-ref-storage.service";
import { filter } from "rxjs";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";

@Component({
  selector: 'app-overlay',
  templateUrl: './overlay.component.html',
  styleUrl: './overlay.component.scss',
  changeDetection: ChangeDetectionStrategy.Default,
})
export class OverlayComponent implements OnInit, OnDestroy {

  private readonly destroyRef = inject(DestroyRef);

  contentType: 'template' | 'string' | 'component';
  content: string | any;
  context;
  showCloseBtn = true;

  constructor(
    private readonly ref: CustomOverlayRef,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    @Inject(MODAL_ADDITIONAL_CONFIG) private readonly customOverlayConfig: CustomOverlayConfig,
    private readonly overlayRefStorage: OverlayRefStorageService,
  ) {
  }

  ngOnInit() {

    this.content = this.ref.content;
    this.detectContentType();

    const config = this.ref.overlay.getConfig();
    if (config.disposeOnNavigation) {
      this.disposeOnNavigation();
    }
  }

  ngOnDestroy(): void {
    this.ref.removeLastModalRef();
    const hasOpenedModalWithGlobalPosition = this.overlayRefStorage.hasOpenedModalWithGlobalPosition();
    if (hasOpenedModalWithGlobalPosition) {
      return;
    }
  }

  close() {
    this.ref.close(this.ref.backdropClickData);
  }

  private detectContentType(): void {
    if (typeof this.content === 'string') {
      this.contentType = 'string';
    } else if (this.content instanceof TemplateRef) {
      this.contentType = 'template';
      this.context = {
        close: this.ref.close.bind(this.ref),
      };
    } else {
      this.contentType = 'component';
    }
    const customConfig = this.customOverlayConfig;
    if (customConfig && customConfig.disableCloseBtn) {
      this.showCloseBtn = false;
    }
  }

  private disposeOnNavigation(): void {
    const currentUrl = this.router.url;
    this.router.events.pipe(
      filter((e) => e instanceof RoutesRecognized),
      takeUntilDestroyed(this.destroyRef),
    ).subscribe((e: RoutesRecognized) => {
      if (e.urlAfterRedirects !== currentUrl) {
        this.close();
      }
    });
  }
}
