import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";
import {
  ChangeDetectionStrategy, ChangeDetectorRef,
  Component,
  ElementRef,
  forwardRef,
  Input,
  OnChanges,
  SimpleChanges,
  ViewChild
} from "@angular/core";
import { ControlStatus } from "@controls/form-errors/form-errors";
import { ControlErrorsDirective } from "@controls/form-errors/directives/control-errors.directive";
import { NgIf } from "@angular/common";

export type InputType = 'text' | 'number' | 'password' | 'email' | 'tel' | 'url';
export type InputMode = 'text' | 'numeric' | 'decimal' | 'email' | 'tel' | 'url' | 'search';

@Component({
  selector: 'app-form-input',
  templateUrl: './form-input.component.html',
  styleUrl: './form-input.component.scss',
  standalone: true,
  imports: [
    ControlErrorsDirective,
    NgIf,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FormInputComponent),
      multi: true,
    },
  ],
})
export class FormInputComponent implements OnChanges, ControlValueAccessor {

  value: any;
  status = false;

  @Input() label = '';
  @Input() hint = '';
  @Input() placeholder = '';
  @Input() disabled = false;
  @Input() required = false;
  @Input() readonly = false;
  @Input() type: InputType = 'text';
  @Input() inputMode: InputMode = 'text';
  @Input() autocomplete: string | null = null;
  @Input() prefix: boolean;

  @ViewChild('formInput', {static: true}) formInput: ElementRef;

  private onChangeFn = (value: any) => {
  };
  private onTouchedFn = () => {
  };

  constructor(
    private readonly cdr: ChangeDetectorRef,
  ) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    const typeChanges = changes && changes['type'];
    if (typeChanges) {
      this.setInputValue('type', this.type);
    }
  }

  onChangeStatus(event: ControlStatus): void {
    if (this.status !== !!event) {
      this.status = !!event;
    }
  }

  onChangeValue(event: any): void {
    const value = event.target && event.target.value;
    this.onChange(value);
  }

  registerOnChange(fn: any): void {
    this.onChangeFn = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouchedFn = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
    this.cdr.detectChanges();
  }

  writeValue(value: string): void {
    this.value = value || '';
    this.setInputValue('value', this.value);
  }

  onTouched(): void {
    this.onTouchedFn();
  }

  onChange(value): void {
    this.onChangeFn(value);
  }

  private setInputValue(key: keyof HTMLInputElement, value: string | number): void {
    const input = this.formInput.nativeElement;
    if (!input) {
      return;
    }
    input[key] = value.toString();
  }
}
