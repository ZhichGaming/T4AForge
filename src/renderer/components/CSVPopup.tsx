import { useEffect, useState } from 'react';
import Popup from 'reactjs-popup';
import './CSVPopup.scss';
import findFirstMatch from '../utils/findFirstMatch';
import { T4A_FIELD_MAPPINGS } from '../utils/FIELD_MAPPINGS';
import { FIELD_TITLES } from '../utils/FIELD_TITLES';
import {
  T4ASlipData,
  T4ASlipDynamicKeys,
  T4ASlipKeys,
} from '../types/T4A.types';
import access from '../utils/access';

async function getCSV(csvPath: string) {
  const csv = await window.manageCSV.getCSV(csvPath);

  return csv as string[][];
}

async function extractColumnsFromCSV(
  csv: string[][],
): Promise<{ [key: string]: string }> {
  const columns = Array.from(csv[0]);
  const keys: { [key: string]: string } = {};

  function assignKey<
    T extends keyof typeof T4A_FIELD_MAPPINGS, // Top-level key
    K extends keyof (typeof T4A_FIELD_MAPPINGS)[T], // Nested key
  >(key: T, keyOfKey?: K) {
    const mapping = keyOfKey
      ? (T4A_FIELD_MAPPINGS[key][keyOfKey] as string[])
      : (T4A_FIELD_MAPPINGS[key] as string[]);

    const matchedColumn = findFirstMatch(columns, mapping);

    if (!matchedColumn) return;

    columns.splice(columns.indexOf(matchedColumn), 1);

    keys[matchedColumn] = keyOfKey ? `${key}.${String(keyOfKey)}` : key;
  }

  // Type
  assignKey('recipientType');

  // Name
  assignKey('recipientName', 'snm');
  assignKey('recipientName', 'gvn_nm');
  assignKey('recipientName', 'init');

  assignKey('recipientCorpName', 'l1_nm');
  assignKey('recipientCorpName', 'l2_nm');

  // SIN/BN
  assignKey('sin');
  assignKey('rcpnt_bn');

  // Address
  for (const key of Object.keys(
    T4A_FIELD_MAPPINGS.recipientAddress,
  ) as (keyof T4ASlipKeys['recipientAddress'])[]) {
    assignKey('recipientAddress', key);
  }

  // Recipient Number, Payor DNTL, PPLN DPSP
  assignKey('rcpnt_nbr');
  assignKey('payr_dntl_ben_rpt_cd');
  assignKey('ppln_dpsp_rgst_nbr');

  // Amounts
  for (const key of Object.keys(
    T4A_FIELD_MAPPINGS.amounts,
  ) as (keyof T4ASlipKeys['amounts'])[]) {
    assignKey('amounts', key);
  }

  // Other Info
  for (const key of Object.keys(
    T4A_FIELD_MAPPINGS.otherInfo,
  ) as (keyof T4ASlipKeys['otherInfo'])[]) {
    assignKey('otherInfo', key);
  }

  // Remaining columns
  columns.forEach((column) => {
    keys[column] = '';
  });

  return keys as { [key: string]: string };
}

function getFieldList(titles: string[], mapping: { [key: string]: string }) {
  const fields: string[] = [];

  for (const title of titles) {
    const key = mapping[title];

    if (key.length > 0) {
      fields.push(key);
    }
  }

  return fields;
}

function buildT4aSlips(
  csv: string[][],
  mappingKeys: { [key: string]: string },
  fieldList: string[],
) {
  const slips: T4ASlipData[] = [];

  for (let i = 1; i < csv.length; i++) {
    const row = csv[i];
    const slip = new T4ASlipData();

    for (let j = 0; j < row.length; j++) {
      const columnKey = mappingKeys[csv[0][j]];
      const value = row[j];

      if (!fieldList.includes(columnKey)) continue;
      if (value.length === 0) continue;

      const splitKey = columnKey.split('.');

      if (splitKey.length === 1) {
        if (slip.hasOwnProperty(columnKey)) {
          (slip[columnKey as keyof T4ASlipData] as any) = value;
        }
      } else {
        const parentKey = splitKey[0] as keyof T4ASlipData;
        const childKey = splitKey[1] as keyof T4ASlipData[typeof parentKey];

        if (slip[parentKey]) {
          (slip[parentKey][childKey] as any) = value;
        }
      }
    }

    slips.push(slip);
  }

  return slips;
}

