// Disable no-unused-vars, broken for spread args
/* eslint no-unused-vars: off */
import { contextBridge, ipcRenderer } from 'electron';
import {
  PayerPreset,
  TransmitterPreset,
} from '../renderer/types/Presets.types';

const managePresets = {
  getPresets: (presetType: 'transmitter' | 'payer') =>
    ipcRenderer.invoke('getPresets', presetType),
  setPreset: (
    presetType: 'transmitter' | 'payer',
    presetName: string,
    presetData: TransmitterPreset | PayerPreset,
  ) => ipcRenderer.invoke('setPreset', presetType, presetName, presetData),
  deletePreset: (presetType: 'transmitter' | 'payer', presetName: string) =>
    ipcRenderer.invoke('deletePreset', presetType, presetName),
};

contextBridge.exposeInMainWorld('managePresets', managePresets);

export type ManagePresets = typeof managePresets;
