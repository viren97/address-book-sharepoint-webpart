import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';

import * as strings from 'AddressBookWebPartStrings';
import AddressBook from './components/AddressBook';
import { IAddressBookProps } from './components/IAddressBookProps';
export interface IAddressBookWebPartProps {
  
}

export default class AddressBookWebPart extends BaseClientSideWebPart <IAddressBookWebPartProps> {

  public render(): void {
    const element: React.ReactElement<IAddressBookProps> = React.createElement(
      AddressBook, {
        spHttpClient: this.context.spHttpClient,
        siteUrl:this.context.pageContext.web.absoluteUrl
      }
    );
    ReactDom.render(element, this.domElement);
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

}
