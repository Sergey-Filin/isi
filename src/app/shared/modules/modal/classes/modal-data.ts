import { InjectionToken } from "@angular/core";
import {ModalConfig} from "@modules/modal/interface/modal-config";

export const MODAL_DATA = new InjectionToken('ModalData');
export const MODAL_ADDITIONAL_CONFIG = new InjectionToken('ModalAdditionalConfig');
export const MODAL_CONFIG =  new InjectionToken<ModalConfig>('ModalConfig');
