import { Injectable } from '@angular/core';
import { FormSelectComponent } from "@controls/form-select/components/form-select/form-select.component";

@Injectable()
export class FormSelectService {

  private select: FormSelectComponent;

  register(select: FormSelectComponent): void {
    this.select = select;
  }

  getSelect(): FormSelectComponent {
    return this.select;
  }
}
