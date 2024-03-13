import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-forbidden',
  standalone: true,
  imports: [],
  templateUrl: './forbidden.component.html',
  styleUrl: './forbidden.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ForbiddenComponent {

}
