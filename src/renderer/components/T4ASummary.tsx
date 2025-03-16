import React, { useEffect, useState } from 'react';
import {
  T4ASummaryData,
  T4ASlipData,
  T4ATotalAmounts,
} from '../types/T4A.types';
import './Form.scss';

interface T4ASummaryProps {
  slips: T4ASlipData[];
  summaryData: T4ASummaryData;
  setSummaryData: React.Dispatch<React.SetStateAction<T4ASummaryData>>;
  generateXML: () => void;
}

function T4ASummary({
  slips,
  summaryData,
  setSummaryData,
  generateXML,
}: T4ASummaryProps) {
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const currencyToIntegerCents = (amount: string) => {
      let formattedAmount = amount;

      if (amount === '') {
        return 0;
      }

      if (amount.includes('.')) {
        if (amount.split('.')[1].length === 0) {
          formattedAmount = `${amount}00`;
        } else if (amount.split('.')[1].length === 1) {
          formattedAmount = `${amount}0`;
        } else if (amount.split('.')[1].length > 2) {
          throw new Error('Amount cannot have more than 2 decimal places');
        }
      } else {
        formattedAmount = `${amount}.00`;
      }

      return parseInt(formattedAmount.replace('.', ''), 10);
    };

    const addCurrency = (amount: string, prev: string) => {
      let total = (
        currencyToIntegerCents(amount) + currencyToIntegerCents(prev)
      ).toString();

      total = '0'.repeat(Math.max(0, 3 - total.length)) + total;
      const formattedTotal = `${total.slice(0, -2)}.${total.slice(-2)}`;

      if (formattedTotal === '0.00') {
        return '';
      }

      return formattedTotal;
    };
    const totals: T4ATotalAmounts = slips.reduce(
      (acc, slip) => {
        // Sum up all the amounts
        acc.tot_pens_spran_amt = addCurrency(
          slip.amounts.pens_spran_amt,
          acc.tot_pens_spran_amt,
        );
        acc.tot_lsp_amt = addCurrency(slip.amounts.lsp_amt, acc.tot_lsp_amt);
        acc.tot_self_cmsn_amt = addCurrency(
          slip.amounts.self_empl_cmsn_amt,
          acc.tot_self_cmsn_amt,
        );
        acc.tot_ptrng_aloc_amt = addCurrency(
          slip.otherInfo.ptrng_aloc_amt,
          acc.tot_ptrng_aloc_amt,
        );
        acc.tot_past_srvc_amt = addCurrency(
          slip.otherInfo.rpp_past_srvc_amt,
          acc.tot_past_srvc_amt,
        );
        acc.tot_annty_incamt = addCurrency(
          slip.amounts.annty_amt,
          acc.tot_annty_incamt,
        );
        acc.totr_incamt = addCurrency(
          slip.otherInfo.oth_incamt,
          acc.totr_incamt,
        );
        acc.tot_itx_dedn_amt = addCurrency(
          slip.amounts.itx_ddct_amt,
          acc.tot_itx_dedn_amt,
        );
        acc.tot_padj_amt = addCurrency(
          slip.otherInfo.padj_amt,
          acc.tot_padj_amt,
        );
        acc.tot_resp_aip_amt = addCurrency(
          slip.otherInfo.resp_aip_amt,
          acc.tot_resp_aip_amt,
        );
        acc.tot_resp_amt = addCurrency(
          slip.otherInfo.resp_educt_ast_amt,
          acc.tot_resp_amt,
        );
        acc.rpt_tot_fee_srvc_amt = addCurrency(
          slip.amounts.fee_or_oth_srvc_amt,
          acc.rpt_tot_fee_srvc_amt,
        );

        let otherInfoTotal = '0';

        Object.entries(slip.otherInfo).forEach(([key, value]) => {
          const blackListedKeys = [
            'rpp_past_srvc_amt',
            'oth_incamt',
            'ptrng_aloc_amt',
            'padj_amt',
            'resp_aip_amt',
            'resp_educt_ast_amt',
          ];

          if (!blackListedKeys.includes(key)) {
            otherInfoTotal = addCurrency(value, otherInfoTotal);
          }
        });

        acc.rpt_tot_oth_info_amt = addCurrency(
          otherInfoTotal,
          acc.rpt_tot_oth_info_amt,
        );

        return acc;
      },
      {
        tot_pens_spran_amt: '', // Pension or superannuation, box 016
        tot_lsp_amt: '', // Lump sum payments, box 018
        tot_self_cmsn_amt: '', // Self-employed commissions, box 020
        tot_ptrng_aloc_amt: '', // Other information -> Patronage allocations, box 030
        tot_past_srvc_amt: '', // Other information -> Total pension plan contributions (past service), box 032
        tot_annty_incamt: '', // Annuities, box 024
        totr_incamt: '', // Other information -> Other income, box 028
        tot_itx_dedn_amt: '', // Income tax deducted, box 022
        tot_padj_amt: '', // Other information -> Pension adjustment, box 034
        tot_resp_aip_amt: '', // Other information -> RESP accumulated income payments, box 040
        tot_resp_amt: '', // Other information -> RESP educational assistance payments, box 042
        rpt_tot_fee_srvc_amt: '', // Fees for services, box 048
        rpt_tot_oth_info_amt: '', // Other information, does not include boxes 016, 018, 020, 022, 024, 028, 030, 032, 034, 040, 042, 048
      },
    );

    setSummaryData((prev) => ({
      ...prev,
      totalAmounts: {
        ...prev.totalAmounts,
        ...totals,
      },
      slp_cnt: slips.length.toString(),
    }));
  }, [setSummaryData, slips]);

  const validateForm = (): {
    requiredErrors: string[];
    patternErrors: string[];
  } => {
    const inputs =
      document.querySelectorAll<HTMLInputElement>('#t4a-summary input');
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

    return { requiredErrors, patternErrors };
  };

  const getFieldTitle = (field: string) => {
    const input = document.getElementById(field) as HTMLInputElement;
    return (
      input?.parentElement?.querySelector('.field-title')?.textContent ?? field
    );
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;

    if (name.includes('.')) {
      const [parent, child] = name.split('.');

      setSummaryData((prev: T4ASummaryData) => ({
        ...prev,
        [parent]: {
          ...(prev[parent as keyof T4ASummaryData] as any),
          [child]: value,
        },
      }));
    } else {
      setSummaryData((prev: T4ASummaryData) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = () => {
    const { requiredErrors, patternErrors } = validateForm();
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

    setSummaryData(summaryData);
    setErrorMessage('');
    generateXML();
  };

  return (
    <div id="t4a-summary" className="form">
      <h2>T4A Summary</h2>
      <div className="form-section">
        <h2>Payer Information</h2>
        <div className="form-group">
          <label htmlFor="payerName.l1_nm">
            <span className="tooltip">
              <span className="field-title">Payer Name Line 1</span>
              <span className="tooltiptext">
                Required, 30 alphanumeric characters. If &quot;&amp;&quot; is
                used in the name, use &quot;&amp;amp;&quot; instead.
              </span>
            </span>
            <input
              id="payerName.l1_nm"
              type="text"
              name="payerName.l1_nm"
              value={summaryData.payerName.l1_nm}
              onChange={handleInputChange}
              maxLength={30}
              pattern="^.{1,30}$"
              required
            />
          </label>
        </div>

        <div className="form-group">
          <label htmlFor="payerName.l2_nm">
            <span className="field-title">Payer Name Line 2</span>
            <input
              id="payerName.l2_nm"
              type="text"
              name="payerName.l2_nm"
              value={summaryData.payerName.l2_nm}
              onChange={handleInputChange}
              maxLength={30}
            />
          </label>
        </div>

        <div className="form-group">
          <label htmlFor="payerName.l3_nm">
            <span className="field-title">Payer Name Line 3</span>
            <input
              id="payerName.l3_nm"
              type="text"
              name="payerName.l3_nm"
              value={summaryData.payerName.l3_nm}
              onChange={handleInputChange}
              maxLength={30}
            />
          </label>
        </div>

        <div className="form-group">
          <label htmlFor="payerAddress.addr_l1_txt">
            <span className="tooltip">
              <span className="field-title">Payer Address Line 1</span>
              <span className="tooltiptext">30 alphanumeric characters.</span>
            </span>
            <input
              id="payerAddress.addr_l1_txt"
              type="text"
              name="payerAddress.addr_l1_txt"
              value={summaryData.payerAddress.addr_l1_txt}
              onChange={handleInputChange}
              maxLength={30}
            />
          </label>
        </div>

        <div className="form-group">
          <label htmlFor="payerAddress.addr_l2_txt">
            <span className="tooltip">
              <span className="field-title">Payer Address Line 2</span>
              <span className="tooltiptext">30 alphanumeric characters.</span>
            </span>
            <input
              id="payerAddress.addr_l2_txt"
              type="text"
              name="payerAddress.addr_l2_txt"
              value={summaryData.payerAddress.addr_l2_txt}
              onChange={handleInputChange}
              maxLength={30}
            />
          </label>
        </div>

        <div className="form-group">
          <label htmlFor="payerAddress.cty_nm">
            <span className="tooltip">
              <span className="field-title">Payer City</span>
              <span className="tooltiptext">28 alphanumeric characters.</span>
            </span>
            <input
              id="payerAddress.cty_nm"
              type="text"
              name="payerAddress.cty_nm"
              value={summaryData.payerAddress.cty_nm}
              onChange={handleInputChange}
              maxLength={28}
            />
          </label>
        </div>

        <div className="form-group">
          <label htmlFor="payerAddress.prov_cd">
            <span className="tooltip">
              <span className="field-title">Payer Province/Territory Code</span>
              <span className="tooltiptext">
                2 alpha characters. <br />
                <br />
                The Canadian province or territory code, USA state code or
                &quot;ZZ&quot; for foreign country.
              </span>
            </span>
            <input
              id="payerAddress.prov_cd"
              type="text"
              name="payerAddress.prov_cd"
              value={summaryData.payerAddress.prov_cd}
              onChange={handleInputChange}
              maxLength={2}
              pattern="^[A-Z]{2}$"
            />
          </label>
        </div>

        <div className="form-group">
          <label htmlFor="payerAddress.cntry_cd">
            <span className="tooltip">
              <span className="field-title">Payer Country Code</span>
              <span className="tooltiptext">
                3 alpha characters.
                <br />
                <br />
                The country code, &quot;CAN&quot; for Canada, &quot;USA&quot;
                for USA. See{' '}
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
              id="payerAddress.cntry_cd"
              type="text"
              name="payerAddress.cntry_cd"
              value={summaryData.payerAddress.cntry_cd}
              onChange={handleInputChange}
              maxLength={3}
              pattern="^[A-Z]{3}$"
            />
          </label>
        </div>

        <div className="form-group">
          <label htmlFor="payerAddress.pstl_cd">
            <span className="tooltip">
              <span className="field-title">Payer Postal Code</span>
              <span className="tooltiptext">
                10 alphanumeric characters. <br />
                <br />
                Canadian, USA or foreign postal code.
              </span>
            </span>
            <input
              id="payerAddress.pstl_cd"
              type="text"
              name="payerAddress.pstl_cd"
              value={summaryData.payerAddress.pstl_cd}
              onChange={handleInputChange}
              maxLength={10}
              pattern="^[a-zA-Z0-9]{10}$"
            />
          </label>
        </div>

        <div className="form-group">
          <label htmlFor="bn">
            <span className="tooltip">
              <span className="field-title">
                Payer&apos;s Account Number (BN)
              </span>
              <span className="tooltiptext">
                Required, 9 numeric characters, RT, RZ, RP or RC followed by 4
                numeric characters. <br />
                <br />
                enter the Account Number as used on Form PD7A, Statement of
                Account for Current Source Deductions
              </span>
            </span>
            <input
              id="bn"
              type="text"
              name="bn"
              value={summaryData.bn}
              onChange={handleInputChange}
              maxLength={15}
              pattern="^[0-9]{9}(RT|RZ|RP|RC)[0-9]{4}$"
              required
            />
          </label>
        </div>
      </div>

      <div className="form-section">
        <h2>Contact Information</h2>
        <div className="form-group">
          <label htmlFor="contact.cntc_nm">
            <span className="tooltip">
              <span className="field-title">Contact Name</span>
              <span className="tooltiptext">
                Required, 22 alphanumeric characters. <br />
                <br />
                Contact&apos;s first name followed by surname for this return.
              </span>
            </span>
            <input
              id="contact.cntc_nm"
              type="text"
              name="contact.cntc_nm"
              value={summaryData.contact.cntc_nm}
              onChange={handleInputChange}
              maxLength={22}
              pattern="^[a-zA-Z0-9\s&amp;]{1,22}$"
              required
            />
          </label>
        </div>

        <div className="form-group">
          <label htmlFor="contact.cntc_area_cd">
            <span className="tooltip">
              <span className="field-title">Contact Area Code</span>
              <span className="tooltiptext">
                Required, 3 numeric characters.
                <br />
                <br />
                The area code of the contact&apos;s phone number.
              </span>
            </span>
            <input
              id="contact.cntc_area_cd"
              type="text"
              name="contact.cntc_area_cd"
              value={summaryData.contact.cntc_area_cd}
              onChange={handleInputChange}
              maxLength={3}
              pattern="^[0-9]{3}$"
              required
            />
          </label>
        </div>

        <div className="form-group">
          <label htmlFor="contact.cntc_phn_nbr">
            <span className="tooltip">
              <span className="field-title">Contact Phone Number</span>
              <span className="tooltiptext">
                Required, 3 numeric with a (-), followed by 4 numeric
                characters.
              </span>
            </span>
            <input
              id="contact.cntc_phn_nbr"
              type="text"
              name="contact.cntc_phn_nbr"
              value={summaryData.contact.cntc_phn_nbr}
              onChange={handleInputChange}
              maxLength={8}
              pattern="^[0-9]{3}-[0-9]{4}$"
              required
            />
          </label>
        </div>

        <div className="form-group">
          <label htmlFor="contact.cntc_extn_nbr">
            <span className="tooltip">
              <span className="field-title">Contact Extension</span>
              <span className="tooltiptext">5 numeric characters.</span>
            </span>
            <input
              id="contact.cntc_extn_nbr"
              type="text"
              name="contact.cntc_extn_nbr"
              value={summaryData.contact.cntc_extn_nbr}
              onChange={handleInputChange}
              maxLength={5}
              pattern="^[0-9]{5}$"
            />
          </label>
        </div>
      </div>

      <div className="form-section">
        <h2>Summary Information</h2>
        <div className="form-group">
          <label htmlFor="tx_yr">
            <span className="tooltip">
              <span className="field-title">Taxation Year</span>
              <span className="tooltiptext">
                Required, 4 numeric characters.
              </span>
            </span>
            <input
              id="tx_yr"
              type="text"
              name="tx_yr"
              value={summaryData.tx_yr}
              onChange={handleInputChange}
              maxLength={4}
              pattern="^[0-9]{4}$"
              required
            />
          </label>
        </div>

        <div className="form-group">
          <label htmlFor="slp_cnt">
            <span className="tooltip">
              <span className="field-title">
                Total Number of T4A Slip Records
              </span>
              <span className="tooltiptext">
                Required, 7 numeric characters. The total number of T4A slips
                for this return.
              </span>
            </span>
            <input
              id="slp_cnt"
              type="text"
              name="slp_cnt"
              value={summaryData.slp_cnt}
              onChange={handleInputChange}
              maxLength={7}
              pattern="^[0-9]{1,7}$"
              required
              disabled
            />
          </label>
        </div>

        <div className="form-group">
          <label htmlFor="rppNumber.rpp_rgst_1_nbr">
            <span className="field-title">
              Registered pension plan registration number 1
            </span>
            <input
              id="rppNumber.rpp_rgst_1_nbr"
              type="text"
              name="rppNumber.rpp_rgst_1_nbr"
              value={summaryData.rppNumber.rpp_rgst_1_nbr}
              onChange={handleInputChange}
              maxLength={7}
              pattern="^[0-9]{7}$"
            />
          </label>
        </div>

        <div className="form-group">
          <label htmlFor="rppNumber.rpp_rgst_2_nbr">
            <span className="field-title">
              Registered pension plan registration number 2
            </span>
            <input
              id="rppNumber.rpp_rgst_2_nbr"
              type="text"
              name="rppNumber.rpp_rgst_2_nbr"
              value={summaryData.rppNumber.rpp_rgst_2_nbr}
              onChange={handleInputChange}
              maxLength={7}
              pattern="^[0-9]{7}$"
            />
          </label>
        </div>

        <div className="form-group">
          <label htmlFor="rppNumber.rpp_rgst_3_nbr">
            <span className="field-title">
              Registered pension plan registration number 3
            </span>
            <input
              id="rppNumber.rpp_rgst_3_nbr"
              type="text"
              name="rppNumber.rpp_rgst_3_nbr"
              value={summaryData.rppNumber.rpp_rgst_3_nbr}
              onChange={handleInputChange}
              maxLength={7}
              pattern="^[0-9]{7}$"
            />
          </label>
        </div>

        <div className="form-group">
          <label htmlFor="proprietorSin.pprtr_1_sin">
            <span className="tooltip">
              <span className="field-title">Proprietor #1 SIN</span>
              <span className="tooltiptext">
                9 numeric characters.
                <br />
                <br />
                If the employer is a Canadian-controlled private corporation or
                unincorporated, enter the SIN of the proprietor #1 or principal
                owner.
              </span>
            </span>
            <input
              id="proprietorSin.pprtr_1_sin"
              type="text"
              name="proprietorSin.pprtr_1_sin"
              value={summaryData.proprietorSin.pprtr_1_sin}
              onChange={handleInputChange}
              maxLength={9}
              pattern="^[0-9]{9}$"
            />
          </label>
        </div>

        <div className="form-group">
          <label htmlFor="proprietorSin.pprtr_2_sin">
            <span className="tooltip">
              <span className="field-title">Proprietor #2 SIN</span>
              <span className="tooltiptext">
                9 numeric characters.
                <br />
                <br />
                If the employer is a Canadian-controlled private corporation or
                unincorporated, enter the SIN of the proprietor #2 or second
                principal owner.
              </span>
            </span>
            <input
              id="proprietorSin.pprtr_2_sin"
              type="text"
              name="proprietorSin.pprtr_2_sin"
              value={summaryData.proprietorSin.pprtr_2_sin}
              onChange={handleInputChange}
              maxLength={9}
              pattern="^[0-9]{9}$"
            />
          </label>
        </div>

        <div className="form-group">
          <label htmlFor="rpt_tcd">
            <span className="field-title">Report Type Code</span>
            <select
              id="rpt_tcd"
              name="rpt_tcd"
              value={summaryData.rpt_tcd}
              onChange={handleInputChange}
            >
              <option value="O">Original</option>
              <option value="A">Amendment</option>
              <option value="C">Cancel</option>
            </select>
          </label>
        </div>

        <div className="form-group">
          <label htmlFor="fileramendmentnote">
            <span className="tooltip">
              <span className="field-title">Filer Amendment Note</span>
              <span className="tooltiptext">
                1309 alphanumeric characters. <br />
                <br />
                Use only for amendment-type slips.
              </span>
            </span>
            <textarea
              id="fileramendmentnote"
              name="fileramendmentnote"
              value={summaryData.fileramendmentnote}
              onChange={handleInputChange}
              maxLength={1309}
              disabled={summaryData.rpt_tcd !== 'A'}
            />
          </label>
        </div>
      </div>

      <div className="form-section">
        <h2>Total Amounts</h2>
        <div className="form-group">
          <label htmlFor="totalAmounts.tot_pens_spran_amt">
            <span className="field-title">Total Pension or Superannuation</span>
            <input
              id="totalAmounts.tot_pens_spran_amt"
              type="text"
              name="totalAmounts.tot_pens_spran_amt"
              value={summaryData.totalAmounts.tot_pens_spran_amt}
              onChange={handleInputChange}
              maxLength={15}
              disabled
            />
          </label>
        </div>

        <div className="form-group">
          <label htmlFor="totalAmounts.tot_lsp_amt">
            <span className="field-title">Total Lump-sum Payments</span>
            <input
              id="totalAmounts.tot_lsp_amt"
              type="text"
              name="totalAmounts.tot_lsp_amt"
              value={summaryData.totalAmounts.tot_lsp_amt}
              onChange={handleInputChange}
              maxLength={15}
              disabled
            />
          </label>
        </div>

        <div className="form-group">
          <label htmlFor="totalAmounts.tot_self_cmsn_amt">
            <span className="field-title">Total Self-employed Commissions</span>
            <input
              id="totalAmounts.tot_self_cmsn_amt"
              type="text"
              name="totalAmounts.tot_self_cmsn_amt"
              value={summaryData.totalAmounts.tot_self_cmsn_amt}
              onChange={handleInputChange}
              maxLength={15}
              disabled
            />
          </label>
        </div>

        <div className="form-group">
          <label htmlFor="totalAmounts.tot_ptrng_aloc_amt">
            <span className="field-title">Total Patronage Allocations</span>
            <input
              id="totalAmounts.tot_ptrng_aloc_amt"
              type="text"
              name="totalAmounts.tot_ptrng_aloc_amt"
              value={summaryData.totalAmounts.tot_ptrng_aloc_amt}
              onChange={handleInputChange}
              maxLength={15}
              disabled
            />
          </label>
        </div>

        <div className="form-group">
          <label htmlFor="totalAmounts.tot_past_srvc_amt">
            <span className="field-title">
              Total Pension Plan Contributions (Past Service)
            </span>
            <input
              id="totalAmounts.tot_past_srvc_amt"
              type="text"
              name="totalAmounts.tot_past_srvc_amt"
              value={summaryData.totalAmounts.tot_past_srvc_amt}
              onChange={handleInputChange}
              maxLength={15}
              disabled
            />
          </label>
        </div>

        <div className="form-group">
          <label htmlFor="totalAmounts.tot_annty_incamt">
            <span className="field-title">Total Annuities</span>
            <input
              id="totalAmounts.tot_annty_incamt"
              type="text"
              name="totalAmounts.tot_annty_incamt"
              value={summaryData.totalAmounts.tot_annty_incamt}
              onChange={handleInputChange}
              maxLength={15}
              disabled
            />
          </label>
        </div>

        <div className="form-group">
          <label htmlFor="totalAmounts.totr_incamt">
            <span className="field-title">Total Other Income</span>
            <input
              id="totalAmounts.totr_incamt"
              type="text"
              name="totalAmounts.totr_incamt"
              value={summaryData.totalAmounts.totr_incamt}
              onChange={handleInputChange}
              maxLength={15}
              disabled
            />
          </label>
        </div>

        <div className="form-group">
          <label htmlFor="totalAmounts.tot_itx_dedn_amt">
            <span className="field-title">Total Income Tax Deducted</span>
            <input
              id="totalAmounts.tot_itx_dedn_amt"
              type="text"
              name="totalAmounts.tot_itx_dedn_amt"
              value={summaryData.totalAmounts.tot_itx_dedn_amt}
              onChange={handleInputChange}
              maxLength={13}
              disabled
            />
          </label>
        </div>

        <div className="form-group">
          <label htmlFor="totalAmounts.tot_padj_amt">
            <span className="field-title">Total Pension Adjustment</span>
            <input
              id="totalAmounts.tot_padj_amt"
              type="text"
              name="totalAmounts.tot_padj_amt"
              value={summaryData.totalAmounts.tot_padj_amt}
              onChange={handleInputChange}
              maxLength={15}
              disabled
            />
          </label>
        </div>

        <div className="form-group">
          <label htmlFor="totalAmounts.tot_resp_aip_amt">
            <span className="field-title">
              Total RESP Accumulated Income Payments
            </span>
            <input
              id="totalAmounts.tot_resp_aip_amt"
              type="text"
              name="totalAmounts.tot_resp_aip_amt"
              value={summaryData.totalAmounts.tot_resp_aip_amt}
              onChange={handleInputChange}
              maxLength={15}
              disabled
            />
          </label>
        </div>

        <div className="form-group">
          <label htmlFor="totalAmounts.tot_resp_amt">
            <span className="field-title">
              Total RESP Educational Assistance Payments
            </span>
            <input
              id="totalAmounts.tot_resp_amt"
              type="text"
              name="totalAmounts.tot_resp_amt"
              value={summaryData.totalAmounts.tot_resp_amt}
              onChange={handleInputChange}
              maxLength={15}
              disabled
            />
          </label>
        </div>

        <div className="form-group">
          <label htmlFor="totalAmounts.rpt_tot_fee_srvc_amt">
            <span className="field-title">Total Fees for Services</span>
            <input
              id="totalAmounts.rpt_tot_fee_srvc_amt"
              type="text"
              name="totalAmounts.rpt_tot_fee_srvc_amt"
              value={summaryData.totalAmounts.rpt_tot_fee_srvc_amt}
              onChange={handleInputChange}
              maxLength={15}
              disabled
            />
          </label>
        </div>

        <div className="form-group">
          <label htmlFor="totalAmounts.rpt_tot_oth_info_amt">
            <span className="field-title">Total Other Information Amounts</span>
            <input
              id="totalAmounts.rpt_tot_oth_info_amt"
              type="text"
              name="totalAmounts.rpt_tot_oth_info_amt"
              value={summaryData.totalAmounts.rpt_tot_oth_info_amt}
              onChange={handleInputChange}
              maxLength={15}
              disabled
            />
          </label>
        </div>
      </div>

      <p className="error-message">{errorMessage}</p>
      <button type="button" onClick={handleSubmit}>
        Generate XML
      </button>
    </div>
  );
}

export default T4ASummary;
