import * as React from "react";
import { Redirect, withRouter } from "react-router-dom";
import Edit from "./../../assets/edit.jpg";
import Delete from "../../assets/delete.png";
import { IAddressItem } from "../../interfaces/IAddressItem";
import { injectable, inject, connect } from "react-inversify";
import { IAddressBookService } from "../../interfaces/IAddressBookService";
import { SPHttpClient, SPHttpClientResponse } from "@microsoft/sp-http";
import { AddressItem } from "../../models/AddressItem";
import { handleError } from "../../exception/exception";
import {
  componentDisplay,
  errorClass,
  remove,
  removeFinalDescription,
} from "../../constants/constants";
import styles from "../AddressBook.module.scss";

interface ITableProps {
  contact: IAddressItem;
  history: any;
}

export class Table extends React.Component<ITableProps, {}> {
  render() {
    const { contact } = this.props;
    return (
      <div className={styles.infoTable}>
        <table>
          <tbody>
            <tr>
              <td className={styles.fixedField}>Email</td>
              <td>:</td>
              <td>{this.props.contact.Email || ""}</td>
            </tr>
            <tr>
              <td className={styles.fixedField}>Mobile</td>
              <td>:</td>
              <td>{this.props.contact.CellPhone || ""}</td>
            </tr>
            <tr>
              <td className={styles.fixedField}>Website</td>
              <td>:</td>
              <td>{this.props.contact.Website}</td>
            </tr>
            <tr>
              <td rowSpan={4} className={styles.fixedField}>
                Address
              </td>
              <td rowSpan={4}>:</td>
              <td rowSpan={4}>{this.props.contact.Address}</td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
}

interface IDisplayDependenciesProps {
  AddressBookService: IAddressBookService;
}
@injectable()
class Dependencies {
  @inject("AddressBookService")
  public readonly AddressBookService: IAddressBookService;
}

interface IDisplayProps {
  history: any;
  match: any;
  siteUrl: string;
  spHttpClient: SPHttpClient;
  setStatus: Function;
  IsStateSetFromGetByDisplay: boolean;
}

interface IDisplayState {
  contact: IAddressItem;
}

class Display extends React.Component<
  IDisplayProps & IDisplayDependenciesProps,
  IDisplayState
> {
  constructor(props) {
    super(props);
    this.state = {
      contact: new AddressItem(),
    };
  }
  componentDidMount() {
    const {
      match,
      AddressBookService,
      spHttpClient,
      siteUrl,
      setStatus,
      IsStateSetFromGetByDisplay,
    } = this.props;
    const { params } = match;
    const { id } = params;

    AddressBookService.GetById(id, spHttpClient, siteUrl)
      .then((res: IAddressItem) => {
        this.setState({
          contact: res,
        });
      })
      .catch((err) => {
        if (!IsStateSetFromGetByDisplay)
          handleError(err, setStatus, componentDisplay);
      });
  }
  componentWillReceiveProps(nextProps) {
    const {
      AddressBookService,
      IsStateSetFromGetByDisplay,
      spHttpClient,
      setStatus,
      siteUrl,
    } = this.props;
    const { match } = nextProps;
    const { params } = match;
    const { id } = params;
    AddressBookService.GetById(id, spHttpClient, siteUrl)
      .then((res: IAddressItem) => {
        this.setState({
          contact: res,
        });
      })
      .catch((err) => {
        if (!IsStateSetFromGetByDisplay)
          handleError(err, setStatus, componentDisplay);
      });
  }
  onEditClick() {
    const { match, history } = this.props;
    const { params } = match;
    const { id } = params;
    const str: String = "/edit/" + id.toString();
    history.push(str);
  }
  async onDeleteClick() {
    const {
      match,
      AddressBookService,

      spHttpClient,
      history,
      siteUrl,
      setStatus,
    } = this.props;
    const { params } = match;
    const { id } = params;
    const { contact } = this.state;

    AddressBookService.Delete(Number(id), spHttpClient, siteUrl)
      .then((res) => {
        if (res) {
          setStatus(remove, removeFinalDescription);
          history.push("/");
        } else setStatus(errorClass, "Item Cannot Be Deleted . . .");
      })
      .catch((error) => {
        handleError(error, setStatus);
      });
  }
  render() {
    const { contact } = this.state;
    return (
      <div className={styles.displayContainer}>
        <div className={styles.manipulateSection}>
          <div className={styles.editSection}>
            <img src={Edit} alt="edit" />
            <button
              id="EditButton"
              value="Edit"
              onClick={this.onEditClick.bind(this)}
            >
              EDIT
            </button>
          </div>
          <div className={styles.deleteSection}>
            <img src={Delete} />
            <button
              id="DeleteButton"
              value="Delete"
              onClick={this.onDeleteClick.bind(this)}
            >
              DELETE
            </button>
          </div>
        </div>
        <Table contact={contact} {...this.props}></Table>
      </div>
    );
  }
}

export default connect(Dependencies, (deps, ownProps: IDisplayProps) => ({
  AddressBookService: deps.AddressBookService,
  spHttpClient: ownProps.spHttpClient,

  siteUrl: ownProps.siteUrl,
  setStatus: ownProps.setStatus,
}))(withRouter(Display));
