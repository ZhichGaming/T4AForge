export class RecipientName {
  snm: string = '';
  gvn_nm: string = '';
  init: string = '';
}

export class RecipientCorpName {
  l1_nm: string = '';
  l2_nm: string = '';
}

export class Address {
  addr_l1_txt: string = '';
  addr_l2_txt: string = '';
  cty_nm: string = '';
  prov_cd: string = '';
  cntry_cd: string = '';
  pstl_cd: string = '';
}

export class T4AAmounts {
  pens_spran_amt: string = '';
  lsp_amt: string = '';
  self_empl_cmsn_amt: string = '';
  itx_ddct_amt: string = '';
  annty_amt: string = '';
  fee_or_oth_srvc_amt: string = '';
}

export class OtherInfo {
  elg_rtir_amt: string = '';
  nelg_rtir_amt: string = '';
  oth_incamt: string = '';
  ptrng_aloc_amt: string = '';
  rpp_past_srvc_amt: string = '';
  padj_amt: string = '';
  alda_amt: string = '';
  resp_aip_amt: string = '';
  resp_educt_ast_amt: string = '';
  chrty_dons_amt: string = '';
  nr_lsp_trnsf_amt: string = '';
  rsch_grnt_amt: string = '';
  brsy_amt: string = '';
  dth_ben_amt: string = '';
  wag_ls_incamt: string = '';
  lsp_rpp_nelg_amt: string = '';
  nrgst_ppln_amt: string = '';
  pr_71_acr_lsp_amt: string = '';
  inc_avg_annty_amt: string = '';
  dpsp_ins_pay_amt: string = '';
  med_trvl_amt: string = '';
  loan_ben_amt: string = '';
  med_prem_ben_amt: string = '';
  grp_trm_life_amt: string = '';
  resp_aip_oth_amt: string = '';
  ins_rvk_dpsp_amt: string = '';
  brd_wrk_site_amt: string = '';
  dsblt_ben_amt: string = '';
  cntrbr_prr_pspp_cnamt: string = '';
  vtrn_ben_amt: string = '';
  vtrn_ben_pens_splt_elg_amt: string = '';
  tx_dfr_ptrng_dvamt: string = '';
  atp_inctv_grnt_amt: string = '';
  rdsp_amt: string = '';
  wag_ptct_pgm_amt: string = '';
  var_pens_ben_amt: string = '';
  tfsa_tax_amt: string = '';
  rcpnt_pay_prem_phsp_amt: string = '';
  pmmc_isg_amt: string = '';
  indn_oth_incamt: string = '';
  indn_xmpt_pens_amt: string = '';
  indn_xmpt_lsp_amt: string = '';
  lbr_adj_ben_aprpt_act_amt: string = '';
  subp_qlf_amt: string = '';
  csh_awrd_pze_payr_amt: string = '';
  bkcy_sttl_amt: string = '';
  lsp_nelg_trnsf_amt: string = '';
  ncntrbr_prr_pspp_cnamt: string = '';
  lsp_dpsp_nelg_amt: string = '';
  lsp_nrgst_pens_amt: string = '';
  prpp_tx_inc_pamt: string = '';
  prpp_txmpt_inc_pamt: string = '';
  abe_tuit_ast_amt: string = '';
  prov_trty_emrg_ben_amt: string = '';
  repmt_covid_fncl_asstnc: string = '';
  oas_lump_sum_pamt: string = '';
  pst_dctrl_fshp_amt: string = '';
}

export class AddInfo {
  spp_sps_cntrb_ind: string = '';
  spp_sps_cntrbr_sin: string = '';
}

export class PayerName {
  l1_nm: string = '';
  l2_nm: string = '';
  l3_nm: string = '';
}

export class Contact {
  cntc_nm: string = '';
  cntc_area_cd: string = '';
  cntc_phn_nbr: string = '';
  cntc_extn_nbr: string = '';
}

export class RppNumber {
  rpp_rgst_1_nbr: string = '';
  rpp_rgst_2_nbr: string = '';
  rpp_rgst_3_nbr: string = '';
}

export class ProprietorSin {
  pprtr_1_sin: string = '';
  pprtr_2_sin: string = '';
}

export class T4ATotalAmounts {
  tot_pens_spran_amt: string = '';
  tot_lsp_amt: string = '';
  tot_self_cmsn_amt: string = '';
  tot_ptrng_aloc_amt: string = '';
  tot_past_srvc_amt: string = '';
  tot_annty_incamt: string = '';
  totr_incamt: string = '';
  tot_itx_dedn_amt: string = '';
  tot_padj_amt: string = '';
  tot_resp_aip_amt: string = '';
  tot_resp_amt: string = '';
  rpt_tot_fee_srvc_amt: string = '';
  rpt_tot_oth_info_amt: string = '';
}

export class T4ASlipData {
  recipientType: 'individual' | 'corporation' = 'individual';
  recipientName: RecipientName = new RecipientName();
  recipientCorpName: RecipientCorpName = new RecipientCorpName();
  sin: string = '000000000';
  rcpnt_bn: string = '000000000RT0000';
  recipientAddress: Address = new Address();
  rcpnt_nbr: string = '';
  bn: string = '';
  payr_dntl_ben_rpt_cd: string = '';
  ppln_dpsp_rgst_nbr: string = '';
  rpt_tcd: 'O' | 'A' | 'C' = 'O';
  amounts: T4AAmounts = new T4AAmounts();
  otherInfo: OtherInfo = new OtherInfo();
  addInfo: AddInfo = new AddInfo();
}

export class T4ASummaryData {
  bn: string = '';
  payerName: PayerName = new PayerName();
  payerAddress: Address = new Address();
  contact: Contact = new Contact();
  tx_yr: string = '';
  slp_cnt: string = '';
  rppNumber: RppNumber = new RppNumber();
  proprietorSin: ProprietorSin = new ProprietorSin();
  rpt_tcd: 'O' | 'A' | 'C' = 'O';
  fileramendmentnote: string = '';
  totalAmounts: T4ATotalAmounts = new T4ATotalAmounts();

  constructor(year: string = "") {
    this.tx_yr = year;
  }
}

export interface T4ASlipKeys {
  recipientType: string;
  recipientName: {
    snm: string;
    gvn_nm: string;
    init: string;
  };
  recipientCorpName: {
    l1_nm: string;
    l2_nm: string;
  };
  sin: string;
  rcpnt_bn: string;
  recipientAddress: {
    addr_l1_txt: string;
    addr_l2_txt: string;
    cty_nm: string;
    prov_cd: string;
    cntry_cd: string;
    pstl_cd: string;
  };
  rcpnt_nbr: string;
  // bn: string;
  payr_dntl_ben_rpt_cd: string;
  ppln_dpsp_rgst_nbr: string;
  rpt_tcd: string;
  amounts: {
    pens_spran_amt: string;
    lsp_amt: string;
    self_empl_cmsn_amt: string;
    itx_ddct_amt: string;
    annty_amt: string;
    fee_or_oth_srvc_amt: string;
  };
  otherInfo: {
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
  };
  // addInfo: {
  //   spp_sps_cntrb_ind: string;
  //   spp_sps_cntrbr_sin: string;
  // };
}

export interface T4ASlipDynamicKeys {
  recipientName: string;
  recipientCorpName: string;
  recipientAddress: string;
}
