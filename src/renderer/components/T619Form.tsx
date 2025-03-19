/* eslint-disable prettier/prettier */
import React, { useState } from 'react';
import './Form.scss';
import T619FormData from '../types/T619.types';
import PresetPopup from './PresetPopup';
import { PayerPreset, TransmitterPreset } from '../types/Presets.types';

function T619Form({
  formData,
  setFormData,
  nextStep,
}: {
  formData: T619FormData;
  setFormData: React.Dispatch<React.SetStateAction<T619FormData | null>>;
  nextStep: () => void;
}) {
  const [errorMessage, setErrorMessage] = useState('');

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    if (name.includes('.')) {
      const [parent, child] = name.split('.');

      setFormData((prev) => {
        if (prev === null) return null;

        return {
          ...prev,
          [parent]: {
            ...(prev[parent as keyof T619FormData] as any),
            [child]: value,
          },
        }
      });
    } else {
      setFormData((prev) => {
        if (prev === null) return null;

        return {
          ...prev,
          [name]: value,
        }
      });
    }
  };

  const handleAccountTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData((prev) => {
      if (prev === null) return null;

      return {
        ...prev,
        accountType: e.target.value as 'bn9' | 'bn15' | 'trust' | 'nr4' | 'repid',
        bn9: e.target.value === 'bn9' ? prev.bn9 : '',
        bn15: e.target.value === 'bn15' ? prev.bn15 : '',
        trust: e.target.value === 'trust' ? prev.trust : '',
        nr4: e.target.value === 'nr4' ? prev.nr4 : '',
        RepID: e.target.value === 'repid' ? prev.RepID : '',
      }
    });
  };

  const validateForm = (): { requiredErrors: string[]; patternErrors: string[] } => {
    const inputs = document.querySelectorAll<HTMLInputElement>('#t619-form input');
    const requiredErrors: string[] = [];
    const patternErrors: string[] = [];

    inputs.forEach((input) => {
      if (input.required && input.value === '') {
        requiredErrors.push(input.name);
      } else if (input.value !== '' && input.pattern && !(new RegExp(input.pattern).test(input.value))) {
        patternErrors.push(input.name);
      }
    });

    return { requiredErrors, patternErrors };
  };

  const getFieldTitle = (field: string) => {
    const input = document.getElementById(field) as HTMLInputElement;
    return input?.parentElement?.querySelector('.field-title')?.textContent ?? field;
  };

  const handleSubmit = () => {
    const { requiredErrors, patternErrors } = validateForm();

    if (requiredErrors.length > 0) {
      setErrorMessage(`Please fill in fields ${requiredErrors.map(getFieldTitle).join(', ')} and ensure all data is in the correct format.`);
      return;
    }

    if (patternErrors.length > 0) {
      setErrorMessage(`Please ensure data in fields ${patternErrors.map(getFieldTitle).join(', ')} is in the correct format.`);
      return;
    }

    nextStep();
  };

  const handleLoadPreset = (preset: TransmitterPreset | PayerPreset) => {
    setFormData((prev) => {
      if (prev === null) return null;

      return {
        ...prev,
        ...preset,
      }
    });
  };

  return (
    <div id="t619-form" className="form">
      <h1>T619 Form Generator</h1>

      <PresetPopup
        presetType="transmitter"
        formData={formData}
        trigger={<button type="button">Presets</button>}
        loadPreset={handleLoadPreset}
      />

      <div className="form-section">
        <h2>Transmitter Information</h2>

        <div className="form-group">
          <label htmlFor="accountType">
            <span className="field-title">Account Type:</span>
            <select
              id="accountType"
              name="accountType"
              value={formData.accountType}
              onChange={handleAccountTypeChange}
              required
            >
              <option value="bn9">Business Number (9 digits)</option>
              <option value="bn15">Business Number (15 chars)</option>
              <option value="trust">Trust Account</option>
              <option value="nr4">NR4 Account</option>
              <option value="repid">Representative ID</option>
            </select>
          </label>
        </div>

        {formData.accountType === 'bn9' && (
          <div className="form-group">
            <label htmlFor="bn9">
              <span className="tooltip">
                <span className="field-title">Business Number (9 digits)</span>
                <span className="tooltiptext">
                  Required, 9 numeric, example: 000000000. Can only be used if signed in using MyBA.
                </span>
              </span>
              <input
                id="bn9"
                type="text"
                name="bn9"
                value={formData.bn9}
                onChange={handleInputChange}
                required
                maxLength={9}
                pattern="^[0-9]{9}$"
              />
            </label>
          </div>
        )}

        {formData.accountType === 'bn15' && (
          <div className="form-group">
            <label htmlFor="bn15">
              <span className="tooltip">
                <span className="field-title">Business Number (15 chars)</span>
                <span className="tooltiptext">
                  Required, 15 alphanumeric; 9 numeric, 2 alpha and 4 numeric (example 000000000RP0000, or 000000000RZ0000)
                </span>
              </span>
              <input
                id="bn15"
                type="text"
                name="bn15"
                value={formData.bn15}
                onChange={handleInputChange}
                required
                maxLength={15}
                pattern="^[0-9]{9}[A-Z]{2}[0-9]{4}$"
              />
            </label>
          </div>
        )}

        {formData.accountType === 'trust' && (
          <div className="form-group">
            <label htmlFor="trust">
              <span className="tooltip">
                <span className="field-title">Trust Account</span>
                <span className="tooltiptext">
                  Required, 1 alpha, 8 numeric, example: T00000000
                </span>
              </span>
              <input
                id="trust"
                type="text"
                name="trust"
                value={formData.trust}
                onChange={handleInputChange}
                required
                maxLength={9}
                pattern="^[A-Z][0-9]{8}$"
              />
            </label>
          </div>
        )}

        {formData.accountType === 'nr4' && (
          <div className="form-group">
            <label htmlFor="nr4">
              <span className="tooltip">
                <span className="field-title">NR4 Account</span>
                <span className="tooltiptext">
                  Required, 3 alpha, 6 numeric, example: AAA000000
                </span>
              </span>
              <input
                id="nr4"
                type="text"
                name="nr4"
                value={formData.nr4}
                onChange={handleInputChange}
                required
                maxLength={9}
                pattern="^[A-Z]{3}[0-9]{6}$"
              />
            </label>
          </div>
        )}

        {formData.accountType === 'repid' && (
          <div className="form-group">
            <label htmlFor="RepID">
              <span className="tooltip">
                <span className="field-title">Representative ID (RepID)</span>
                <span className="tooltiptext">
                  Required if logged in using Represent a client (RAC) application, 7 alphanumeric
                </span>
              </span>
              <input
                id="RepID"
                type="text"
                name="RepID"
                value={formData.RepID}
                onChange={handleInputChange}
                required
                maxLength={7}
                pattern="^[A-Za-z0-9]{0,7}$"
              />
            </label>
          </div>
        )}

        <div className="form-group">
          <label htmlFor="sbmt_ref_id">
            <span className="tooltip">
              <span className="field-title">Submission Reference ID</span>
              <span className="tooltiptext">
                Required, 8 alphanumeric, unique number created by the transmitter to identify each submission filed to CRA
              </span>
            </span>
            <input
              id="sbmt_ref_id"
              type="text"
              name="sbmt_ref_id"
              value={formData.sbmt_ref_id}
              onChange={handleInputChange}
              required
              maxLength={8}
              pattern="^[A-Za-z0-9]{1,8}$"
              disabled
            />
          </label>
        </div>

        <div className="form-group">
          <label htmlFor="summ_cnt">
            <span className="tooltip">
              <span className="field-title">Summary Count</span>
              <span className="tooltiptext">
                Required, 6 numeric, total number of summary records produced on this electronic filing
              </span>
            </span>
            <input
              id="summ_cnt"
              type="text"
              name="summ_cnt"
              value={formData.summ_cnt}
              onChange={handleInputChange}
              required
              maxLength={6}
              pattern="^[0-9]{1,6}$"
              disabled
            />
          </label>
        </div>

        <div className="form-group">
          <label htmlFor="lang_cd">
            <span className="tooltip">
              <span className="field-title">Language Code</span>
              <span className="tooltiptext">
                Required, 1 alpha, E = English, F = French
              </span>
            </span>
            <select
              id="lang_cd"
              name="lang_cd"
              value={formData.lang_cd}
              onChange={handleInputChange}
              required
            >
              <option value="E">English</option>
              <option value="F">French</option>
            </select>
          </label>
        </div>

        <div className="form-group">
          <label htmlFor="transmitterName.l1_nm">
            <span className="tooltip">
              <span className="field-title">Transmitter Name</span>
              <span className="tooltiptext">
                Required, 35 alphanumeric
              </span>
            </span>
            <input
              id="transmitterName.l1_nm"
              type="text"
              name="transmitterName.l1_nm"
              value={formData.transmitterName.l1_nm}
              onChange={handleInputChange}
              required
              maxLength={35}
            />
          </label>
        </div>

        <div className="form-group">
          <label htmlFor="TransmitterCountryCode">
            <span className="tooltip">
              <span className="field-title">Transmitter Country Code</span>
              <span className="tooltiptext">
                Required, 3 alpha, e.g., CAN for Canada, USA for the United States of America
              </span>
            </span>
            <input
              id="TransmitterCountryCode"
              type="text"
              name="TransmitterCountryCode"
              value={formData.TransmitterCountryCode}
              onChange={handleInputChange}
              required
              maxLength={3}
              pattern="^[A-Z]{3}$"
            />
          </label>
        </div>

        <h2>Contact Information</h2>

        <div className="form-group">
          <label htmlFor="contact.cntc_nm">
            <span className="tooltip">
              <span className="field-title">Contact Name</span>
              <span className="tooltiptext">
                Required, 35 alphanumeric, contact&apos;s first name followed by surname (no titles like Mr. or Mrs.)
              </span>
            </span>
            <input
              id="contact.cntc_nm"
              type="text"
              name="contact.cntc_nm"
              value={formData.contact.cntc_nm}
              onChange={handleInputChange}
              required
              maxLength={35}
            />
          </label>
        </div>

        <div className="form-group">
          <label htmlFor="contact.cntc_area_cd">
            <span className="tooltip">
              <span className="field-title">Area Code</span>
              <span className="tooltiptext">
                Required, 3 numeric
              </span>
            </span>
            <input
              id="contact.cntc_area_cd"
              type="text"
              name="contact.cntc_area_cd"
              value={formData.contact.cntc_area_cd}
              onChange={handleInputChange}
              required
              maxLength={3}
              pattern="^[0-9]{3}$"
            />
          </label>
        </div>

        <div className="form-group">
          <label htmlFor="contact.cntc_phn_nbr">
            <span className="tooltip">
              <span className="field-title">Phone Number</span>
              <span className="tooltiptext">
                Required, 7 numeric in format XXX-XXXX
              </span>
            </span>
            <input
              id="contact.cntc_phn_nbr"
              type="text"
              name="contact.cntc_phn_nbr"
              value={formData.contact.cntc_phn_nbr}
              onChange={handleInputChange}
              required
              maxLength={8}
              pattern="^[0-9]{3}-[0-9]{4}$"
              placeholder="XXX-XXXX"
            />
          </label>
        </div>

        <div className="form-group">
          <label htmlFor="contact.cntc_extn_nbr">
            <span className="tooltip">
              <span className="field-title">Extension Number</span>
              <span className="tooltiptext">
                12 numeric
              </span>
            </span>
            <input
              id="contact.cntc_extn_nbr"
              type="text"
              name="contact.cntc_extn_nbr"
              value={formData.contact.cntc_extn_nbr}
              onChange={handleInputChange}
              maxLength={12}
              pattern="^[0-9]{0,12}$"
            />
          </label>
        </div>

        <div className="form-group">
          <label htmlFor="contact.cntc_email_area">
            <span className="tooltip">
              <span className="field-title">Email</span>
              <span className="tooltiptext">
                Required, 60 alphanumeric
              </span>
            </span>
            <input
              id="contact.cntc_email_area"
              type="email"
              name="contact.cntc_email_area"
              value={formData.contact.cntc_email_area}
              onChange={handleInputChange}
              required
              maxLength={60}
            />
          </label>
        </div>

        <div className="form-group">
          <label htmlFor="contact.sec_cntc_email_area">
            <span className="tooltip">
              <span className="field-title">Secondary Email</span>
              <span className="tooltiptext">
                60 alphanumeric
              </span>
            </span>
            <input
              id="contact.sec_cntc_email_area"
              type="email"
              name="contact.sec_cntc_email_area"
              value={formData.contact.sec_cntc_email_area}
              onChange={handleInputChange}
              maxLength={60}
            />
          </label>
        </div>
      </div>

      <p className="error-message">{errorMessage}</p>
      <button type="button" onClick={handleSubmit}>
        Next Step
      </button>
    </div>
  );
}

export default T619Form;
