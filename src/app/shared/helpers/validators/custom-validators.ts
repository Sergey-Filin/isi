import { AbstractControl, UntypedFormControl, ValidationErrors, ValidatorFn } from "@angular/forms";
import { EMAIL_PATTERN, PASSWORD_PATTERN } from "@helpers/pattern";

export class CustomValidators {
  static email(control: UntypedFormControl): null | any {
    const value = control.value;
    return !value || EMAIL_PATTERN.test(value) ? null : {validEmail: false};
  }

  static password(control: UntypedFormControl): null | any {
    return PASSWORD_PATTERN.test(control.value) ? null : {validPassword: false};
  }

  static uniqueUserName(message: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors => ({validUniqueUserName: message})
  }
}
