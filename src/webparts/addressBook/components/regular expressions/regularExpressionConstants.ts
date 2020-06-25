export const NameExp: RegExp = new RegExp("^[A-Za-z .]+$");
export const EmailExp: RegExp = new RegExp("^w+@[a-zA-Z_]+?.[a-zA-Z]{2,3}$");
export const WebsiteExp: RegExp = new RegExp(
  "^(www.)[a-zA-Z]+(.)(com)|(in)|(org)$"
);
export const MobileExp: RegExp = new RegExp("/^d{10}$/");
