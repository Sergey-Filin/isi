import { ChangeDetectionStrategy, Component, DestroyRef, Inject, inject, OnInit } from '@angular/core';
import { CustomOverlayRef, MODAL_DATA } from "@modules/modal/classes";
import { NgClass } from "@angular/common";
import { FormInputComponent } from "@controls/form-input/form-input.component";
import { FormSelectComponent } from "@controls/form-select/components/form-select/form-select.component";
import {
  FormSelectOptionComponent
} from "@controls/form-select/components/form-select-option/form-select-option.component";
import { ReactiveFormsModule, UntypedFormBuilder, Validators } from "@angular/forms";
import { CustomValidators } from "@helpers/validators";
import { matchValidator } from "@helpers/validators/math-valiadtors";
import { ModalActionService } from "@components/modal-action/services/modal-action.service";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { FormManager } from "@helpers/functions";
import { DropdownItem, Member, MemberAction, MemberForm, MemberType } from "@shared/models";
import { catchError, filter, of } from "rxjs";
import { ApiService } from "@services/api/api.service";
import { NotificationService } from "@modules/notification/services/notification.service";
import { MEMBER_TYPE } from "../../../../../static/member";

@Component({
  selector: 'app-modal-action',
  standalone: true,
  imports: [
    NgClass,
    FormInputComponent,
    FormSelectComponent,
    FormSelectOptionComponent,
    ReactiveFormsModule,

  ],
  providers: [ApiService, ModalActionService],
  templateUrl: './modal-action.component.html',
  styleUrl: './modal-action.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ModalActionComponent extends FormManager<MemberForm> implements OnInit {

  // readonly modalData: any = inject(MODAL_DATA);
  private readonly destroyRef = inject(DestroyRef);
  private readonly modalActionService = inject(ModalActionService);
  private readonly notificationService = inject(NotificationService);

  readonly memberTypes: DropdownItem<MemberType>[] = MEMBER_TYPE;

  constructor(
    override readonly fb: UntypedFormBuilder,
    @Inject(MODAL_DATA) public readonly modalData: Member | null,
    @Inject(CustomOverlayRef) private readonly overlayRef: CustomOverlayRef,
  ) {
    super(fb);
    this.initForm();
  }

  ngOnInit() {
    const modalData = this.modalData;
    if (modalData) {
      this.form.patchValue({
        id: modalData.id,
        userName: modalData.userName,
        firstName: modalData.firstName,
        lastName: modalData.lastName,
        email: modalData.email,
        type: modalData.type,
        password: modalData.password,
        passwordRepeat: modalData.passwordRepeat,
      });
    }
  }

  onCreate(): void {
    this.saveAndCreateForm();
  }

  onSave(): void {
    this.saveAndCreateForm();
  }

  onDelete(): void {
    this.overlayRef.close(this.modalData.id, MemberAction.delete);
  }

  private saveAndCreateForm(): void {
    const form = this.form;
    if (form.valid) {
      (
        this.modalData ? this.modalActionService.saveMember(this.form.getRawValue())
        :
        this.modalActionService.createMember(this.form.getRawValue())
      ).pipe(
        catchError(error => {
          this.toggleValidators('userName', [Validators.required])
          this.getControl('userName').setErrors({validUniqueUserName: error})
          this.notificationService.error(error, 2000)
          return of('')
        }),
        filter(Boolean),
        takeUntilDestroyed(this.destroyRef)
      ).subscribe(() => this.overlayRef.close({}))
    }
    form.markAllAsTouched();
  }

  private initForm(): void {
    const fb = this.fb;
    this.form = this.fb.group({
      id: this.fb.control(null),
      userName: this.fb.control(null, [Validators.required]),
      firstName: this.fb.control(null, [Validators.required]),
      lastName: this.fb.control(null, [Validators.required]),
      email: this.fb.control(null, [Validators.required, CustomValidators.email]),
      type: this.fb.control(null, [Validators.required]),
      password: this.fb.control(null, [Validators.required, CustomValidators.password]),
      passwordRepeat: this.fb.control(null, [Validators.required, CustomValidators.password]),
    }, {validators: matchValidator('password', 'passwordRepeat')});
  }

}
