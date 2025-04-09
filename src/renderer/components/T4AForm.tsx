import React, { useEffect, useRef, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { T4ASlipData } from '../types/T4A.types';
import T4ASlip, { validateForm } from './T4ASlip';
import './Form.scss';
import CSVPopup from './CSVPopup';
import { useStateCallback } from '../hooks/useStateCallback';
import access from '../utils/access';
import { FIELD_TITLES } from '../utils/FIELD_TITLES';

function T4AForm({
  slips,
  setSlips,
  nextStep,
}: {
  slips: T4ASlipData[];
  setSlips: React.Dispatch<React.SetStateAction<T4ASlipData[] | null>>;
  nextStep: () => void;
}) {
  const [showSlipForm, setShowSlipForm] = useState(false);
  const [showImportPopup, setShowImportPopup] = useState(false);
  const [editingSlipIndex, setEditingSlipIndex] = useState<number | null>(null);
  const [editingSlip, setEditingSlip] = useStateCallback<T4ASlipData | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  // const [erroredForms, setErroredForms] = useState<number[]>([]);

  const handleSlipComplete = (slipData: T4ASlipData) => {
    if (editingSlipIndex !== null) {
      setSlips((prev) => {
        // I'm returning null here because when slips are null, we are not supposed to have a submission open
        if (prev === null) return null;

        const newSlips = [...prev];
        newSlips[editingSlipIndex] = slipData;
        return newSlips;
      });

      setEditingSlipIndex(null);
      setEditingSlip(null);
    } else {
      setSlips((prev) => {
        if (prev === null) return null;

        return [...prev, slipData];
      });
    }

    setShowSlipForm(false);
  };

  const handleEditSlip = (index: number) => {
    setEditingSlipIndex(index);
    setEditingSlip(slips[index]);
    setShowSlipForm(true);
  };

  const handleDeleteSlip = (index: number) => {
    setSlips((prev) => {
      if (prev === null) return null;

      return prev.filter((_, i) => i !== index)
    });
  };

  const handleSubmit = () => {
    if (slips.length === 0) {
      setErrorMessage('Please add at least one slip');
      return;
    }

    setSlips(slips);
    nextStep();
  };

  const onImportComplete = async (importedSlips: T4ASlipData[]) => {
    const errors = await recursiveValidateForm(0, importedSlips);

    if (Object.keys(errors).length === 0) {
      setSlips((prev) => {
        if (prev === null) return null;
        return [...prev, ...importedSlips];
      });
    }

    return errors
  };

  const recursiveValidateForm = async (index: number, slips: T4ASlipData[]): Promise<{ [key: number]: string[] }> => {
    if (index >= slips.length) {
      setEditingSlipIndex(null);
      setEditingSlip(null);

      return [];
    }

    const res = await new Promise<{ [key: number]: string[] }>((resolve) => {
      setEditingSlip(slips[index], async (state) => {
        if (state === null) return;

        const { requiredErrors, patternErrors } = validateForm(state);

        const isErrored = requiredErrors.length > 0 || patternErrors.length > 0

        setShowSlipForm(false);

        await new Promise(unsleep => setTimeout(unsleep, 100));

        const previousErrored = await recursiveValidateForm(index + 1, slips)
        const totalErrored = isErrored ?
          { ...previousErrored, [index]: [
            ...requiredErrors.map((error) => `Required field: ${access(error, FIELD_TITLES)}`),
            ...patternErrors.map((error) => `Pattern error: ${access(error, FIELD_TITLES)}`)
          ] } :
          Object.assign({}, previousErrored);

        resolve(totalErrored);
      })

      setShowSlipForm(true);
    })

    return res
  }

  return (
    <div className="form">
      {showSlipForm ? (
        <T4ASlip
          onSlipComplete={handleSlipComplete}
          editingSlip={editingSlip}
        />
      ) : (
        <>
        <h2>T4A Slips</h2>
        <button
          type="button"
          className="pre-form-button"
          onClick={() => setShowImportPopup(true)}
        >
          Import CSV
        </button>
        <ul className="list slips-list">
          {slips.map((slip, index) => (
            <li className="slip-item" key={uuidv4()}>
              <span>
                {slip.recipientType === 'individual'
                  ? `${slip.recipientName.snm}, ${slip.recipientName.gvn_nm}`
                  : slip.recipientCorpName.l1_nm}
              </span>
              <div className="slip-actions">
                <button type="button" onClick={() => handleEditSlip(index)}>
                  Edit
                </button>
                <button type="button" className='destructive' onClick={() => handleDeleteSlip(index)}>
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
        <div className='t4a-actions'>
          {errorMessage && <div className="error-message">{errorMessage}</div>}
          <button type="button" onClick={() => setShowSlipForm(true)}>
            Add Slip
          </button>
          <button type="button" onClick={handleSubmit}>
            Next Step
          </button>
        </div>
        </>
      )}

      <CSVPopup isOpen={showImportPopup} setIsOpen={setShowImportPopup} tryImport={onImportComplete} />
  </div>
  );
}

export default T4AForm;