export default function CSVPopup({ onImportComplete }: { onImportComplete: (slips: T4ASlipData[]) => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const [page, setPage] = useState<'config' | 'confirm'>('config');
  const [csv, setCSV] = useState<string[][]>();
  const [mappingKeys, setMappingKeys] = useState<{ [key: string]: string }>({});
  const [errorMessage, setErrorMessage] = useState('');

  const [fieldList, setFieldList] = useState<string[]>([]);
  const [slips, setSlips] = useState<T4ASlipData[]>([]);

  const onFileImport = async (csv: string[][]) => {
    const keys = await extractColumnsFromCSV(csv);
    setMappingKeys(keys);
  };

  const nextPage = () => {
    setPage('confirm');
  };

  const closeModal = () => {
    setIsOpen(false);
    setPage('config');
    setCSV(undefined);
    setMappingKeys({});
  };

  useEffect(() => {
    const newFieldList = getFieldList(Object.keys(mappingKeys), mappingKeys);
    setFieldList(newFieldList);

    setSlips(buildT4aSlips(csv || [], mappingKeys, newFieldList));
  }, [csv, mappingKeys]);

  const confirmImport = () => {
    if (slips.length === 0) {
      setErrorMessage('No slips imported');
      return;
    }

    setErrorMessage('');

    setIsOpen(false);
    onImportComplete(slips);
  };

  return (
    <>
      <button
        type="button"
        className="pre-form-button"
        onClick={() => setIsOpen(true)}
      >
        Import CSV
      </button>
      <Popup open={isOpen} onClose={closeModal} modal nested>
        <div className="popup-content-container">
          <h2>Import CSV</h2>
          <hr />
          {page == 'config' ? (
            <div className="config-container">
              <input
                id="csv-input"
                type="file"
                onChange={(e) => {
                  const path = (
                    document.getElementById('csv-input') as HTMLInputElement
                  ).files?.[0]?.path;

                  if (!path) return;

                  getCSV(path).then((csv) => {
                    setCSV(csv);
                    onFileImport(csv);
                  });
                }}
                className="file-input"
                accept=".csv"
              />
              <p>CSV Column Titles</p>
              <ul className="list">
                {Object.entries(mappingKeys).map(([column, key]) => (
                  <li key={column}>
                    <span>{column}</span>
                    <select
                      className="key-selector"
                      value={key}
                      onChange={(e) => {
                        const value = e.target.value;
                        setMappingKeys({
                          ...mappingKeys,
                          [column]: value as
                            | keyof T4ASlipKeys
                            | keyof T4ASlipDynamicKeys,
                        });
                      }}
                    >
                      {Object.entries(FIELD_TITLES).map(([key, value]) => {
                        if (value instanceof Object) {
                          return Object.entries(value).map(([sKey, sValue]) => (
                            <option
                              value={key + '.' + sKey}
                              key={key + '.' + sKey}
                            >
                              {String(sValue)}
                            </option>
                          ));
                        }

                        return (
                          <option value={key} key={key}>
                            {value}
                          </option>
                        );
                      })}
                      <option value="">No match</option>
                    </select>
                  </li>
                ))}
              </ul>
              <hr />
              <div className="actions">
                <button type="button" className="cancel" onClick={closeModal}>
                  Cancel
                </button>
                <button type="button" className="next" onClick={nextPage}>
                  Next
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="confirm-container">
                <table>
                  <thead>
                    <tr>
                      {fieldList.map((cell, i) => (
                        <th key={i}>{access(cell, FIELD_TITLES)}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {slips.map((slip, i) => (
                      <tr key={i}>
                        {fieldList.map((cell, i) => (
                          <td key={i}>{access(cell, slip)}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <hr />
              <p className="error-message">{errorMessage}</p>
              <div className="actions">
                <button type="button" className="cancel" onClick={closeModal}>
                  Cancel
                </button>
                <button
                  type="button"
                  className="confirm"
                  onClick={confirmImport}
                >
                  Confirm
                </button>
              </div>
            </>
          )}
        </div>
      </Popup>
    </>
  );
}
