import React, { useCallback, useEffect, useState } from 'react';
import Popup from 'reactjs-popup';
import _ from 'lodash';
import './PresetPopup.scss';
import './Form.scss';
import Preset, { TransmitterPreset, PayerPreset } from '../types/Presets.types';
import T619Data from '../types/T619.types';
import { T4ASummaryData } from '../types/T4A.types';

interface PresetPopupProps {
  presetType: 'transmitter' | 'payer';
  formData: T619Data | T4ASummaryData;
  trigger:
    | React.JSX.Element
    | ((isOpen: boolean) => React.JSX.Element)
    | undefined;
  loadPreset: (preset: TransmitterPreset | PayerPreset) => void;
}

// This frustrates me a lot.
export function toPreset(
  obj: T619Data | T4ASummaryData,
  type: 'transmitter' | 'payer',
): TransmitterPreset | PayerPreset {
  const reduced =
    type === 'transmitter' ? new TransmitterPreset() : new PayerPreset();

  _.assign(reduced, _.pick(obj, _.keys(reduced)));

  return reduced;
}

export default function PresetPopup({
  presetType,
  formData,
  trigger,
  loadPreset,
}: PresetPopupProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [presets, setPresets] = useState<Preset[]>([]);
  const [presetName, setPresetName] = useState('');
  const [presetData, setPresetData] = useState<
    TransmitterPreset | PayerPreset
  >();

  const getPresets = useCallback(async () => {
    const newPresets = await window.managePresets.getPresets(presetType);
    setPresets(newPresets);
  }, [presetType]);

  useEffect(() => {
    getPresets();
  }, [isOpen, presetType, getPresets]);

  useEffect(() => {
    setPresetData(toPreset(formData, presetType));
  }, [formData, presetType]);

  return (
    <Popup
      open={isOpen}
      onClose={() => setIsOpen(false)}
      trigger={trigger}
      modal
      nested
    >
      <div className="popup-content-container">
        <h2>{presetType.charAt(0).toUpperCase() + presetType.slice(1)} presets</h2>
        <hr />
        <ul className='list presets'>
          {presets.map((preset) => (
            <li key={preset.id}>
              <p>{preset.name}</p>
              <div className="preset-actions">
                <button type="button" onClick={() => loadPreset(preset.data)}>
                  Load
                </button>
                <button
                  type="button"
                  className="destructive"
                  onClick={() => {
                    window.managePresets.deletePreset(presetType, preset.id);
                    getPresets();
                  }}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
        <hr />
        <div className="actions">
          <Popup
            trigger={
              <button
                type="button"
                className="save"
                disabled={presetData === undefined}
              >
                Save Current
              </button>
            }
            modal
            nested
          >
            <div className="save-preset-content">
              <input
                type="text"
                placeholder="Preset Name"
                value={presetName}
                onChange={(e) => setPresetName(e.target.value)}
              />
              <button
                type="button"
                className="save"
                onClick={() => {
                  window.managePresets.setPreset(
                    presetType,
                    presetName,
                    presetData as TransmitterPreset | PayerPreset,
                  );
                  getPresets();
                  setIsOpen(false);
                }}
              >
                Save
              </button>
            </div>
          </Popup>
        </div>
      </div>
    </Popup>
  );
}
