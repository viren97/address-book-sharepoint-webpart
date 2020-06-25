import { IAddressBookService } from "../interfaces/IAddressBookService";
import { IAddressItem } from "../interfaces/IAddressItem";
import {
  SPHttpClient,
  SPHttpClientResponse,
  ODataVersion,
  ISPHttpClientOptions,
  SPHttpClientConfiguration,
} from "@microsoft/sp-http";
import { injectable } from "react-inversify";
import { listName } from "./../constants/constants";
import { AddressItem } from "../models/AddressItem";
import { ListItem } from "./../models/ListItem";
import { ODataResponseKeys } from "../Enum/EODataResponse";
const siteURL = "https://accessoffice97.sharepoint.com/sites/office";
@injectable()
export class AddressBookService implements IAddressBookService {
  public GetById = (
    id: number,
    spHttpClient: SPHttpClient,
    u: string
  ): Promise<IAddressItem> => {
    const Url = `${siteURL}/_api/web/lists/getbytitle('${listName}')/items('${id}')`;
    return spHttpClient
      .get(Url, SPHttpClient.configurations.v1)
      .then((res: SPHttpClientResponse) => {
        if (!res.ok)
          throw new Error(
            "Serve Response Error : " + res.statusText + "(" + res.status + ")"
          );
        return res.json();
      })
      .then(
        (res): IAddressItem => {
          console.log(res);
          const listItem: IAddressItem = new AddressItem();

          listItem.FullName = res[ODataResponseKeys.FullName];
          listItem.Email = res[ODataResponseKeys.Email];
          listItem.CellPhone = res[ODataResponseKeys.CellPhone];
          listItem.Id = parseInt(res[ODataResponseKeys.ID]);
          listItem.Address = res[ODataResponseKeys.Address];
          listItem.Website = res[ODataResponseKeys.Website];
          return listItem;
        }
      );
  };
  public Create = (
    contact: IAddressItem,
    shttpClient: SPHttpClient,
    siteURL: string
  ): Promise<IAddressItem> => {
    const Url = `${siteURL}/_api/web/lists/getbytitle('Address Book')/items`;

    let body: string = JSON.stringify({
      FullName: contact.FullName,
      Email: contact.Email,
      CellPhone: contact.CellPhone,
      Address: contact.Address,
      Website: contact.Website,
    });
    const options: ISPHttpClientOptions = {
      body: body,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    };
    return shttpClient
      .post(Url, SPHttpClient.configurations.v1, options)
      .then((res: SPHttpClientResponse) => {
        debugger;
        if (!res.ok) throw new Error("Cannot Add Item . . .");
        console.log("Item : ", res);
        return res.json();
      })
      .then((res) => {
        contact.Id = parseInt(res[ODataResponseKeys.ID]);
        return contact;
      });
  };
  public Update = (
    contact: IAddressItem,
    shttpClient: SPHttpClient,
    siteURL: string
  ): Promise<IAddressItem> => {
    const Url: string = `${siteURL}/_api/web/lists/getbytitle('Address Book')/items(${contact.Id})`;
    console.log(Url);
    let body: string = JSON.stringify({
      Id: contact.Id,
      FullName: contact.FullName,
      Email: contact.Email,
      CellPhone: contact.CellPhone,
      Address: contact.Address,
      Website: contact.Website,
    });
    const options: ISPHttpClientOptions = {
      body: body,
      method: "PATCH",
      headers: {
        "X-Http-Method": "MERGE",
        "If-Match": "*",
        "content-type": "application/json",
        accept: "application/json",
      },
    };
    return shttpClient
      .fetch(Url, SPHttpClient.configurations.v1, options)
      .then((res: SPHttpClientResponse) => {
        debugger;
        console.log("Update Response : ", res);
        if (!res.ok)
          throw new Error(
            `Serve Response Error : ${res.statusText}(${res.status})`
          );
        return contact;
      });
  };
  public Delete = (
    id: number,
    shttpClient: SPHttpClient,
    siteURL: string
  ): Promise<boolean> => {
    const Url: string = `${siteURL}/_api/web/lists/getbytitle('${listName}')/items('${id}')`;
    debugger;
    return shttpClient
      .post(Url, SPHttpClient.configurations.v1, {
        headers: {
          "X-HTTP-Method": "DELETE",
          "If-Match": "*",
        },
      })
      .then((res: SPHttpClientResponse): boolean => {
        if (!res.ok) return false;
        return true;
      });
  };
  public GetAll = (
    shttpClient: SPHttpClient,
    siteURL: string
  ): Promise<IAddressItem[]> => {
    const Url = `${siteURL}/_api/web/lists/getbytitle('${listName}')/items`;
    return shttpClient
      .get(Url, SPHttpClient.configurations.v1)
      .then((res: SPHttpClientResponse) => {
        console.log("Get All response : ", res);
        if (!res.ok) throw new Error("Serve Response Error : " + res.status);
        return res.json();
      })
      .then((response): IAddressItem[] => {
        console.log(response);
        const { value: results } = response;

        let listItemArray: Array<IAddressItem> = new Array<AddressItem>();
        results.forEach((res, index) => {
          let listItem: IAddressItem = new AddressItem();
          listItem.FullName = res[ODataResponseKeys.FullName];
          listItem.Email = res[ODataResponseKeys.Email];
          listItem.CellPhone = res[ODataResponseKeys.CellPhone];
          listItem.Id = parseInt(res[ODataResponseKeys.ID]);
          listItem.Address = res[ODataResponseKeys.Address];
          listItem.Website = res[ODataResponseKeys.Website];

          listItemArray.push(listItem);
        });
        return listItemArray;
      });
  };
}
