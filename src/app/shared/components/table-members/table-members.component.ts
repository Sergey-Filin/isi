import { ChangeDetectionStrategy, Component, EventEmitter, input, InputSignal, Output } from '@angular/core';
import { Member } from "@shared/models";

@Component({
  selector: 'app-table-members',
  standalone: true,
  imports: [],
  templateUrl: './table-members.component.html',
  styleUrl: './table-members.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TableMembersComponent {

  data$:InputSignal<Member[]> = input();
  @Output() member = new EventEmitter<Member>();

  readonly tableHeadData = ['USERNAME', 'FIRST NAME', 'LAST NAME', 'EMAIL', 'TYPE'];

  onEditMember(member: Member): void {
    this.member.emit(member);
  }
}
