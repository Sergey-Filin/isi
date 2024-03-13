import {InjectionToken} from '@angular/core';

export enum ControlStatus {
  valid,
  invalid
}
export class CustomFormError {
  constructor(public readonly key: string, public readonly value?: string | null) {
  }
}

export type CustomFormErrorFn = (
  value?: { [key: string]: string | number } | string | number | null
) => CustomFormError;

export interface CustomFormErrors {
  [key: string]: CustomFormErrorFn;
}

export const defaultErrors: CustomFormErrors = {
  required: () => new CustomFormError('This field is required'),
  validEmail: () => new CustomFormError('Please enter correct email address.'),
  validPassword: () => new CustomFormError('Your password must be at least eight characters at least one number and one letter'),
  validUniqueUserName: (message) => new CustomFormError(`${message}`),
  match: () => new CustomFormError('The specified passwords do not match.'),
};

export const FORM_ERRORS = new InjectionToken('FORM_ERRORS', {
  factory: () => defaultErrors,
});
