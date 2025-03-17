import path from 'path';
import fs from 'fs';
import { app } from 'electron';
import { v4 } from 'uuid';
import Preset, {
  TransmitterPreset,
  PayerPreset,
} from '../renderer/types/Presets.types';

const USER_DATA_PATH = path.join(app.getPath('userData'), 'presets');

export function createPresetDirectories() {
  const transmitterPath = path.join(USER_DATA_PATH, 'transmitter');
  const payerPath = path.join(USER_DATA_PATH, 'payer');
  fs.mkdirSync(transmitterPath, { recursive: true });
  fs.mkdirSync(payerPath, { recursive: true });
}

export function getPresets(presetType: 'transmitter' | 'payer') {
  const presetsPath = path.join(USER_DATA_PATH, presetType);
  const presetsPaths = fs.readdirSync(presetsPath);
  const presets = presetsPaths
    .filter((tmp) => !tmp.includes('.DS_Store'))
    .map((presetPath) => {
      const presetData = fs.readFileSync(
        path.join(presetsPath, presetPath),
        'utf8',
      );

      const preset = JSON.parse(presetData);

      return preset as Preset;
    });

  return presets;
}

export function setPreset(
  presetType: 'transmitter' | 'payer',
  presetName: string,
  presetData: TransmitterPreset | PayerPreset,
) {
  const presetsPath = path.join(USER_DATA_PATH, presetType);
  const preset = {
    id: v4(),
    name: presetName,
    data: presetData,
  };
  fs.writeFileSync(path.join(presetsPath, preset.id), JSON.stringify(preset));
}

export function deletePreset(
  presetType: 'transmitter' | 'payer',
  presetName: string,
) {
  const presetsPath = path.join(USER_DATA_PATH, presetType);
  fs.unlinkSync(path.join(presetsPath, presetName));
}
