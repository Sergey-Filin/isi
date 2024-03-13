import { inject, Injectable } from '@angular/core';
import { Member } from "@shared/models";
import { Observable } from "rxjs";
import { ApiService } from "@services/api/api.service";

@Injectable()
export class ModalActionService {

  private readonly api = inject(ApiService);

  createMember(data: Member): Observable<string> {
    return this.api.createMember(data);
  }

  saveMember(data: Member): Observable<any> {
    return this.api.saveMember(data);
  }
}
