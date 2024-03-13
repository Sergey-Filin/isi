import { Directive } from "@angular/core";
import { AbstractControl, UntypedFormBuilder, UntypedFormGroup, ValidatorFn } from "@angular/forms";

@Directive()
export abstract class FormManager<T> {

  form: UntypedFormGroup;

  protected constructor(protected readonly fb: UntypedFormBuilder) {
  }

  get formInstance(): UntypedFormGroup {
    const form = this.form;
    if (!form) {
      throw new Error('Form instance is not provided');
    }
    return form;
  }

  getControl<T>(controlName: string): AbstractControl<T> {
    const control = this.formInstance.get(controlName);
    if (!control) {
      throw new Error(`Control "${controlName}" not found`);
    }
    return control;
  }

  toggleValidators(controlName: string, validators: ValidatorFn | ValidatorFn[] | null, emitEvent = true) {
    const control = this.getControl(controlName);
    control.setValidators(validators || []);
    control.updateValueAndValidity({emitEvent});
  }
}
