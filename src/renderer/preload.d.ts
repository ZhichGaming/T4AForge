import { ManagePresets } from '../main/preload';

declare global {
  // eslint-disable-next-line no-unused-vars
  interface Window {
    managePresets: ManagePresets;
  }
}

export {};
