// Disable no-unused-vars, broken for spread args
/* eslint no-unused-vars: off */
import { contextBridge, ipcRenderer } from 'electron';
import {
  PayerPreset,
  TransmitterPreset,
} from '../renderer/types/Presets.types';

const getVersion: () => Promise<string> = () =>
  ipcRenderer.invoke('getVersion');

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

const manageSubmissions = {
  createSubmissionDirectories: (year?: number) =>
    ipcRenderer.invoke('createSubmissionDirectories', year),
  getSubmissions: () => ipcRenderer.invoke('getSubmissions'),
  setSubmission: (year: number, submissionData: any) =>
    ipcRenderer.invoke('setSubmission', year, submissionData),
  deleteSubmission: (year: number, id: string) =>
    ipcRenderer.invoke('deleteSubmission', year, id),
  getNextSubmissionId: (year: number) =>
    ipcRenderer.invoke('getNextSubmissionId', year),
};

const manageCSV = {
  getCSV: (filePath: string) => ipcRenderer.invoke('getCSV', filePath),
};

contextBridge.exposeInMainWorld('getVersion', getVersion);
contextBridge.exposeInMainWorld('managePresets', managePresets);
contextBridge.exposeInMainWorld('manageSubmissions', manageSubmissions);
contextBridge.exposeInMainWorld('manageCSV', manageCSV);

export type GetVersion = typeof getVersion;
export type ManagePresets = typeof managePresets;
export type ManageSubmissions = typeof manageSubmissions;
export type ManageCSV = typeof manageCSV;
