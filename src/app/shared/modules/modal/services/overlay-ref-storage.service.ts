import {BlockScrollStrategy, OverlayRef} from '@angular/cdk/overlay';
import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class OverlayRefStorageService {

  readonly lastOpenedOverlayRefs = new Map<number, OverlayRef>();

  constructor() {
  }

  addOpenedModal(ref: OverlayRef, id: number): void {
    this.lastOpenedOverlayRefs.set(id, ref);
  }

  removeOpenedModal(id: number): void {
    this.lastOpenedOverlayRefs.delete(id);
  }

  hasOpenedModalWithGlobalPosition(): boolean {
    const values = Array.from(this.lastOpenedOverlayRefs.values());
    return !!values.find(ref => ref.getConfig().scrollStrategy instanceof BlockScrollStrategy);
  }
}
