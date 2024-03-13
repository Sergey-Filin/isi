import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject, OnDestroy,
  Signal
} from '@angular/core';
import { ModalModule, OverlayService } from "@modules/modal";
import { ModalActionComponent } from "@components/modal-action/components/modal-action/modal-action.component";
import { takeUntilDestroyed, toSignal } from "@angular/core/rxjs-interop";
import { NotificationModule } from "@modules/notification";
import { filter, of, startWith, Subject, switchMap, take } from "rxjs";
import { TableMembersComponent } from "@components/table-members/table-members.component";
import { HomeService } from "../../services/home.service";
import { ApiService } from "@services/api/api.service";
import { Member, MemberAction } from "@shared/models";
import { AsyncPipe, JsonPipe } from "@angular/common";
import { NotificationService } from "@modules/notification/services/notification.service";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ModalModule, NotificationModule, TableMembersComponent, AsyncPipe, JsonPipe],
  providers: [ApiService, HomeService],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent implements OnDestroy {

  private readonly overlayService: OverlayService = inject(OverlayService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly homeService = inject(HomeService);
  private readonly updateMembers = new Subject<void>();
  private readonly notificationService = inject(NotificationService);
  readonly members$: Signal<Member[]> = toSignal(this.updateMembers.asObservable().pipe(
    startWith({}),
    switchMap(() => this.homeService.getMembers()),
  )
  );

  onEditMember(member: Member): void {
    this.openModal(member)
  }

  ngOnDestroy() {
    this.updateMembers.complete();
  }

  creteMember():void {
    this.openModal();
  }

  private openModal(member?: Member) {
    this.overlayService.open(ModalActionComponent, member || null, {
      panelClass: 'modal-action-wrap',
    }).afterClosed$.pipe(
      take(1),
      switchMap(vl => {
        if(vl?.type === MemberAction.delete) return this.homeService.deleteMember(vl.data);
        return of(vl?.data);
      }),
      filter(Boolean),
      takeUntilDestroyed(this.destroyRef),
    ).subscribe(vl=> {
      this.notificationService.success('The member list changed');
      this.updateMembers.next();
    })
  }

}
