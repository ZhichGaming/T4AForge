import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { T4ASlipData } from '../types/T4A.types';
import T4ASlip from './T4ASlip';
import './Form.scss';
import CSVPopup from './CSVPopup';

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
  const [editingSlipIndex, setEditingSlipIndex] = useState<number | null>(null);
  const [editingSlip, setEditingSlip] = useState<T4ASlipData | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

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

  const onImportComplete = (importedSlips: T4ASlipData[]) => {
    setSlips((prev) => {
      if (prev === null) return null;
      return [...prev, ...importedSlips];
    });
  };

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
        <CSVPopup onImportComplete={onImportComplete} />
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
    </div>
  );
}

export default T4AForm;
