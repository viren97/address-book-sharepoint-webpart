import { IAddressItem } from "../interfaces/IAddressItem";

export class AddressItem implements IAddressItem {
  public Id: number;
  public FullName: string;
  public Email: string;
  public CellPhone: string;
  public Address: string;
  public Website: string;
  public constructor() {
    this.Id = 0;
    this.CellPhone = "";
    this.Email = "";
    this.FullName = "";
    this.Website = "";
  }
}
