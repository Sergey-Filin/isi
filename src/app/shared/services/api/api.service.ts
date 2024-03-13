import { Injectable } from '@angular/core';
import { Observable, of, throwError } from "rxjs";
import { Member } from "@shared/models";
import { MEMBER_LIST } from "../../../mock";

@Injectable()
export class ApiService {

   getMembers(): Observable<Member[]> {
     return of<Member[]>([...MEMBER_LIST]);
   }

   createMember(data: Member): Observable<string> {
     const member = {...data, id: MEMBER_LIST.length + 1}
     if(MEMBER_LIST.find(vl => vl?.userName === member?.userName)) return throwError(() => 'Username must be unique');
     MEMBER_LIST.push(member);
     return of('Success create member');
   }

   deleteMember(id: number): Observable<string> {
     if(!MEMBER_LIST.length) return of('You are crazy database is empty');
     const searchMemberIndex = MEMBER_LIST.findIndex(vl => vl?.id === id);
     if (searchMemberIndex !== -1) {
       MEMBER_LIST.splice(searchMemberIndex, 1);
     } else {
       return of('Member with request ID not found');
     }
     return of('Success delete member');
   }

   saveMember(data: Member): Observable<string> {
     let databaseMemberName: string;
     const searchMemberIndex = MEMBER_LIST.findIndex(vl => {
       const memberIndex = vl?.id === data?.id;
       if(memberIndex){
         databaseMemberName = vl?.userName;
         return memberIndex;
       }
       return false;
     });
     if(databaseMemberName &&
       databaseMemberName !== data?.userName &&
       MEMBER_LIST.find(vl => vl?.userName === data?.userName))
       return throwError(() => 'Username must be unique')
     if (searchMemberIndex !== -1) {
       MEMBER_LIST[searchMemberIndex] = {...MEMBER_LIST[searchMemberIndex], ...data}
       return of('Success changed member');
     }
     return of('Member with request ID not found');
   }
}
