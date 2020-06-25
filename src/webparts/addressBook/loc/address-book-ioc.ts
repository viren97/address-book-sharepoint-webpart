import { Container } from "react-inversify";
import { IAddressBookService } from "../interfaces/IAddressBookService";
import { AddressBookService } from "./../service/AddressBookService";

export let container = new Container();
container
  .bind<IAddressBookService>("AddressBookService")
  .to(AddressBookService);
