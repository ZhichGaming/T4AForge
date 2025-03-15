import React, { useState } from 'react';
import T4AForm from './components/T4AForm';
import T619Form from './components/T619Form';
import './App.scss';
import T4ASummary from './components/T4ASummary';
import T619FormData from './types/T619.types';
import { T4ASlipData, T4ASummaryData } from './types/T4A.types';

function formatCurrency(value: string) {
  let result = value;
  const split = value.split('.');

  if (split.length > 1) {
    const [integer, decimal] = split;
    result = `${integer}.${decimal.padEnd(2, '0').slice(0, 2)}`;
  } else if (split.length === 1) {
    result = `${value}.00`;
  } else {
    result = '';
  }

  return result;
}

function App() {
  const [selectedForm, setSelectedForm] = useState<string>('T619');

  const [t619FormData, setT619FormData] = useState<T619FormData>({
    accountType: 'bn9',
    bn9: '',
    bn15: '',
    trust: '',
    nr4: '',
    RepID: '',
    sbmt_ref_id: '',
    summ_cnt: '',
    lang_cd: 'E',
    transmitterName: {
      l1_nm: '',
    },
    TransmitterCountryCode: 'CAN',
    contact: {
      cntc_nm: '',
      cntc_area_cd: '',
      cntc_phn_nbr: '',
      cntc_extn_nbr: '',
      cntc_email_area: '',
      sec_cntc_email_area: '',
    },
  });
  const [t4aSlips, setT4aSlips] = useState<T4ASlipData[]>([]);
  const [t4aSummary, setT4aSummary] = useState<T4ASummaryData>({
    bn: '',
    payerName: {
      l1_nm: '',
      l2_nm: '',
      l3_nm: '',
    },
    payerAddress: {
      addr_l1_txt: '',
      addr_l2_txt: '',
      cty_nm: '',
      prov_cd: '',
      cntry_cd: '',
      pstl_cd: '',
    },
    contact: {
      cntc_nm: '',
      cntc_area_cd: '',
      cntc_phn_nbr: '',
      cntc_extn_nbr: '',
    },
    tx_yr: '',
    slp_cnt: '',
    rppNumber: {
      rpp_rgst_1_nbr: '',
      rpp_rgst_2_nbr: '',
      rpp_rgst_3_nbr: '',
    },
    proprietorSin: {
      pprtr_1_sin: '',
      pprtr_2_sin: '',
    },
    rpt_tcd: 'O',
    fileramendmentnote: '',
    totalAmounts: {
      tot_pens_spran_amt: '',
      tot_lsp_amt: '',
      tot_self_cmsn_amt: '',
      tot_ptrng_aloc_amt: '',
      tot_past_srvc_amt: '',
      tot_annty_incamt: '',
      totr_incamt: '',
      tot_itx_dedn_amt: '',
      tot_padj_amt: '',
      tot_resp_aip_amt: '',
      tot_resp_amt: '',
      rpt_tot_fee_srvc_amt: '',
      rpt_tot_oth_info_amt: '',
    },
  });

  const [t619Valid, setT619Valid] = useState<boolean>(false);
  const [t4aValid, setT4aValid] = useState<boolean>(false);
  const [t4aSummaryValid, setT4aSummaryValid] = useState<boolean>(false);

  const escapeXmlSpecialChars = (str: string): string => {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  };

  const generateXML = () => {
    const slipsXml = t4aSlips
      .map(
        (slip) => `
      <T4ASlip>
        ${
          slip.recipientType === 'individual'
            ? `
        <RCPNT_NM>
          <snm>${escapeXmlSpecialChars(slip.recipientName.snm)}</snm>
          <gvn_nm>${escapeXmlSpecialChars(slip.recipientName.gvn_nm)}</gvn_nm>
          <init>${escapeXmlSpecialChars(slip.recipientName.init)}</init>
        </RCPNT_NM>`
            : `
        <RCPNT_CORP_NM>
          <l1_nm>${escapeXmlSpecialChars(slip.recipientCorpName.l1_nm)}</l1_nm>
          <l2_nm>${escapeXmlSpecialChars(slip.recipientCorpName.l2_nm)}</l2_nm>
        </RCPNT_CORP_NM>`
        }
        <sin>${escapeXmlSpecialChars(slip.sin)}</sin>
        <rcpnt_bn>${escapeXmlSpecialChars(slip.rcpnt_bn)}</rcpnt_bn>
        <RCPNT_ADDR>
          <addr_l1_txt>${escapeXmlSpecialChars(slip.recipientAddress.addr_l1_txt)}</addr_l1_txt>
          <addr_l2_txt>${escapeXmlSpecialChars(slip.recipientAddress.addr_l2_txt)}</addr_l2_txt>
          <cty_nm>${escapeXmlSpecialChars(slip.recipientAddress.cty_nm)}</cty_nm>
          <prov_cd>${escapeXmlSpecialChars(slip.recipientAddress.prov_cd)}</prov_cd>
          <cntry_cd>${escapeXmlSpecialChars(slip.recipientAddress.cntry_cd)}</cntry_cd>
          <pstl_cd>${escapeXmlSpecialChars(slip.recipientAddress.pstl_cd)}</pstl_cd>
        </RCPNT_ADDR>
        <rcpnt_nbr>${escapeXmlSpecialChars(slip.rcpnt_nbr)}</rcpnt_nbr>
        <bn>${escapeXmlSpecialChars(slip.bn)}</bn>
        <payr_dntl_ben_rpt_cd>${escapeXmlSpecialChars(slip.payr_dntl_ben_rpt_cd)}</payr_dntl_ben_rpt_cd>
        <ppln_dpsp_rgst_nbr>${escapeXmlSpecialChars(slip.ppln_dpsp_rgst_nbr)}</ppln_dpsp_rgst_nbr>
        <rpt_tcd>${escapeXmlSpecialChars(slip.rpt_tcd)}</rpt_tcd>
        <T4A_AMT>
          <pens_spran_amt>${escapeXmlSpecialChars(formatCurrency(slip.amounts.pens_spran_amt))}</pens_spran_amt>
          <lsp_amt>${escapeXmlSpecialChars(formatCurrency(slip.amounts.lsp_amt))}</lsp_amt>
          <self_empl_cmsn_amt>${escapeXmlSpecialChars(formatCurrency(slip.amounts.self_empl_cmsn_amt))}</self_empl_cmsn_amt>
          <itx_ddct_amt>${escapeXmlSpecialChars(formatCurrency(slip.amounts.itx_ddct_amt))}</itx_ddct_amt>
          <annty_amt>${escapeXmlSpecialChars(formatCurrency(slip.amounts.annty_amt))}</annty_amt>
          <fee_or_oth_srvc_amt>${escapeXmlSpecialChars(formatCurrency(slip.amounts.fee_or_oth_srvc_amt))}</fee_or_oth_srvc_amt>
        </T4A_AMT>
        <OTH_INFO>
          ${Object.entries(slip.otherInfo)
            .filter(([_, value]) => value !== '')
            .map(
              ([key, value]) =>
                `<${key}>${escapeXmlSpecialChars(formatCurrency(value))}</${key}>`,
            )
            .join('\n        ')}
        </OTH_INFO>
        <ADD_INFO>
          <spp_sps_cntrb_ind>${escapeXmlSpecialChars(slip.addInfo.spp_sps_cntrb_ind)}</spp_sps_cntrb_ind>
          <spp_sps_cntrbr_sin>${escapeXmlSpecialChars(slip.addInfo.spp_sps_cntrbr_sin)}</spp_sps_cntrbr_sin>
        </ADD_INFO>
      </T4ASlip>`,
      )
      .join('\n');

    const summaryXml = `
    <T4ASummary>
      <bn>${escapeXmlSpecialChars(t4aSummary.bn)}</bn>
      <PAYR_NM>
        <l1_nm>${escapeXmlSpecialChars(t4aSummary.payerName.l1_nm)}</l1_nm>
        <l2_nm>${escapeXmlSpecialChars(t4aSummary.payerName.l2_nm)}</l2_nm>
        <l3_nm>${escapeXmlSpecialChars(t4aSummary.payerName.l3_nm)}</l3_nm>
      </PAYR_NM>
      <PAYR_ADDR>
        <addr_l1_txt>${escapeXmlSpecialChars(t4aSummary.payerAddress.addr_l1_txt)}</addr_l1_txt>
        <addr_l2_txt>${escapeXmlSpecialChars(t4aSummary.payerAddress.addr_l2_txt)}</addr_l2_txt>
        <cty_nm>${escapeXmlSpecialChars(t4aSummary.payerAddress.cty_nm)}</cty_nm>
        <prov_cd>${escapeXmlSpecialChars(t4aSummary.payerAddress.prov_cd)}</prov_cd>
        <cntry_cd>${escapeXmlSpecialChars(t4aSummary.payerAddress.cntry_cd)}</cntry_cd>
        <pstl_cd>${escapeXmlSpecialChars(t4aSummary.payerAddress.pstl_cd)}</pstl_cd>
      </PAYR_ADDR>
      <CNTC>
        <cntc_nm>${escapeXmlSpecialChars(t4aSummary.contact.cntc_nm)}</cntc_nm>
        <cntc_area_cd>${escapeXmlSpecialChars(t4aSummary.contact.cntc_area_cd)}</cntc_area_cd>
        <cntc_phn_nbr>${escapeXmlSpecialChars(t4aSummary.contact.cntc_phn_nbr)}</cntc_phn_nbr>
        <cntc_extn_nbr>${escapeXmlSpecialChars(t4aSummary.contact.cntc_extn_nbr)}</cntc_extn_nbr>
      </CNTC>
      <tx_yr>${escapeXmlSpecialChars(t4aSummary.tx_yr)}</tx_yr>
      <slp_cnt>${escapeXmlSpecialChars(t4aSummary.slp_cnt)}</slp_cnt>
      <RPP_NBR>
        <rpp_rgst_1_nbr>${escapeXmlSpecialChars(t4aSummary.rppNumber.rpp_rgst_1_nbr)}</rpp_rgst_1_nbr>
        <rpp_rgst_2_nbr>${escapeXmlSpecialChars(t4aSummary.rppNumber.rpp_rgst_2_nbr)}</rpp_rgst_2_nbr>
        <rpp_rgst_3_nbr>${escapeXmlSpecialChars(t4aSummary.rppNumber.rpp_rgst_3_nbr)}</rpp_rgst_3_nbr>
      </RPP_NBR>
      <PPRTR_SIN>
        <pprtr_1_sin>${escapeXmlSpecialChars(t4aSummary.proprietorSin.pprtr_1_sin)}</pprtr_1_sin>
        <pprtr_2_sin>${escapeXmlSpecialChars(t4aSummary.proprietorSin.pprtr_2_sin)}</pprtr_2_sin>
      </PPRTR_SIN>
      <rpt_tcd>${escapeXmlSpecialChars(t4aSummary.rpt_tcd)}</rpt_tcd>
      <fileramendmentnote>${escapeXmlSpecialChars(t4aSummary.fileramendmentnote)}</fileramendmentnote>
      <T4A_TAMT>
        <tot_pens_spran_amt>${escapeXmlSpecialChars(t4aSummary.totalAmounts.tot_pens_spran_amt)}</tot_pens_spran_amt>
        <tot_lsp_amt>${escapeXmlSpecialChars(t4aSummary.totalAmounts.tot_lsp_amt)}</tot_lsp_amt>
        <tot_self_cmsn_amt>${escapeXmlSpecialChars(t4aSummary.totalAmounts.tot_self_cmsn_amt)}</tot_self_cmsn_amt>
        <tot_ptrng_aloc_amt>${escapeXmlSpecialChars(t4aSummary.totalAmounts.tot_ptrng_aloc_amt)}</tot_ptrng_aloc_amt>
        <tot_past_srvc_amt>${escapeXmlSpecialChars(t4aSummary.totalAmounts.tot_past_srvc_amt)}</tot_past_srvc_amt>
        <tot_annty_incamt>${escapeXmlSpecialChars(t4aSummary.totalAmounts.tot_annty_incamt)}</tot_annty_incamt>
        <totr_incamt>${escapeXmlSpecialChars(t4aSummary.totalAmounts.totr_incamt)}</totr_incamt>
        <tot_itx_dedn_amt>${escapeXmlSpecialChars(t4aSummary.totalAmounts.tot_itx_dedn_amt)}</tot_itx_dedn_amt>
        <tot_padj_amt>${escapeXmlSpecialChars(t4aSummary.totalAmounts.tot_padj_amt)}</tot_padj_amt>
        <tot_resp_aip_amt>${escapeXmlSpecialChars(t4aSummary.totalAmounts.tot_resp_aip_amt)}</tot_resp_aip_amt>
        <tot_resp_amt>${escapeXmlSpecialChars(t4aSummary.totalAmounts.tot_resp_amt)}</tot_resp_amt>
        <rpt_tot_fee_srvc_amt>${escapeXmlSpecialChars(t4aSummary.totalAmounts.rpt_tot_fee_srvc_amt)}</rpt_tot_fee_srvc_amt>
        <rpt_tot_oth_info_amt>${escapeXmlSpecialChars(t4aSummary.totalAmounts.rpt_tot_oth_info_amt)}</rpt_tot_oth_info_amt>
      </T4A_TAMT>
    </T4ASummary>`;

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<Submission xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  <T619>
    <TransmitterAccountNumber>
      ${t619FormData.accountType === 'bn9' ? `<bn9>${escapeXmlSpecialChars(t619FormData.bn9)}</bn9>` : ''}
      ${t619FormData.accountType === 'bn15' ? `<bn15>${escapeXmlSpecialChars(t619FormData.bn15)}</bn15>` : ''}
      ${t619FormData.accountType === 'trust' ? `<trust>${escapeXmlSpecialChars(t619FormData.trust)}</trust>` : ''}
      ${t619FormData.accountType === 'nr4' ? `<nr4>${escapeXmlSpecialChars(t619FormData.nr4)}</nr4>` : ''}
    </TransmitterAccountNumber>
    <TransmitterRepID>
      <RepID>${escapeXmlSpecialChars(t619FormData.RepID)}</RepID>
    </TransmitterRepID>
    <sbmt_ref_id>${escapeXmlSpecialChars(t619FormData.sbmt_ref_id)}</sbmt_ref_id>
    <summ_cnt>${escapeXmlSpecialChars(t619FormData.summ_cnt)}</summ_cnt>
    <lang_cd>${escapeXmlSpecialChars(t619FormData.lang_cd)}</lang_cd>
    <TransmitterName>
      <l1_nm>${escapeXmlSpecialChars(t619FormData.transmitterName.l1_nm)}</l1_nm>
    </TransmitterName>
    <TransmitterCountryCode>${escapeXmlSpecialChars(t619FormData.TransmitterCountryCode)}</TransmitterCountryCode>
    <CNTC>
      <cntc_nm>${escapeXmlSpecialChars(t619FormData.contact.cntc_nm)}</cntc_nm>
      <cntc_area_cd>${escapeXmlSpecialChars(t619FormData.contact.cntc_area_cd)}</cntc_area_cd>
      <cntc_phn_nbr>${escapeXmlSpecialChars(t619FormData.contact.cntc_phn_nbr)}</cntc_phn_nbr>
      <cntc_extn_nbr>${escapeXmlSpecialChars(t619FormData.contact.cntc_extn_nbr)}</cntc_extn_nbr>
      <cntc_email_area>${escapeXmlSpecialChars(t619FormData.contact.cntc_email_area)}</cntc_email_area>
      <sec_cntc_email_area>${escapeXmlSpecialChars(t619FormData.contact.sec_cntc_email_area)}</sec_cntc_email_area>
    </CNTC>
  </T619>
  <Return>
    <T4A>
      ${slipsXml}
      ${summaryXml}
    </T4A>
  </Return>
</Submission>`
      .replace(/<[^>]*><\/[^>]*>/g, '')
      .replace(/^\s*\n/gm, '');

    const blob = new Blob([xml], { type: 'application/xml' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${t619FormData.sbmt_ref_id}.xml`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="app">
      <div className="header-nav">
        <button
          className={selectedForm === 'T619' ? 'selected' : ''}
          type="button"
          onClick={() => setSelectedForm('T619')}
        >
          T619 transmitter information
        </button>
        <button
          className={selectedForm === 'T4A' ? 'selected' : ''}
          type="button"
          onClick={() => setSelectedForm('T4A')}
        >
          T4A information
        </button>
        <button
          className={selectedForm === 'T4ASummary' ? 'selected' : ''}
          type="button"
          onClick={() => setSelectedForm('T4ASummary')}
        >
          T4A summary
        </button>
      </div>
      {selectedForm === 'T619' && (
        <T619Form
          formData={t619FormData}
          setFormData={setT619FormData}
          nextStep={() => setSelectedForm('T4A')}
        />
      )}
      {selectedForm === 'T4A' && (
        <T4AForm
          slips={t4aSlips}
          setSlips={setT4aSlips}
          nextStep={() => setSelectedForm('T4ASummary')}
        />
      )}
      {selectedForm === 'T4ASummary' && (
        <T4ASummary
          slips={t4aSlips}
          summaryData={t4aSummary}
          setSummaryData={setT4aSummary}
          generateXML={generateXML}
        />
      )}
    </div>
  );
}

export default App;
