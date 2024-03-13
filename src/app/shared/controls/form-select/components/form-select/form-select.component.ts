import {
  AfterViewInit,
  ChangeDetectionStrategy, ChangeDetectorRef,
  Component, ContentChildren, ElementRef, EventEmitter,
  forwardRef, Input, NgZone,
  OnChanges,
  OnDestroy,
  OnInit, Output, QueryList, SimpleChanges, ViewChild, ViewEncapsulation
} from '@angular/core';
import { ControlErrorsDirective } from "@controls/form-errors/directives/control-errors.directive";
import { NgIf } from "@angular/common";
import { FormSelectService } from "@controls/form-select/services/form-select.service";
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";
import { BooleanInput, coerceBooleanProperty } from "@angular/cdk/coercion";
import { ControlStatus } from "@controls/form-errors/form-errors";
import {
  FormSelectOptionComponent
} from "@controls/form-select/components/form-select-option/form-select-option.component";
import { startWith, Subject, takeUntil } from "rxjs";
import { DropdownComponent } from "@controls/dropdown/dropdown.component";
import { FocusMonitor } from "@angular/cdk/a11y";
import { DropdownItem } from "@shared/models";

@Component({
  selector: 'app-form-select',
  standalone: true,
  imports: [
    ControlErrorsDirective,
    NgIf,
    DropdownComponent
  ],
  templateUrl: './form-select.component.html',
  styleUrl: './form-select.component.scss',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    FormSelectService,
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FormSelectComponent),
      multi: true,
    },
  ],
})
export class FormSelectComponent<T = any> implements OnInit, OnChanges, ControlValueAccessor, AfterViewInit, OnDestroy {

  values: DropdownItem<any>[];

  @Input() hint = '';
  @Input() label = '';
  @Input() placeholder = '';
  @Input() disabled = false;
  @Input() minWidth: number;
  @Input() multiple = false;
  @Input() dropdownClass: string | null = null;

  @Input()
  set required(isRequired: BooleanInput) {
    this.isRequired = coerceBooleanProperty(isRequired);
  }

  get required(): boolean {
    return this.isRequired;
  }

  @Input()
  set selectedValue(value: T | T[]) {
    if (this.selectedKey !== value) {
      this.selectedKey = value;
      this.compareAndSelect();
    }
  }

  @Output() selectionChange = new EventEmitter<T>();

  isRequired = false;
  value = '';
  status: ControlStatus = ControlStatus.valid;
  focused = false;
  private selectedKey: T | T[];
  private selectionModel: FormSelectOptionComponent[] | FormSelectOptionComponent | null = null;
  private readonly destroyStream$ = new Subject<void>();
  private compareWithFn = (o1: any, o2: any): boolean => o1 === o2;

  get selected(): FormSelectOptionComponent[] | FormSelectOptionComponent | null {
    return this.selectionModel || (this.multiple ? [] : null);
  }

  set selected(model: FormSelectOptionComponent[] | FormSelectOptionComponent | null) {
    this.selectionModel = model;
  }

  get selectedValues(): any {
    const selected = this.selected;
    if (Array.isArray(selected)) {
      return selected.map(item => item.value);
    }
    return selected && selected.value;
  }

  get selectedOption(): FormSelectOptionComponent | null {
    const selected = this.selected;
    if (Array.isArray(selected)) {
      return selected?.length ? selected[0] : null;
    }
    return selected || null;
  }

  private get displayedContent(): string {
    const selected = this.selected;
    if (Array.isArray(selected)) {
      return selected.map(item => item.displayedContent).join(', ');
    }
    return selected && selected.displayedContent || '';
  }

  private get optionsArray(): FormSelectOptionComponent[] {
    const options = this.options;
    if (!options) {
      return [];
    }
    return options.toArray();
  }

  @Input()
  get compareWith() {
    return this.compareWithFn;
  }

  set compareWith(fn: (o1: any, o2: any) => boolean) {
    if (typeof fn !== 'function') {
      return;
    }
    this.compareWithFn = fn;
  }

  @ViewChild('selectInput', {static: true}) selectInput: ElementRef<HTMLElement>;
  @ViewChild('dropdownComp', {static: true}) dropdown: DropdownComponent;
  @ViewChild('optionsContainer', {static: true}) optionsContainer: ElementRef<HTMLElement>;
  @ContentChildren(FormSelectOptionComponent, {descendants: true}) options: QueryList<FormSelectOptionComponent>;

