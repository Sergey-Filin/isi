import { inject, Injectable } from '@angular/core';
import { ApiService } from "@services/api/api.service";
import { Observable } from "rxjs";
import { Member } from "@shared/models";

@Injectable()
export class HomeService {

  private readonly api = inject(ApiService);

  getMembers(): Observable<Member[]> {
    return this.api.getMembers();
  }

  deleteMember(id: number): Observable<string> {
    return this.api.deleteMember(id);
  }

}
