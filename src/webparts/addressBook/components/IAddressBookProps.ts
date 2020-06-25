import { SPHttpClient } from '@microsoft/sp-http'; 
export interface IAddressBookProps {
  spHttpClient: SPHttpClient;
  siteUrl: string;  
  history: any;
  match: any; location: any;
}
