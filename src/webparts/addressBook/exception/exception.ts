import { errorClass } from "./../constants/constants";
import { SPHttpClientResponse } from "@microsoft/sp-http";
export const handleError = (
  error: any,
  setStatus: Function,
  setByComponent?: string
) => {
  console.log(
    "In Handle Error : ",
    errorClass,
    error,
    setStatus,
    setByComponent
  );
  debugger;
  if (error instanceof SPHttpClientResponse) {
    setStatus(errorClass, error.statusText, setByComponent);
  } else {
    setStatus(errorClass, error.toString(), setByComponent);
  }
};
