import React, { useState } from 'react';
import { T4ASlipData, OtherInfo } from '../types/T4A.types';
import './Form.scss';
import { FIELD_TITLES } from '../utils/FIELD_TITLES';
import FormGroup from './FormGroup';

interface T4ASlipProps {
  onSlipComplete: (slipData: T4ASlipData) => void;
  editingSlip: T4ASlipData | null;
}

export const validateForm = (formData: T4ASlipData): {
  requiredErrors: string[];
  patternErrors: string[];
} => {
  const inputs =
    document.querySelectorAll<HTMLInputElement>('#t4a-slip input');

  const requiredErrors: string[] = [];
  const patternErrors: string[] = [];

  inputs.forEach((input) => {
    if (input.required && input.value === '') {
      requiredErrors.push(input.name);
    } else if (
      input.required &&
      !new RegExp(input.pattern).test(input.value)
    ) {
      patternErrors.push(input.name);
    } else if (
      input.value !== '' &&
      !new RegExp(input.pattern).test(input.value)
    ) {
      patternErrors.push(input.name);
    }
  });

  if (
    formData.sin === '000000000' &&
    formData.rcpnt_bn === '000000000RT0000'
  ) {
    patternErrors.push('sin');
    patternErrors.push('rcpnt_bn');
  }

  return { requiredErrors, patternErrors };
};

