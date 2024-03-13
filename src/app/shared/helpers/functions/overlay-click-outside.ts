import {OverlayRef} from '@angular/cdk/overlay';
import {fromEvent} from 'rxjs';
import {filter, takeUntil} from 'rxjs/operators';

export const overlayClickOutside = (overlayRef: OverlayRef, origin: HTMLElement) => fromEvent<MouseEvent>(document, 'click')
  .pipe(
    filter(event => {
      const clickTarget = event.target as HTMLElement;
      const notOrigin = clickTarget !== origin;
      const notOverlay = !!overlayRef && (overlayRef.overlayElement.contains(clickTarget) === false);
      return notOrigin && notOverlay;
    }),
    takeUntil(overlayRef.detachments()),
  );
