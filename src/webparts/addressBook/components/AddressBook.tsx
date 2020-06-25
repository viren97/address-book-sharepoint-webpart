import * as React from "react";
import { IAddressBookState } from "./IAddressBookState";
import { IAddressBookProps } from "./IAddressBookProps";
import List from "./List/List";
import Form from "./Form/Form";
import Display from "./Display/Display";
import { Provider } from "react-inversify";
import { Link, Route, Switch, HashRouter } from "react-router-dom";
import { container } from "./../loc/address-book-ioc";
import Blog from "./../assets/blog.png";
import {
  componentDisplay,
  componentForm,
  componentList,
  errorClass,
  create,
  updateValue,
  remove,
} from "../constants/constants";
import styles from "./AddressBook.module.scss";

export default class AddressBook extends React.Component<
  IAddressBookProps,
  IAddressBookState
> {
  constructor(props) {
    super(props);
    this.setStatus = this.setStatus.bind(this);
    this.state = {
      statusClass: styles.noDisplay,
      statusDescription: "",
      IsStateSetFromGetByDisplay: false,
      IsStateSetFromGetByForm: false,
      IsStateSetFromGetByList: false,
    };
    this.setStatus = this.setStatus.bind(this);
    this.onMessageSeen = this.onMessageSeen.bind(this);
  }
  onMessageSeen() {
    this.setState({
      statusClass: styles.noDisplay,
      statusDescription: "",
    });
  }
  public setStatus(
    statusName: string,
    statusDescription: string,
    setByComponent: string
  ) {
    let className: string = null;
    debugger;
    if (statusName == errorClass) className = styles.error;
    if (
      statusName == create ||
      statusName == updateValue ||
      statusName == remove
    ) {
      className = styles.success;
      setTimeout(() => {
        this.onMessageSeen();
      }, 5000);
    }
    this.setState({
      statusClass: className,
      statusDescription: statusDescription,
    });
    if (setByComponent != undefined) {
      this.setState({
        IsStateSetFromGetByDisplay: setByComponent == componentDisplay,
        IsStateSetFromGetByForm: setByComponent == componentForm,
        IsStateSetFromGetByList: setByComponent == componentList,
      });
    }
  }

  public render() {
    const {
      statusClass,
      statusDescription,
      IsStateSetFromGetByList,
      IsStateSetFromGetByForm,
      IsStateSetFromGetByDisplay,
    } = this.state;

    return (
      <div className={styles.addressBook}>
        <div className={styles.header}>Address Book</div>
        <HashRouter>
          <Provider container={container}>
            <>
              {" "}
              <nav className={styles.nav}>
                <div>
                  <Link to="/" className={styles.home}>
                    HOME
                  </Link>
                </div>
                <div className={styles.add}>
                  <Link to="/add">+ADD</Link>
                </div>
                <div className={styles.blogImage}>
                  <img src={Blog} />
                </div>
              </nav>
              <div className={styles.content}>
                <Route
                  path="/"
                  component={() => {
                    return (
                      <List
                        IsStateSetFromGetByList={IsStateSetFromGetByList}
                        setStatus={this.setStatus}
                        {...this.props}
                      />
                    );
                  }}
                />
                <Switch>
                  <Route
                    exact
                    path={["/add", "/edit/:id"]}
                    component={() => {
                      return (
                        <Form
                          IsStateSetFromGetByForm={IsStateSetFromGetByForm}
                          {...this.props}
                          setStatus={this.setStatus}
                        />
                      );
                    }}
                  />
                  <Route
                    exact
                    path={["/:id"]}
                    component={() => {
                      return (
                        <Display
                          IsStateSetFromGetByDisplay={
                            IsStateSetFromGetByDisplay
                          }
                          setStatus={this.setStatus}
                          {...this.props}
                        />
                      );
                    }}
                  />
                </Switch>
              </div>
            </>
          </Provider>
        </HashRouter>

        <div className={statusClass}>
          {" "}
          <span>{statusDescription}</span>
          <button className={styles.buttonOK} onClick={this.onMessageSeen}>
            OK
          </button>{" "}
        </div>
      </div>
    );
  }
}
