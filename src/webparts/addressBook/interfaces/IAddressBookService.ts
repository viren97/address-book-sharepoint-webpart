import { IAddressItem } from "./IAddressItem";
import { SPHttpClient, SPHttpClientResponse } from "@microsoft/sp-http";

export interface IAddressBookService {
  Create: (
    contact: IAddressItem,
    shttpClient: SPHttpClient,
    siteURL: string
  ) => Promise<IAddressItem>;
  Update: (
    contact: IAddressItem,
    shttpClient: SPHttpClient,
    siteURL: string
  ) => Promise<IAddressItem>;
  Delete: (
    id: number,
    shttpClient: SPHttpClient,
    siteURL: string
  ) => Promise<boolean>;
  GetAll: (
    shttpClient: SPHttpClient,
    siteURL: string
  ) => Promise<IAddressItem[]>;
  GetById: (
    id: number,
    spHttpClient: SPHttpClient,
    siteURL: string
  ) => Promise<IAddressItem>;
}
