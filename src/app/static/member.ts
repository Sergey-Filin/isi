import { DropdownItem, MemberType } from "@shared/models";

export const MEMBER_TYPE: DropdownItem<MemberType>[] = [
  new DropdownItem('Administrator', MemberType.administrator),
  new DropdownItem('Driver', MemberType.driver),
];
