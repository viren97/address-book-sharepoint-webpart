import { IAddressItem } from "../../interfaces/IAddressItem";
import * as React from "react";
import { Link, NavLink, withRouter } from "react-router-dom";
import { IAddressBookService } from "../../interfaces/IAddressBookService";
import { injectable, inject, connect } from "react-inversify";
import { SPHttpClient, SPHttpClientResponse } from "@microsoft/sp-http";
import { handleError } from "../../exception/exception";
import { componentList } from "../../constants/constants";
import styles from "./../AddressBook.module.scss";
interface ItemProps {
  item: IAddressItem;
  isSeleted?: boolean;
}

class Item extends React.Component<ItemProps, {}> {
  constructor(props) {
    super(props);
  }

  render() {
    console.log(this.props.item);
    return (
      <NavLink
        to={"/" + this.props.item.Id}
        isActive={(match, location) => {
          console.log("M : ", match);
          console.log("L : ", location);

          const path: string = location.pathname;
          const id: number = parseInt(path.substr(path.lastIndexOf("/") + 1));
          return id != undefined && id === this.props.item.Id;
        }}
        activeClassName={styles.active}
      >
        <span>{this.props.item.FullName}</span>
        <span>{this.props.item.Email}</span>
        <span>{this.props.item.CellPhone}</span>
      </NavLink>
    );
  }
}

interface IListState {
  contacts: Array<IAddressItem>;
}
interface IListProps {
  spHttpClient: SPHttpClient;
  siteUrl: string;
  setStatus: Function;
  IsStateSetFromGetByList: boolean;
}
interface IListDependenciesProps {
  AddressBookService: IAddressBookService;
}

@injectable()
class Dependencies {
  @inject("AddressBookService")
  public readonly AddressBookService: IAddressBookService;
}

export class List extends React.Component<
  IListProps & IListDependenciesProps,
  IListState
> {
  constructor(props) {
    super(props);

    this.state = {
      contacts: new Array<IAddressItem>(),
    };
  }
  componentDidMount() {
    const {
      AddressBookService,
      IsStateSetFromGetByList,
      setStatus,
      spHttpClient,
      siteUrl,
    } = this.props;
    AddressBookService.GetAll(spHttpClient, siteUrl)
      .then((res) => {
        this.setState({ contacts: res });
      })
      .catch((err) => {
        if (!IsStateSetFromGetByList)
          handleError(err, setStatus, componentList);
      });
  }
  componentWillReceiveProps(nextProps) {
    const {
      AddressBookService,
      IsStateSetFromGetByList,
      setStatus,
      spHttpClient,
      siteUrl,
    } = this.props;
    AddressBookService.GetAll(spHttpClient, siteUrl)
      .then((res) => {
        this.setState({ contacts: res });
      })
      .catch((err) => {
        if (!IsStateSetFromGetByList)
          handleError(err, setStatus, componentList);
      });
  }
  public render() {
    let { contacts } = this.state;
    var items = [] as any;
    for (var i: number = 0; i < contacts.length; i++) {
      items.push(
        <li key={contacts[i].Id}>
          <Item item={contacts[i]} />
        </li>
      );
    }

    return (
      <div className={styles.contactList}>
        <label>CONTACTS</label>
        <div>
          <ul>{...items}</ul>
        </div>
      </div>
    );
  }
}
export default connect(Dependencies, (deps, ownProps: IListProps) => ({
  AddressBookService: deps.AddressBookService,
  spHttpClient: ownProps.spHttpClient,
  siteUrl: ownProps.siteUrl,
  setStatus: ownProps.setStatus,
}))(withRouter(List));
