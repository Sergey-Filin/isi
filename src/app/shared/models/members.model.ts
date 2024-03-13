export class Member {
  constructor(
    readonly userName: string,
    readonly firstName: string,
    readonly lastName: string,
    readonly email: string,
    readonly type: string,
    readonly id?: number,
    readonly password?: string,
    readonly passwordRepeat?: string,
  ) {
  }
}

export interface MemberForm {
  readonly userName: number | null;
  readonly firstName: string;
  readonly lastName: string;
  readonly email: string | null;
  readonly type: string | null;
  readonly password: string | null;
  readonly passwordRepeat: string | null;
}

export class DropdownItem<T> {
  constructor(
    public readonly title: string,
    public readonly value: T,
  ) {
  }
}

export enum MemberType {
  administrator = 'Administrator',
  driver = 'Driver',
}

export enum MemberAction {
  delete= 'delete'
}
