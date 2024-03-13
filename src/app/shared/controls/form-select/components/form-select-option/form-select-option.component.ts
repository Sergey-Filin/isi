import {
  AfterViewInit,
  ChangeDetectionStrategy, ChangeDetectorRef,
  Component,
  ElementRef,
  HostBinding, HostListener,
  Input,
  OnInit,
  ViewChild
} from '@angular/core';
import { NgTemplateOutlet } from "@angular/common";
import { FormSelectComponent } from "@controls/form-select/components/form-select/form-select.component";
import { FormSelectService } from "@controls/form-select/services/form-select.service";

@Component({
  selector: 'app-form-select-option',
  standalone: true,
  imports: [
    NgTemplateOutlet
  ],
  templateUrl: './form-select-option.component.html',
  styleUrl: './form-select-option.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FormSelectOptionComponent implements OnInit, AfterViewInit {

  static nextId = 0;
  readonly id = `select-option-${FormSelectOptionComponent.nextId++}`;

  @Input() value: any;
  @Input() display = '';
  @Input() notSelectable = false;

  @Input() isSelected = false;

  @Input() disabled = false;

  multiple = false;

  set selectedOption(val) {
    if (this.isSelected === val) {
      return;
    }
    this.isSelected = val;
    this.cdr.markForCheck();
  };

  get selectedOption() {
    return this.isSelected;
  };

  displayedContent: string;
  private select: FormSelectComponent;

  @ViewChild('option') option: ElementRef<HTMLElement>;

  @HostBinding('class.selected')
  get selected(): boolean {
    return this.selectedOption;
  }

  @HostBinding('class.disabled')
  get disableState(): boolean {
    return this.disabled;
  }

  constructor(
    private readonly formSelectService: FormSelectService,
    public readonly elRef: ElementRef<HTMLElement>,
    public readonly cdr: ChangeDetectorRef,
  ) {
    this.select = this.formSelectService.getSelect();
  }

  ngOnInit() {
    this.multiple = this.select.multiple;
  }

  ngAfterViewInit(): void {
    this.setDisplayedValue();
  }

  private setDisplayedValue(): void {
    const option = this.option;
    const nativeElement = option && option.nativeElement;
    const innerText = nativeElement && nativeElement.innerText;
    this.displayedContent = this.display ? `${this.display}` : innerText && innerText.trim();
  }

  getLabel(): string {
    return this.value;
  }

  setHiddenStyles(val: boolean): void {
    const ref = this.elRef.nativeElement;
    if (!ref) {
      return;
    }
    if (val) {
      ref.classList.add('hidden-option');
      return;
    }
    ref.classList.remove('hidden-option');
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  @HostListener('click', ['$event'])
  onClick(event: UIEvent) {
    event.preventDefault();
    event.stopPropagation();
    if (this.disabled) {
      return;
    }
    if (this.notSelectable) {
      return;
    }
    this.select.setSelectedOption(this);
  }
}
