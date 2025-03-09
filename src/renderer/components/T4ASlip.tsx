import React, { useState } from 'react';
import { T4ASlipData, OtherInfo } from '../types/T4A.types';
import './Form.scss';

const otherFieldsTitles = {
  elg_rtir_amt: 'Eligible Retiring Allowances (Code 026)',
  nelg_rtir_amt: 'Non-eligible Retiring Allowances (Code 027)',
  oth_incamt: 'Other Income (Code 028)',
  ptrng_aloc_amt: 'Patronage Allocations (Code 030)',
  rpp_past_srvc_amt:
    'Registered Pension Plan Contributions - Past Service (Code 032)',
  padj_amt: 'Pension Adjustment (Code 034)',
  alda_amt: 'Advanced Life Deferred Annuity Purchase (Code 037)',
  resp_aip_amt: 'RESP Accumulated Income Payments (Code 040)',
  resp_educt_ast_amt: 'RESP Educational Assistance Payments (Code 042)',
  chrty_dons_amt: 'Charitable Donations (Code 046)',
  nr_lsp_trnsf_amt:
    'Lump-sum Payments - Non-resident Services Transfer (Code 102)',
  rsch_grnt_amt: 'Research Grants (Code 104)',
  brsy_amt: 'Scholarships, Fellowships, or Bursaries (Code 105)',
  dth_ben_amt: 'Death Benefits (Code 106)',
  wag_ls_incamt: 'Wage Loss Replacement Plan Income (Code 107)',
  lsp_rpp_nelg_amt:
    'RPP Lump-sum Payments - Not Eligible for Transfer (Code 108)',
  nrgst_ppln_amt: 'Unregistered Pension Plan (Code 109)',
  pr_71_acr_lsp_amt:
    'Lump-sum Payments Accrued to December 31, 1971 (Code 110)',
  inc_avg_annty_amt: 'IAAC Annuities (Code 111)',
  dpsp_ins_pay_amt: 'DPSP Installment or Annuity Payments (Code 115)',
  med_trvl_amt: 'Medical Travel (Code 116)',
  loan_ben_amt: 'Loan Benefit under Subsection 80.4(2) (Code 117)',
  med_prem_ben_amt: 'Medical Premium Benefit (Code 118)',
  grp_trm_life_amt: 'Group Term Life Insurance Benefit (Code 119)',
  resp_aip_oth_amt: 'RESP Accumulated Income Payments to Other (Code 122)',
  ins_rvk_dpsp_amt: 'Revoked DPSP Installment or Annuity Payments (Code 123)',
  brd_wrk_site_amt: 'Board and Lodging at Special Work Sites (Code 124)',
  dsblt_ben_amt: 'Disability Benefits (Code 125)',
  cntrbr_prr_pspp_cnamt:
    'Contributor RPP Past Service Pre-1990 Contributions (Code 126)',
  vtrn_ben_amt: "Veteran's Benefit (Code 127)",
  vtrn_ben_pens_splt_elg_amt:
    "Veterans' Benefits Eligible for Pension Splitting (Code 128)",
  tx_dfr_ptrng_dvamt: 'Tax Deferred Patronage Dividends (Code 129)',
  atp_inctv_grnt_amt: 'Apprenticeship Incentive/Completion Grant (Code 130)',
  rdsp_amt: 'Registered Disability Savings Plan (Code 131)',
  wag_ptct_pgm_amt: 'Wage Earner Protection Program (Code 132)',
  var_pens_ben_amt: 'Variable Pension Benefits (Code 133)',
  tfsa_tax_amt: 'TFSA/FHSA Taxable Amount (Code 134)',
  rcpnt_pay_prem_phsp_amt:
    'Recipient-paid Private Health Services Plan Premiums (Code 135)',
  pmmc_isg_amt: 'Parents of Murdered/Missing Children Benefits (Code 136)',
  indn_oth_incamt: 'Indian Act - Exempt Other Income (Code 144)',
  indn_xmpt_pens_amt: 'Indian Act - Exempt Pension/Superannuation (Code 146)',
  indn_xmpt_lsp_amt: 'Indian Act - Exempt Lump-sum Payments (Code 148)',
  lbr_adj_ben_aprpt_act_amt: 'Labour Adjustment Benefits (Code 150)',
  subp_qlf_amt: 'SUBP Qualified Under Income Tax Act (Code 152)',
  csh_awrd_pze_payr_amt: 'Cash Award or Prize from Payer (Code 154)',
  bkcy_sttl_amt: 'Bankruptcy Settlement (Code 156)',
  lsp_nelg_trnsf_amt:
    'Lump-sum Payments - Not Eligible for Transfer (Code 158)',
  ncntrbr_prr_pspp_cnamt:
    'Non-Contributor RPP Past Service Pre-1990 (Code 162)',
  lsp_dpsp_nelg_amt:
    'DPSP Lump-sum Payments - Not Eligible for Transfer (Code 180)',
  lsp_nrgst_pens_amt: 'Unregistered Pension Benefits Lump-sum (Code 190)',
  prpp_tx_inc_pamt: 'PRPP Payments (Code 194)',
  prpp_txmpt_inc_pamt: 'Indian Act - Exempt PRPP Payments (Code 195)',
  abe_tuit_ast_amt: 'Adult Basic Education Tuition Assistance (Code 196)',
  prov_trty_emrg_ben_amt:
    'Provincial/Territorial COVID-19 Assistance (Code 200)',
  repmt_covid_fncl_asstnc:
    'Repayment of COVID-19 Financial Assistance (Code 201)',
  oas_lump_sum_pamt: 'One-time Payment for Older Seniors (Code 205)',
  pst_dctrl_fshp_amt: 'Postdoctoral Fellowship Income (Code 210)',
};

