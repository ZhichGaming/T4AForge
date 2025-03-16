import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { T4ASlipData } from '../types/T4A.types';
import T4ASlip from './T4ASlip';
import './Form.scss';

function T4AForm({
  slips,
  setSlips,
  nextStep,
}: {
  slips: T4ASlipData[];
  setSlips: React.Dispatch<React.SetStateAction<T4ASlipData[]>>;
  nextStep: () => void;
}) {
  const [showSlipForm, setShowSlipForm] = useState(false);
  const [editingSlipIndex, setEditingSlipIndex] = useState<number | null>(null);
  const [editingSlip, setEditingSlip] = useState<T4ASlipData | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSlipComplete = (slipData: T4ASlipData) => {
    if (editingSlipIndex !== null) {
      setSlips((prev) => {
        const newSlips = [...prev];
        newSlips[editingSlipIndex] = slipData;
        return newSlips;
      });
      setEditingSlipIndex(null);
      setEditingSlip(null);
    } else {
      setSlips((prev) => [...prev, slipData]);
    }
    setShowSlipForm(false);
  };

  const handleEditSlip = (index: number) => {
    setEditingSlipIndex(index);
    setEditingSlip(slips[index]);
    setShowSlipForm(true);
  };

  const handleDeleteSlip = (index: number) => {
    setSlips((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    if (slips.length === 0) {
      setErrorMessage('Please add at least one slip');
      return;
    }

    setSlips(slips);
    nextStep();
  };

  return (
    <div className="form">
      <h1>T4A Form Generator</h1>

      {showSlipForm ? (
        <T4ASlip
          onSlipComplete={handleSlipComplete}
          editingSlip={editingSlip}
        />
      ) : (
        <div className="slips-list">
          <h2>T4A Slips</h2>
          {slips.map((slip, index) => (
            <div className="slip-item" key={uuidv4()}>
              <span>
                {slip.recipientType === 'individual'
                  ? `${slip.recipientName.snm}, ${slip.recipientName.gvn_nm}`
                  : slip.recipientCorpName.l1_nm}
              </span>
              <div className="slip-actions">
                <button type="button" onClick={() => handleEditSlip(index)}>
                  Edit
                </button>
                <button type="button" onClick={() => handleDeleteSlip(index)}>
                  Delete
                </button>
              </div>
            </div>
          ))}
          <button type="button" onClick={() => setShowSlipForm(true)}>
            Add Slip
          </button>
        </div>
      )}

      {errorMessage && <div className="error-message">{errorMessage}</div>}

      <button type="button" onClick={handleSubmit}>
        Next Step
      </button>
    </div>
  );
}

export default T4AForm;
