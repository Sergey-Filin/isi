import { AbstractControl } from "@angular/forms";
import { Observable, Subject } from "rxjs";

export type ArgumentsType<F> = F extends (...args: infer A) => any ? A : never;
type ObjectLike<O extends object, P extends keyof O = keyof O> = Pick<O, P>;

export const extractTouchedChanges = (
  control: ObjectLike<AbstractControl, 'markAsTouched' | 'markAsUntouched'>,
): Observable<boolean> => {
  const prevMarkAsTouched = control.markAsTouched;
  const prevMarkAsUntouched = control.markAsUntouched;

  const touchedChanges$ = new Subject<boolean>();

  function nextMarkAsTouched(...args: ArgumentsType<AbstractControl['markAsTouched']>) {
    prevMarkAsTouched.bind(control)(...args);
    touchedChanges$.next(true);
  }

  function nextMarkAsUntouched(...args: ArgumentsType<AbstractControl['markAsUntouched']>) {
    prevMarkAsUntouched.bind(control)(...args);
    touchedChanges$.next(false);
  }

  control.markAsTouched = nextMarkAsTouched;
  control.markAsUntouched = nextMarkAsUntouched;

  return touchedChanges$;
};