interface T4ASlipProps {
  onSlipComplete: (slipData: T4ASlipData) => void;
  editingSlip: T4ASlipData | null;
}

function T4ASlip({ onSlipComplete, editingSlip }: T4ASlipProps) {
  const [formData, setFormData] = useState<T4ASlipData>(
    editingSlip || {
      recipientType: 'individual',
      recipientName: {
        snm: '',
        gvn_nm: '',
        init: '',
      },
      recipientCorpName: {
        l1_nm: '',
        l2_nm: '',
      },
      sin: '',
      rcpnt_bn: '',
      recipientAddress: {
        addr_l1_txt: '',
        addr_l2_txt: '',
        cty_nm: '',
        prov_cd: '',
        cntry_cd: '',
        pstl_cd: '',
      },
      rcpnt_nbr: '',
      bn: '',
      payr_dntl_ben_rpt_cd: '',
      ppln_dpsp_rgst_nbr: '',
      rpt_tcd: 'O',
      amounts: {
        pens_spran_amt: '',
        lsp_amt: '',
        self_empl_cmsn_amt: '',
        itx_ddct_amt: '',
        annty_amt: '',
        fee_or_oth_srvc_amt: '',
      },
      otherInfo: {
        elg_rtir_amt: '',
        nelg_rtir_amt: '',
        oth_incamt: '',
        ptrng_aloc_amt: '',
        rpp_past_srvc_amt: '',
        padj_amt: '',
        alda_amt: '',
        resp_aip_amt: '',
        resp_educt_ast_amt: '',
        chrty_dons_amt: '',
        nr_lsp_trnsf_amt: '',
        rsch_grnt_amt: '',
        brsy_amt: '',
        dth_ben_amt: '',
        wag_ls_incamt: '',
        lsp_rpp_nelg_amt: '',
        nrgst_ppln_amt: '',
        pr_71_acr_lsp_amt: '',
        inc_avg_annty_amt: '',
        dpsp_ins_pay_amt: '',
        med_trvl_amt: '',
        loan_ben_amt: '',
        med_prem_ben_amt: '',
        grp_trm_life_amt: '',
        resp_aip_oth_amt: '',
        ins_rvk_dpsp_amt: '',
        brd_wrk_site_amt: '',
        dsblt_ben_amt: '',
        cntrbr_prr_pspp_cnamt: '',
        vtrn_ben_amt: '',
        vtrn_ben_pens_splt_elg_amt: '',
        tx_dfr_ptrng_dvamt: '',
        atp_inctv_grnt_amt: '',
        rdsp_amt: '',
        wag_ptct_pgm_amt: '',
        var_pens_ben_amt: '',
        tfsa_tax_amt: '',
        rcpnt_pay_prem_phsp_amt: '',
        pmmc_isg_amt: '',
        indn_oth_incamt: '',
        indn_xmpt_pens_amt: '',
        indn_xmpt_lsp_amt: '',
        lbr_adj_ben_aprpt_act_amt: '',
        subp_qlf_amt: '',
        csh_awrd_pze_payr_amt: '',
        bkcy_sttl_amt: '',
        lsp_nelg_trnsf_amt: '',
        ncntrbr_prr_pspp_cnamt: '',
        lsp_dpsp_nelg_amt: '',
        lsp_nrgst_pens_amt: '',
        prpp_tx_inc_pamt: '',
        prpp_txmpt_inc_pamt: '',
        abe_tuit_ast_amt: '',
        prov_trty_emrg_ben_amt: '',
        repmt_covid_fncl_asstnc: '',
        oas_lump_sum_pamt: '',
        pst_dctrl_fshp_amt: '',
      },
      addInfo: {
        spp_sps_cntrb_ind: '',
        spp_sps_cntrbr_sin: '',
      },
    },
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

  const validateForm = (): {
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

    return { requiredErrors, patternErrors };
  };

  const getFieldTitle = (field: string) => {
    const input = document.getElementById(field) as HTMLInputElement;
    return (
      input?.parentElement?.querySelector('.field-title')?.textContent ?? field
    );
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
              onChange={handleInputChange}
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
          </>
        )}

        <div className="form-group">
          <label htmlFor="sin">
            <span className="tooltip">
              <span className="field-title">SIN</span>
              <span className="tooltiptext">
                Required, 9 numeric characters. <br />
                Where the recipient has failed to provide a SIN, or is filing
                for a corporation enter zeroes in the field. <br />
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

        <div className="form-group">
          <label htmlFor="rcpnt_bn">
            <span className="tooltip">
              <span className="field-title">Recipient Business Number</span>
              <span className="tooltiptext">
                Required, 9 numeric characters, RT, RZ, RP or RC followed by 4
                numeric characters. <br />
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
              value={formData.bn}
              onChange={handleInputChange}
              maxLength={15}
              pattern="^[0-9]{9}(RT|RZ|RP|RC)[0-9]{4}$"
              required
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
          <div className="form-group">
            <label htmlFor={`otherInfo.${field}`}>
              <span className="tooltip">
                <span className="field-title">
                  {otherFieldsTitles[field as keyof typeof otherFieldsTitles]}
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
                    // TODO: test this
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
            {Object.entries(otherFieldsTitles)
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
