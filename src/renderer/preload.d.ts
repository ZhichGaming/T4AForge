import { ManagePresets, ManageSubmissions } from '../main/preload';

declare global {
  // eslint-disable-next-line no-unused-vars
  interface Window {
    managePresets: ManagePresets;
    manageSubmissions: ManageSubmissions;
  }
}

export {};
