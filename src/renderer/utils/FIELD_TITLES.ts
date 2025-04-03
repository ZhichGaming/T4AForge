import { T4ASlipDynamicKeys, T4ASlipKeys } from '../types/T4A.types';

export const FIELD_TITLES: T4ASlipKeys = {
  recipientType: 'Recipient Type',
  recipientName: {
    snm: 'Surname',
    gvn_nm: 'Given Name',
    init: 'Middle Name Initial',
  },
  sin: 'SIN',
  recipientCorpName: {
    l1_nm: 'Corporation Name Line 1',
    l2_nm: 'Corporation Name Line 2',
  },
  rcpnt_bn: 'Recipient Business Number',
  recipientAddress: {
    addr_l1_txt: 'Address Line 1',
    addr_l2_txt: 'Address Line 2',
    cty_nm: 'City',
    prov_cd: 'Province/Territory Code',
    cntry_cd: 'Country Code',
    pstl_cd: 'Postal Code',
  },
  rcpnt_nbr: 'Recipient Number',
  payr_dntl_ben_rpt_cd: 'Payer Dental Benefits Report Code',
  ppln_dpsp_rgst_nbr: 'Plan or DPSP Registration Number',
  rpt_tcd: 'Report Type Code',
  amounts: {
    pens_spran_amt: 'Pension or Superannuation',
    lsp_amt: 'Lump-sum Payments',
    self_empl_cmsn_amt: 'Self-employed Commissions',
    itx_ddct_amt: 'Income Tax Deducted',
    annty_amt: 'Annuities',
    fee_or_oth_srvc_amt: 'Fees for Services',
  },
  otherInfo: {
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
  },
};

export const DYNAMIC_FIELD_TITLES: T4ASlipDynamicKeys = {
  recipientName: 'Recipient Name',
  recipientCorpName: 'Recipient Corporation Name',
  recipientAddress: 'Recipient Address',
}
