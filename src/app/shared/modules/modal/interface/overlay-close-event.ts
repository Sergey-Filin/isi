export type OverlayCloseEventType = 'backdropClick' | 'close' | string | null;

export interface OverlayCloseEvent<D, T extends OverlayCloseEventType = OverlayCloseEventType> {
  type: T;
  data: D;
}