  constructor(
    private readonly selectService: FormSelectService,
    private readonly cdr: ChangeDetectorRef,
    private readonly focusMonitor: FocusMonitor,
    private readonly zone: NgZone,
  ) {
    this.selectService.register(this);
  }

  ngOnChanges(changes: SimpleChanges): void {
    const valuesChanges = changes && changes['selectedValues'];
    if (!valuesChanges) {
      return;
    }
    this.values = this.selectedValues;
  }

  ngOnInit(): void {
    this.focusMonitor.monitor(this.selectInput).pipe(
      takeUntil(this.destroyStream$),
    ).subscribe(origin => {
      this.zone.run(() => {
        if (this.dropdown.showing && !!origin) {
          this.dropdown.hide();
        }
        this.focused = !!origin;
      });
    });
  }

  ngAfterViewInit() {
    const options = this.options;
    options.changes.pipe(
      startWith(options),
      takeUntil(this.destroyStream$),
    ).subscribe(() => {
      this.compareAndSelect();
    });
  }

  ngOnDestroy() {
    this.focusMonitor.stopMonitoring(this.selectInput);
    this.destroyStream$.next();
    this.destroyStream$.complete();
  }

  onChangeStatus(event: ControlStatus): void {
    if (this.status !== event) {
      this.status = event;
    }
  }

  showDropdown(event: MouseEvent | null = null) {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    if (!this.options.length || this.disabled) {
      return;
    }
    this.dropdown.toggle();
    const option = this.selectedOption;
    setTimeout(() => this.setOptionListPosition(option));
  }

  setSelectedOption(option: FormSelectOptionComponent): void {
    this.updateSelectionModel(option);
    if (!this.multiple) {
      this.dropdown.hide();
    }
    this.updateSelection();
    this.onTouched();
  }

  onChange() {
    this.onChangeFn(this.selectedValues);
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

  writeValue(value: any): void {
    this.selectedKey = value;
    this.compareAndSelect();
  }

  private compareAndSelect(): void {
    const options = this.options;
    if (!options) {
      return;
    }
    const key = this.selectedKey;
    if (key === null || key === undefined) {
      this.value = '';
      this.selected = null;
      this.updateSelection();
      this.cdr.detectChanges();
      return;
    }
    const selected = Array.isArray(key) ? this.filterSelectedOptions(key) : this.findSelectedOption(key);
    if (!selected) {
      this.value = '';
      this.selected = null;
      this.cdr.detectChanges();
      return;
    }
    if (Array.isArray(selected)) {
      this.selected = selected;
      this.updateSelection();
      this.value = this.displayedContent;
      this.cdr.detectChanges();
      return;
    }
    this.updateSelectionModel(selected, false);
    this.updateSelection();
    this.cdr.detectChanges();
  }

  private updateSelection(): void {
    const selected = this.selected;
    const value = Array.isArray(selected) ? selected : !!selected ? [selected] : null;
    this.optionsArray.forEach(option => {
      option.selectedOption = value?.some(s => s.value === option.value) || false;
    });
  }

  private findSelectedOption(value: T): FormSelectOptionComponent | null {
    return this.optionsArray.find(option => option.value !== null && this.compareWithFn(option.value, value)) || null;
  }

  private filterSelectedOptions(values: T[]): FormSelectOptionComponent[] {
    return this.optionsArray.filter(option =>
      option.value !== null && values.find(item => this.compareWithFn(option.value, item)),
    );
  }

  private updateSelectionModel(option: FormSelectOptionComponent, emitEvent = true): void {
    const selected = this.selected;
    this.selected = this.multiple && Array.isArray(selected) ? this.updateOptions(option, selected) : option;
    this.value = this.displayedContent;
    if (this.selectedKey !== option.value) {
      this.selectedKey = option.value;
      this.selectionChange.emit(option.value);
    }
    if (emitEvent) {
      this.onChange();
    }
    this.cdr.detectChanges();
  }

  private updateOptions(option: FormSelectOptionComponent, options: FormSelectOptionComponent[]): FormSelectOptionComponent[] {
    const index = options.findIndex(item => item.value === option.value);
    if (index >= 0) {
      options.splice(index, 1);
      return [...options];
    }
    return [...options, option];
  }

  private setOptionListPosition(option: FormSelectOptionComponent | null) {
    const active = this.optionsContainer.nativeElement.querySelector('.selected') as HTMLElement;
    const top = active ? active.offsetTop : 0;
    this.optionsContainer.nativeElement.scrollTop = option ? top : 0;
  }

  onTouched() {
    this.onTouchedFn();
  }

  private onChangeFn = (value: any) => {
  };
  private onTouchedFn = () => {
  };
}
