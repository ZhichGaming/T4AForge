import { GetVersion, ManageCSV, ManagePresets, ManageSubmissions } from '../main/preload';

declare global {
  // eslint-disable-next-line no-unused-vars
  interface Window {
    getVersion: GetVersion;
    managePresets: ManagePresets;
    manageSubmissions: ManageSubmissions;
    manageCSV: ManageCSV;
  }
}

export {};
