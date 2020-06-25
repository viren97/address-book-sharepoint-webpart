declare interface IAppSettings {
   readonly Namespace: string;
   readonly DomainName: string;
  }
  
  declare module 'AppSettings' {
    const appSettings: IAppSettings;
    export = appSettings;
  }