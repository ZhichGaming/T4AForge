export interface RecipientName {
  snm: string;
  gvn_nm: string;
  init: string;
}

export interface RecipientCorpName {
  l1_nm: string;
  l2_nm: string;
}

export interface Address {
  addr_l1_txt: string;
  addr_l2_txt: string;
  cty_nm: string;
  prov_cd: string;
  cntry_cd: string;
  pstl_cd: string;
}

export interface T4AAmounts {
  pens_spran_amt: string;
  lsp_amt: string;
  self_empl_cmsn_amt: string;
  itx_ddct_amt: string;
  annty_amt: string;
  fee_or_oth_srvc_amt: string;
}

export interface OtherInfo {
  elg_rtir_amt: string;
  nelg_rtir_amt: string;
  oth_incamt: string;
  ptrng_aloc_amt: string;
  rpp_past_srvc_amt: string;
  padj_amt: string;
  alda_amt: string;
  resp_aip_amt: string;
  resp_educt_ast_amt: string;
  chrty_dons_amt: string;
  nr_lsp_trnsf_amt: string;
  rsch_grnt_amt: string;
  brsy_amt: string;
  dth_ben_amt: string;
  wag_ls_incamt: string;
  lsp_rpp_nelg_amt: string;
  nrgst_ppln_amt: string;
  pr_71_acr_lsp_amt: string;
  inc_avg_annty_amt: string;
  dpsp_ins_pay_amt: string;
  med_trvl_amt: string;
  loan_ben_amt: string;
  med_prem_ben_amt: string;
  grp_trm_life_amt: string;
  resp_aip_oth_amt: string;
  ins_rvk_dpsp_amt: string;
  brd_wrk_site_amt: string;
  dsblt_ben_amt: string;
  cntrbr_prr_pspp_cnamt: string;
  vtrn_ben_amt: string;
  vtrn_ben_pens_splt_elg_amt: string;
  tx_dfr_ptrng_dvamt: string;
  atp_inctv_grnt_amt: string;
  rdsp_amt: string;
  wag_ptct_pgm_amt: string;
  var_pens_ben_amt: string;
  tfsa_tax_amt: string;
  rcpnt_pay_prem_phsp_amt: string;
  pmmc_isg_amt: string;
  indn_oth_incamt: string;
  indn_xmpt_pens_amt: string;
  indn_xmpt_lsp_amt: string;
  lbr_adj_ben_aprpt_act_amt: string;
  subp_qlf_amt: string;
  csh_awrd_pze_payr_amt: string;
  bkcy_sttl_amt: string;
  lsp_nelg_trnsf_amt: string;
  ncntrbr_prr_pspp_cnamt: string;
  lsp_dpsp_nelg_amt: string;
  lsp_nrgst_pens_amt: string;
  prpp_tx_inc_pamt: string;
  prpp_txmpt_inc_pamt: string;
  abe_tuit_ast_amt: string;
  prov_trty_emrg_ben_amt: string;
  repmt_covid_fncl_asstnc: string;
  oas_lump_sum_pamt: string;
  pst_dctrl_fshp_amt: string;
}

export interface AddInfo {
  spp_sps_cntrb_ind: string;
  spp_sps_cntrbr_sin: string;
}

export interface PayerName {
  l1_nm: string;
  l2_nm: string;
  l3_nm: string;
}

export interface Contact {
  cntc_nm: string;
  cntc_area_cd: string;
  cntc_phn_nbr: string;
  cntc_extn_nbr: string;
}

export interface RppNumber {
  rpp_rgst_1_nbr: string;
  rpp_rgst_2_nbr: string;
  rpp_rgst_3_nbr: string;
}

export interface ProprietorSin {
  pprtr_1_sin: string;
  pprtr_2_sin: string;
}

export interface T4ATotalAmounts {
  tot_pens_spran_amt: string;
  tot_lsp_amt: string;
  tot_self_cmsn_amt: string;
  tot_ptrng_aloc_amt: string;
  tot_past_srvc_amt: string;
  tot_annty_incamt: string;
  totr_incamt: string;
  tot_itx_dedn_amt: string;
  tot_padj_amt: string;
  tot_resp_aip_amt: string;
  tot_resp_amt: string;
  rpt_tot_fee_srvc_amt: string;
  rpt_tot_oth_info_amt: string;
}

export interface T4ASlipData {
  recipientType: 'individual' | 'corporation';
  recipientName: RecipientName;
  recipientCorpName: RecipientCorpName;
  sin: string;
  rcpnt_bn: string;
  recipientAddress: Address;
  rcpnt_nbr: string;
  bn: string;
  payr_dntl_ben_rpt_cd: string;
  ppln_dpsp_rgst_nbr: string;
  rpt_tcd: 'O' | 'A' | 'C';
  amounts: T4AAmounts;
  otherInfo: OtherInfo;
  addInfo: AddInfo;
}

export interface T4ASummaryData {
  bn: string;
  payerName: PayerName;
  payerAddress: Address;
  contact: Contact;
  tx_yr: string;
  slp_cnt: string;
  rppNumber: RppNumber;
  proprietorSin: ProprietorSin;
  rpt_tcd: 'O' | 'A' | 'C';
  fileramendmentnote: string;
  totalAmounts: T4ATotalAmounts;
}