function T4ASlip({ onSlipComplete, editingSlip }: T4ASlipProps) {
  const [formData, setFormData] = useState<T4ASlipData>(
    editingSlip || new T4ASlipData(),
  );

  const [errorMessage, setErrorMessage] = useState('');
  const [selectedOtherField, setSelectedOtherField] = useState('none');
  const [otherFields, setOtherFields] = useState<string[]>([]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...(prev[parent as keyof T4ASlipData] as any),
          [child]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleRecipientTypeChange = (
    e: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      sin: value === 'corporation' ? '000000000' : prev.sin,
      rcpnt_bn: value === 'individual' ? '000000000RT0000' : prev.rcpnt_bn,
      recipientName: {
        snm: value === 'corporation' ? '' : prev.recipientName.snm,
        gvn_nm: value === 'corporation' ? '' : prev.recipientName.gvn_nm,
        init: value === 'corporation' ? '' : prev.recipientName.init,
      },
      recipientCorpName: {
        l1_nm: value === 'individual' ? '' : prev.recipientCorpName.l1_nm,
        l2_nm: value === 'individual' ? '' : prev.recipientCorpName.l2_nm,
      },
    }));
  };

  const getFieldTitle = (field: string) => {
    const input = document.getElementById(field) as HTMLInputElement;
    return (
      input?.parentElement?.querySelector('.field-title')?.textContent ?? field
    );
  };

  const handleSubmit = () => {
    const { requiredErrors, patternErrors } = validateForm(formData);
    const requiredErrorsFields = requiredErrors.map(getFieldTitle);
    const patternErrorsFields = patternErrors.map(getFieldTitle);

    if (requiredErrors.length > 0) {
      setErrorMessage(
        `Please fill in the following required fields: ${requiredErrorsFields.join(', ')}`,
      );
      return;
    }

    if (patternErrors.length > 0) {
      setErrorMessage(
        `Please fill in the following fields with the correct format: ${patternErrorsFields.join(', ')}`,
      );
      return;
    }

    onSlipComplete(formData);
  };

  return (
    <div id="t4a-slip" className="">
      <h2>T4A Slip</h2>
      <div className="form-section">
        <h2>Recipient Information</h2>
        <div className="form-group">
          <label htmlFor="recipientType">
            <span className="field-title">Recipient Type:</span>
            <select
              id="recipientType"
              name="recipientType"
              value={formData.recipientType}
              onChange={handleRecipientTypeChange}
            >
              <option value="individual">Individual</option>
              <option value="corporation">Corporation</option>
            </select>
          </label>
        </div>

        {formData.recipientType === 'individual' ? (
          <>
            <div className="form-group">
              <label htmlFor="recipientName.snm">
                <span className="tooltip">
                  <span className="field-title">Surname</span>
                  <span className="tooltiptext">
                    Required, max 20 alphanumeric characters. First 20 letters
                    of the recipient&apos;s surname. Omit titles such as Mr.,
                    Mrs., etc.
                  </span>
                </span>
                <input
                  id="recipientName.snm"
                  type="text"
                  name="recipientName.snm"
                  value={formData.recipientName.snm}
                  onChange={handleInputChange}
                  maxLength={20}
                  pattern={
                    formData.recipientType === 'individual' ? '^.{1,20}$' : '.*'
                  }
                  required={formData.recipientType === 'individual'}
                />
              </label>
            </div>
            <div className="form-group">
              <label htmlFor="recipientName.gvn_nm">
                <span className="tooltip">
                  <span className="field-title">Given Name</span>
                  <span className="tooltiptext">
                    First 12 letters of the recipient&apos;s first given name.
                    If only initials are available, provide the first initial.
                  </span>
                </span>
                <input
                  id="recipientName.gvn_nm"
                  type="text"
                  name="recipientName.gvn_nm"
                  value={formData.recipientName.gvn_nm}
                  onChange={handleInputChange}
                  maxLength={12}
                  pattern={
                    formData.recipientType === 'individual' ? '^.{1,12}$' : '.*'
                  }
                />
              </label>
            </div>
            <div className="form-group">
              <label htmlFor="recipientName.init">
                <span className="tooltip">
                  <span className="field-title">Middle Name Initial</span>
                  <span className="tooltiptext">
                    Single letter initial of the recipient&apos;s second given
                    name.
                  </span>
                </span>
                <input
                  id="recipientName.init"
                  type="text"
                  name="recipientName.init"
                  value={formData.recipientName.init}
                  onChange={handleInputChange}
                  maxLength={1}
                  pattern={
                    formData.recipientType === 'individual'
                      ? '^[a-zA-Z]{1}$'
                      : '.*'
                  }
                />
              </label>
            </div>

            <div className="form-group">
              <label htmlFor="sin">
                <span className="tooltip">
                  <span className="field-title">SIN</span>
                  <span className="tooltiptext">
                    Required, 9 numeric characters. <br />
                    Where the recipient has failed to provide a SIN, or is
                    filing for a corporation enter zeroes in the field. <br />
                    Omission of a valid SIN results in non-registration of
                    contributions to the Canada Pension Plan.
                  </span>
                </span>
                <input
                  id="sin"
                  type="text"
                  name="sin"
                  value={formData.sin}
                  onChange={handleInputChange}
                  maxLength={9}
                  pattern="^[0-9]{9}$"
                  required
                />
              </label>
            </div>
          </>
        ) : (
          <>
            <div className="form-group">
              <label htmlFor="recipientCorpName.l1_nm">
                <span className="tooltip">
                  <span className="field-title">Corporation Name Line 1</span>
                  <span className="tooltiptext">
                    Required, 30 alphanumeric characters. <br />
                    The first line of the recipient&apos;s name. <br />
                    If &quot;&amp;&quot; is used in the name area enter as
                    &quot;&amp;amp;&quot;
                  </span>
                </span>
                <input
                  id="recipientCorpName.l1_nm"
                  type="text"
                  name="recipientCorpName.l1_nm"
                  value={formData.recipientCorpName.l1_nm}
                  onChange={handleInputChange}
                  maxLength={30}
                  pattern={
                    formData.recipientType === 'corporation'
                      ? '^.{1,30}$'
                      : '.*'
                  }
                  required={formData.recipientType === 'corporation'}
                />
              </label>
            </div>
            <div className="form-group">
              <label htmlFor="recipientCorpName.l2_nm">
                <span className="field-title">Corporation Name Line 2</span>
                <input
                  id="recipientCorpName.l2_nm"
                  type="text"
                  name="recipientCorpName.l2_nm"
                  value={formData.recipientCorpName.l2_nm}
                  onChange={handleInputChange}
                  maxLength={30}
                  pattern={
                    formData.recipientType === 'corporation'
                      ? '^.{1,30}$'
                      : '.*'
                  }
                />
              </label>
            </div>

            <div className="form-group">
              <label htmlFor="rcpnt_bn">
                <span className="tooltip">
                  <span className="field-title">Recipient Business Number</span>
                  <span className="tooltiptext">
                    Required, 9 numeric characters, RT, RZ, RP or RC followed by
                    4 numeric characters. <br />
                    The recipient&apos;s business number.
                  </span>
                </span>
                <input
                  id="rcpnt_bn"
                  type="text"
                  name="rcpnt_bn"
                  value={formData.rcpnt_bn}
                  onChange={handleInputChange}
                  maxLength={15}
                  pattern="^[0-9]{9}(RT|RZ|RP|RC)[0-9]{4}$"
                  required
                />
              </label>
            </div>
          </>
        )}

        <div className="form-group">
          <label htmlFor="recipientAddress.addr_l1_txt">
            <span className="tooltip">
              <span className="field-title">Address Line 1</span>
              <span className="tooltiptext">30 alphanumeric characters.</span>
            </span>
            <input
              id="recipientAddress.addr_l1_txt"
              type="text"
              name="recipientAddress.addr_l1_txt"
              value={formData.recipientAddress.addr_l1_txt}
              onChange={handleInputChange}
              maxLength={30}
              pattern="^.{1,30}$"
            />
          </label>
        </div>

        <div className="form-group">
          <label htmlFor="recipientAddress.addr_l2_txt">
            <span className="tooltip">
              <span className="field-title">Address Line 2</span>
              <span className="tooltiptext">30 alphanumeric characters.</span>
            </span>
            <input
              id="recipientAddress.addr_l2_txt"
              type="text"
              name="recipientAddress.addr_l2_txt"
              value={formData.recipientAddress.addr_l2_txt}
              onChange={handleInputChange}
              maxLength={30}
              pattern="^.{1,30}$"
            />
          </label>
        </div>

        <div className="form-group">
          <label htmlFor="recipientAddress.cty_nm">
            <span className="tooltip">
              <span className="field-title">City</span>
              <span className="tooltiptext">28 alphanumeric characters.</span>
            </span>
            <input
              id="recipientAddress.cty_nm"
              type="text"
              name="recipientAddress.cty_nm"
              value={formData.recipientAddress.cty_nm}
              onChange={handleInputChange}
              maxLength={28}
              pattern="^.{1,28}$"
            />
          </label>
        </div>

        <div className="form-group">
          <label htmlFor="recipientAddress.prov_cd">
            <span className="tooltip">
              <span className="field-title">Province/Territory Code</span>
              <span className="tooltiptext">
                2 alpha characters. The Canadian province or territory code, USA
                state code or &quot;ZZ&quot; for foreign country.
              </span>
            </span>
            <input
              id="recipientAddress.prov_cd"
              type="text"
              name="recipientAddress.prov_cd"
              value={formData.recipientAddress.prov_cd}
              onChange={handleInputChange}
              maxLength={2}
              pattern="^[A-Z]{2}$"
            />
          </label>
        </div>

        <div className="form-group">
          <label htmlFor="recipientAddress.cntry_cd">
            <span className="tooltip">
              <span className="field-title">Country Code</span>
              <span className="tooltiptext">
                3 alpha characters. The country code, &quot;CAN&quot; for
                Canada, &quot;USA&quot; for USA. See{' '}
                <a
                  href="https://www.iban.com/country-codes"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  International Standard (ISO) 3166 Codes for the Representation
                  of Names of Countries
                </a>
                .
              </span>
            </span>
            <input
              id="recipientAddress.cntry_cd"
              type="text"
              name="recipientAddress.cntry_cd"
              value={formData.recipientAddress.cntry_cd}
              onChange={handleInputChange}
              maxLength={3}
              pattern="^[A-Z]{3}$"
            />
          </label>
        </div>

        <div className="form-group">
          <label htmlFor="recipientAddress.pstl_cd">
            <span className="tooltip">
              <span className="field-title">Postal Code</span>
              <span className="tooltiptext">
                10 alphanumeric characters. <br />
                <br />
                Canadian, USA or foreign postal code.
              </span>
            </span>
            <input
              id="recipientAddress.pstl_cd"
              type="text"
              name="recipientAddress.pstl_cd"
              value={formData.recipientAddress.pstl_cd}
              onChange={handleInputChange}
              maxLength={10}
              pattern="^.{1,10}$"
            />
          </label>
        </div>

        <div className="form-group">
          <label htmlFor="rcpnt_nbr">
            <span className="tooltip">
              <span className="field-title">Recipient Number</span>
              <span className="tooltiptext">
                20 alphanumeric characters. <br />
                for example: region and/or branch payroll and/or department
                and/or recipient number
              </span>
            </span>
            <input
              id="rcpnt_nbr"
              type="text"
              name="rcpnt_nbr"
              value={formData.rcpnt_nbr}
              onChange={handleInputChange}
              maxLength={20}
              pattern="^.{1,20}$"
            />
          </label>
        </div>

        <div className="form-group">
          <label htmlFor="payr_dntl_ben_rpt_cd">
            <span className="tooltip">
              <span className="field-title">
                Payer Dental Benefits Report Code
              </span>
              <span className="tooltiptext">
                Required if amount in field Pension or Superannuation is
                reported. <br />
              </span>
            </span>
            <select
              id="payr_dntl_ben_rpt_cd"
              name="payr_dntl_ben_rpt_cd"
              value={formData.payr_dntl_ben_rpt_cd}
              onChange={handleInputChange}
            >
              <option value="">None</option>
              <option value="1">Not eligible</option>
              <option value="2">Payee only</option>
              <option value="3">Payee, spouse and dependent children</option>
              <option value="4">Payee and their spouse</option>
              <option value="5">Payee and their dependent children</option>
            </select>
          </label>
        </div>

        <div className="form-group">
          <label htmlFor="ppln_dpsp_rgst_nbr">
            <span className="tooltip">
              Plan or DPSP Registration Number:
              <span className="tooltiptext">
                7 numeric characters. <br />
                <br />
                enter the registration number issued by the CRA for the plan
                where the most amount of pension adjustment was reported
              </span>
            </span>
            <input
              id="ppln_dpsp_rgst_nbr"
              type="text"
              name="ppln_dpsp_rgst_nbr"
              value={formData.ppln_dpsp_rgst_nbr}
              onChange={handleInputChange}
              maxLength={7}
              pattern="^[0-9]{7}$"
            />
          </label>
        </div>

        <div className="form-group">
          <label htmlFor="rpt_tcd">
            <span className="tooltip">
              <span className="field-title">Report Type Code</span>
              <span className="tooltiptext">
                Required <br />
                <br />
                Note: An amended return cannot contain an original slip.
              </span>
            </span>
            <select
              id="rpt_tcd"
              name="rpt_tcd"
              value={formData.rpt_tcd}
              onChange={handleInputChange}
            >
              <option value="O">Original</option>
              <option value="A">Amendment</option>
              <option value="C">Cancel</option>
            </select>
          </label>
        </div>
      </div>

      <div className="form-section">
        <h2>Amount Information</h2>
        <div className="form-group">
          <label htmlFor="amounts.pens_spran_amt">
            <span className="tooltip">
              <span className="field-title">Pension or Superannuation</span>
              <span className="tooltiptext">
                Required, 11 numeric characters. Enter dollars & cents.
              </span>
            </span>
            <input
              id="amounts.pens_spran_amt"
              type="text"
              name="amounts.pens_spran_amt"
              value={formData.amounts.pens_spran_amt}
              onChange={handleInputChange}
              maxLength={11}
            />
          </label>
        </div>

        <div className="form-group">
          <label htmlFor="amounts.lsp_amt">
            <span className="tooltip">
              <span className="field-title">Lump-sum Payments</span>
              <span className="tooltiptext">
                Required, 11 numeric characters. Enter dollars & cents.
              </span>
            </span>
            <input
              id="amounts.lsp_amt"
              type="text"
              name="amounts.lsp_amt"
              value={formData.amounts.lsp_amt}
              onChange={handleInputChange}
              maxLength={11}
            />
          </label>
        </div>

        <div className="form-group">
          <label htmlFor="amounts.self_empl_cmsn_amt">
            <span className="tooltip">
              <span className="field-title">Self-employed Commissions</span>
              <span className="tooltiptext">
                Required, 11 numeric characters. Enter dollars & cents.
              </span>
            </span>
            <input
              id="amounts.self_empl_cmsn_amt"
              type="text"
              name="amounts.self_empl_cmsn_amt"
              value={formData.amounts.self_empl_cmsn_amt}
              onChange={handleInputChange}
              maxLength={11}
            />
          </label>
        </div>

        <div className="form-group">
          <label htmlFor="amounts.itx_ddct_amt">
            <span className="tooltip">
              <span className="field-title">Income Tax Deducted</span>
              <span className="tooltiptext">
                Required, 11 numeric characters. Enter dollars & cents.
              </span>
            </span>
            <input
              id="amounts.itx_ddct_amt"
              type="text"
              name="amounts.itx_ddct_amt"
              value={formData.amounts.itx_ddct_amt}
              onChange={handleInputChange}
              maxLength={11}
            />
          </label>
        </div>

        <div className="form-group">
          <label htmlFor="amounts.annty_amt">
            <span className="tooltip">
              <span className="field-title">Annuities</span>
              <span className="tooltiptext">
                Required, 11 numeric characters. Enter dollars & cents.
              </span>
            </span>
            <input
              id="amounts.annty_amt"
              type="text"
              name="amounts.annty_amt"
              value={formData.amounts.annty_amt}
              onChange={handleInputChange}
              maxLength={11}
            />
          </label>
        </div>

        <div className="form-group">
          <label htmlFor="amounts.fee_or_oth_srvc_amt">
            <span className="tooltip">
              <span className="field-title">Fees for Services</span>
              <span className="tooltiptext">
                Required, 11 numeric characters. Enter dollars & cents.
              </span>
            </span>
            <input
              id="amounts.fee_or_oth_srvc_amt"
              type="text"
              name="amounts.fee_or_oth_srvc_amt"
              value={formData.amounts.fee_or_oth_srvc_amt}
              onChange={handleInputChange}
              maxLength={11}
            />
          </label>
        </div>
      </div>

      <div className="form-section">
        <h2>Other Information</h2>
        <span className="tooltip">
          Note: All of the other information amounts are from the Other
          Information fields at the bottom of the T4A slip. <br />
          <br />
          If more than twelve (12) Other Information Fields are used, create an
          additional T4A slip to report the additional amounts
        </span>

        {otherFields.map((field) => (
          <div className="form-group" key={field}>
            <label htmlFor={`otherInfo.${field}`}>
              <span className="tooltip">
                <span className="field-title">
                  {
                    FIELD_TITLES.otherInfo[
                      field as keyof typeof FIELD_TITLES.otherInfo
                    ]
                  }
                </span>
                <span className="tooltiptext">
                  11 numeric characters. Enter dollars & cents.
                </span>
              </span>
              <div className="other-field-input-container">
                <input
                  id={`otherInfo.${field}`}
                  type="text"
                  name={`otherInfo.${field}`}
                  value={formData.otherInfo[field as keyof OtherInfo]}
                  onChange={handleInputChange}
                  maxLength={11}
                />
                <button
                  type="button"
                  className="remove-other-field-button"
                  onClick={() => {
                    setOtherFields(otherFields.filter((f) => f !== field));
                    formData.otherInfo[field as keyof OtherInfo] = '';
                  }}
                >
                  Remove
                </button>
              </div>
            </label>
          </div>
        ))}

        <hr />
        <div className="form-group add-other-field">
          <select
            className="add-other-field-select"
            name="otherFields"
            id="otherFields"
            onChange={(e) => setSelectedOtherField(e.target.value)}
          >
            <option key="none" value="none">
              Select an Other Field
            </option>
            {Object.entries(FIELD_TITLES.otherInfo)
              .filter(([key]) => !otherFields.includes(key))
              .map(([key, title]) => (
                <option key={key} value={key}>
                  {title}
                </option>
              ))}
          </select>
          <button
            type="button"
            className="add-other-field-button"
            onClick={() => {
              setOtherFields([...otherFields, selectedOtherField]);
              setSelectedOtherField('none');
            }}
            disabled={selectedOtherField === 'none'}
          >
            Add Other Field
          </button>
        </div>
      </div>
      <p className="error-message">{errorMessage}</p>
      <button type="button" onClick={handleSubmit}>
        Save Slip
      </button>
    </div>
  );
}

export default T4ASlip;
