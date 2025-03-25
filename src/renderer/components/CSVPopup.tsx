import { useEffect, useState } from "react";
import Popup from "reactjs-popup";
import "./CSVPopup.scss"
import matchMultiple from "../utils/matchMultiple";
import { T4A_DYNAMIC_FIELD_MAPPINGS, T4A_FIELD_MAPPINGS } from "../utils/fieldMappings";
import { DYNAMIC_FIELD_TITLES, FIELD_TITLES } from "../utils/FIELD_TITLES";
import access from "../utils/access";
import { T4ASlipDynamicKeys, T4ASlipKeys } from "../types/T4A.types";

async function extractFieldsFromCSV(csvPath: string): Promise<{ [key: string]: (keyof T4ASlipKeys) | (keyof T4ASlipDynamicKeys)[] }> {
  const [columns, ...csv] = await window.manageCSV.getCSV(csvPath) as string[][]
  const keys: { [key: string]: (string | string[]) } = {}

  function assignKey<
    T extends keyof typeof T4A_FIELD_MAPPINGS, // Top-level key
    K extends keyof typeof T4A_FIELD_MAPPINGS[T] // Nested key
  >(
    key: T,
    keyOfKey?: K
  ) {
    const mapping = keyOfKey
      ? T4A_FIELD_MAPPINGS[key][keyOfKey] as string[]
      : T4A_FIELD_MAPPINGS[key] as string[];

    const matchedColumn = matchMultiple(columns, mapping);

    if (!matchedColumn) return;

    columns.splice(columns.indexOf(matchedColumn), 1)

    keys[matchedColumn] = keyOfKey ? `${key}.${String(keyOfKey)}` : key;
  }

  // Type
  assignKey('recipientType')

  // Name
  assignKey('recipientName', 'snm')
  assignKey('recipientName', 'gvn_nm')
  assignKey('recipientName', 'init')

  assignKey('recipientCorpName', 'l1_nm')
  assignKey('recipientCorpName', 'l2_nm')

  const dynamicNameMatch = matchMultiple(columns, T4A_DYNAMIC_FIELD_MAPPINGS.recipientName)
  if (dynamicNameMatch) {
    keys[dynamicNameMatch] = ["recipientName", "recipientCorpName"]
    columns.splice(columns.indexOf(dynamicNameMatch), 1)
  }

  // SIN/BN
  assignKey('sin')
  assignKey('rcpnt_bn')

  // Address
  for (const key of Object.keys(T4A_FIELD_MAPPINGS.recipientAddress) as (keyof T4ASlipKeys['recipientAddress'])[]) {
    assignKey('recipientAddress', key)
  }

  const dynamicAddressMatch = matchMultiple(columns, T4A_DYNAMIC_FIELD_MAPPINGS.recipientAddress)
  if (dynamicAddressMatch) {
    keys[dynamicAddressMatch] = ["recipientAddress"]
    columns.splice(columns.indexOf(dynamicAddressMatch), 1)
  }

  // Recipient Number, Payor DNTL, PPLN DPSP
  assignKey('rcpnt_nbr')
  assignKey('payr_dntl_ben_rpt_cd')
  assignKey('ppln_dpsp_rgst_nbr')

  // Amounts
  for (const key of Object.keys(T4A_FIELD_MAPPINGS.amounts) as (keyof T4ASlipKeys['amounts'])[]) {
    assignKey('amounts', key)
  }

  // Other Info
  for (const key of Object.keys(T4A_FIELD_MAPPINGS.otherInfo) as (keyof T4ASlipKeys['otherInfo'])[]) {
    assignKey('otherInfo', key)
  }

  // Remaining columns
  columns.forEach((column) => {
    keys[column] = ""
  })

  return keys as { [key: string]: (keyof T4ASlipKeys) | (keyof T4ASlipDynamicKeys)[] }
}

export default function CSVPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [page, setPage] = useState<'config' | 'confirm'>("config")
  const [csvPath, setCsvPath] = useState('')
  const [mappingKeys, setMappingKeys] = useState<{ [key: string]: (keyof T4ASlipKeys) | (keyof T4ASlipDynamicKeys)[] }>({})

  const onFileImport = async (csvPath: string) => {
    const keys = await extractFieldsFromCSV(csvPath)
    setMappingKeys(keys)
  }

  return (
    <Popup
      open={isOpen}
      onClose={() => setIsOpen(false)}
      trigger={<button type="button" className='pre-form-button'>Import CSV</button>}
      modal
      nested
    >
      <div className="popup-content-container">
        <h2>Import CSV</h2>
        <hr />
        <input
          id='csv-input'
          type="file"
          onChange={(e) => {
            const path = (document.getElementById('csv-input') as HTMLInputElement).files?.[0]?.path

            if (!path) return

            setCsvPath(path)
            onFileImport(path)
          }}
          className='file-input'
          accept=".csv" />
        <p>CSV Column Titles</p>
        <ul className='list'>
          {Object.entries(mappingKeys).map(([column, key]) => (
            <li key={column}>
              <span>{column}</span>
              <select className="key-selector" value={key}>
                {Object.entries(FIELD_TITLES).map(([key, value]) => {
                  if (value instanceof Object) {
                    return Object.entries(value).map(([sKey, sValue]) => <option value={key + "." + sKey}>{String(sValue)}</option>)
                  }

                  return <option value={key}>{value}</option>
                })}
                {Object.entries(DYNAMIC_FIELD_TITLES).map(([key, value]) => {
                  if (value instanceof Object) {
                    return Object.entries(value).map(([sKey, sValue]) => <option value={key + "." + sKey}>Dynamic - {String(sValue)}</option>)
                  }

                  return <option value={key}>Dynamic - {value}</option>
                })}
                <option value=''>No match</option>
              </select>
            </li>
          ))}
        </ul>
        <hr />
        <div className="actions">
          <button type="button" className='next' onClick={() => setPage("confirm")}>Next</button>
        </div>
      </div>
    </Popup>
  )
}
