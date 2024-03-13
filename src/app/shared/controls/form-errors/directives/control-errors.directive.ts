import {
  ChangeDetectorRef,
  ComponentRef,
  Directive,
  EventEmitter,
  Inject,
  Input,
  OnDestroy,
  OnInit,
  Optional,
  Output,
  ViewContainerRef
} from "@angular/core";
import { ControlErrorComponent } from "@controls/form-errors/components/control-error/control-error.component";
import { merge, startWith, Subject, takeUntil } from "rxjs";
import { ControlStatus, CustomFormError, CustomFormErrors, FORM_ERRORS } from "@controls/form-errors/form-errors";
import { AbstractControl, NgControl } from "@angular/forms";
import { extractTouchedChanges } from "@helpers/functions";

@Directive({
  selector: '[appControlErrors]',
  standalone: true,
})
export class ControlErrorsDirective implements OnInit, OnDestroy {
  private ref: ComponentRef<ControlErrorComponent>;
  private readonly destroyStream$ = new Subject<void>();

  @Input() hideErrors = false;

  @Output() status = new EventEmitter<ControlStatus>();

  constructor(
    private readonly vcr: ViewContainerRef,
    @Optional() private readonly control: NgControl,
    @Inject(FORM_ERRORS) private readonly errors: CustomFormErrors,
    private cdr: ChangeDetectorRef,
  ) {
  }

  ngOnInit(): void {
    this.checkStatusOrTouchedChanges();
  }

  ngOnDestroy(): void {
    const destroy = this.destroyStream$;
    destroy.next();
    destroy.complete();
    const ref = this.ref;
    if (ref) {
      ref.destroy();
    }
  }

  private checkStatusOrTouchedChanges(): void {
    //TODO why is it only in this application that there is such a problem and the code fires earlier than asynchronous validation
    // why in this application???
    // https://github.com/angular/angular/issues/14542#issuecomment-378584574
    const control = this.control;
    setTimeout(() => {
    if (control && control.statusChanges) {
      merge(
        control.statusChanges.pipe(startWith(control.status)),
        extractTouchedChanges(control.control as AbstractControl),
      )
        .pipe(takeUntil(this.destroyStream$))
        .subscribe(() => {
          this.toggleErrorContainer();
          if (control.control) {
            control.control.markAsDirty();
            this.cdr.detectChanges();
          }
        });
    }
    })
  }

  private toggleErrorContainer(): void {
    if (this.hideErrors) {
      return;
    }
    const controlErrors = this.control.errors;
    if (controlErrors && (this.control.touched || !this.control.pristine)) {
      const firstValue = Object.keys(controlErrors)[0];
      const getError = this.errors[firstValue];
      if (!getError) {
        return;
      }
      const error = getError(controlErrors[firstValue]);
      this.setError(error);
      this.status.emit(ControlStatus.invalid);
    } else if (this.ref) {
      this.setError(null);
      this.status.emit(ControlStatus.valid);
    }
  }

  private setError(text: CustomFormError | null): void {
    if (!this.ref) {
      this.ref = this.vcr.createComponent(ControlErrorComponent);
    }
    this.ref.instance.error = text;
  }
}
