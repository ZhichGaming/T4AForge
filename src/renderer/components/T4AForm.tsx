import { useState } from 'react';
import { T4ASlipData } from '../types/T4A.types';
import T4ASlip from './T4ASlip';
import './Form.scss';

function T4AForm({
  nextStep,
  sendFormData,
}: {
  nextStep: () => void;
  sendFormData: (formData: T4ASlipData[]) => void;
}) {
  const [slips, setSlips] = useState<T4ASlipData[]>([]);
  const [showSlipForm, setShowSlipForm] = useState(false);
  const [editingSlipIndex, setEditingSlipIndex] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSlipComplete = (slipData: T4ASlipData) => {
    if (editingSlipIndex !== null) {
      setSlips((prev) => {
        const newSlips = [...prev];
        newSlips[editingSlipIndex] = slipData;
        return newSlips;
      });
      setEditingSlipIndex(null);
    } else {
      setSlips((prev) => [...prev, slipData]);
    }
    setShowSlipForm(false);
  };

  const handleEditSlip = (index: number) => {
    setEditingSlipIndex(index);
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

    sendFormData(slips);
    nextStep();
  };

  return (
    <div className="form">
      <h1>T4A Form Generator</h1>

      {showSlipForm ? (
        <T4ASlip onSlipComplete={handleSlipComplete} />
      ) : (
        <div className="slips-list">
          <h2>T4A Slips</h2>
          {slips.map((slip, index) => (
            <div className="slip-item">
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
