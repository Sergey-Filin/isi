import {UntypedFormGroup} from '@angular/forms';

export function matchValidator(controlName: string, matchingControlName: string): any {
  return (formGroup: UntypedFormGroup) => {
    const control = formGroup.controls[controlName];
    const matchingControl = formGroup.controls[matchingControlName];

    if (
      matchingControl.errors &&
      !matchingControl.errors['mustMatch'] &&
      control.errors &&
      !control.errors['mustMatch']
    ) {
      return;
    }

    if (control.value !== matchingControl.value) {
      matchingControl.setErrors({match: false});
    } else {
      matchingControl.setErrors(null);
    }
  };
}
