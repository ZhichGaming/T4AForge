import { useEffect, useState } from 'react';
import './App.scss';
import T619Data from './types/T619.types';
import { T4ASlipData, T4ASummaryData } from './types/T4A.types';
import { Sidebar, Menu, SubMenu, MenuItem } from 'react-pro-sidebar';
import Icon from './components/Icon';
import { SubmissionRecord, SubmissionYearRecord } from './types/SubmissionStorage.types';
import FormPage from './FormPage';
import Popup from 'reactjs-popup';

/**
 * Formats a numeric string as a currency value by ensuring it has exactly two decimal places.
 *
 * - If the input string contains a decimal point, the decimal part is padded or truncated to two digits.
 * - If the input string is empty, it returns an empty string.
 * - If the input string does not contain a decimal point, `.00` is appended to it.
 *
 * @param value - The numeric string to format as currency.
 * @returns The formatted currency string with two decimal places.
 */
function formatCurrency(value: string) {
  let result = value;
  const split = value.split('.');

  if (split.length > 1) {
    const [integer, decimal] = split;
    result = `${integer}.${decimal.padEnd(2, '0').slice(0, 2)}`;
  } else if (value === '') {
    result = '';
  } else {
    result = `${value}.00`;
  }

  return result;
}

/**
 * Creates a new submission record for the specified year.
 *
 * This function generates a new submission ID using the `getNextSubmissionId` method
 * from the `window.manageSubmissions` API. It then initializes a `SubmissionRecord`
 * object with default values and associates it with the generated ID and the provided year.
 * The submission is stored using the `setSubmission` method and returned.
 *
 * @param {number} year - The tax year for which the submission is being created.
 * @returns {Promise<SubmissionRecord>} A promise that resolves to the newly created submission record.
 */
async function createNewSubmission(year: number): Promise<SubmissionRecord> {
  const id = await window.manageSubmissions.getNextSubmissionId(year);

  const submission: SubmissionRecord = {
    id: id,
    t619: new T619Data(),
    t4a: [],
    t4aSummary: new T4ASummaryData(year.toString()),
  }

  await window.manageSubmissions.setSubmission(year, submission);
  return submission;
}

/**
 * Escapes special characters in a string to their corresponding XML entities.
 *
 * This function replaces the following characters:
 * - `&` with `&amp;`
 * - `<` with `&lt;`
 * - `>` with `&gt;`
 * - `"` with `&quot;`
 * - `'` with `&apos;`
 *
 * @param str - The input string to escape.
 * @returns The escaped string with XML special characters replaced by their entities.
 */
function escapeXmlSpecialChars(str: string) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
};

/**
 * Generates an XML string representation of T4A slips and summary data for submission.
 *
 * @param t619FormData - The T619 form data containing transmitter account and contact information.
 * @param t4aSlips - An array of T4A slip data objects, each representing individual or corporate recipient details.
 * @param t4aSummary - The T4A summary data containing payer information, contact details, and total amounts.
 * @returns A formatted XML string representing the T4A slips and summary data.
 *
 * @remarks
 * - It constructs XML strings for T4A slips and the T4A summary using the provided data.
 * - The XML is formatted and cleaned to remove empty tags and unnecessary whitespace.
 *
 * @example
 * ```typescript
 * getXML(t619FormData, t4aSlips, t4aSummary);
 * ```
 */
function getXML(t619FormData: T619Data, t4aSlips: T4ASlipData[], t4aSummary: T4ASummaryData) {
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
          .filter(([, value]) => value !== '')
          .map(
            ([key, value]) =>
              `<${key}>${escapeXmlSpecialChars(formatCurrency(value))}</${key}>`,
          )
          .join('\n          ')}
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
    .replace(/^\s*\n/gm, '')
    .replace(/<(\w+)>\s*<\/\1>/g, '<$1></$1>')
    .replace(/<[^>]*><\/[^>]*>/g, '')
    .replace(/^\s*\n/gm, '');

  return xml;
};

/**
 * Downloads an XML string as a file with the specified filename.
 *
 * @param xml - The XML content to be downloaded as a string.
 * @param filename - The name of the file (without extension) to save the XML content as.
 *
 * This function creates a Blob from the provided XML string, generates a temporary
 * object URL for the Blob, and triggers a download of the file. After the download
 * is initiated, the temporary object URL is revoked to free up resources.
 */
function downloadXML(xml: string, filename: string) {
  const blob = new Blob([xml], { type: 'application/xml' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${filename}.xml`;
  a.click();
  window.URL.revokeObjectURL(url);
}

function App() {
  const [version, setVersion] = useState<string>('');

  const [submissionsList, setSubmissionsList] = useState<SubmissionYearRecord[]>([]);
  const [selectedSubmissionId, setSelectedSubmissionId] = useState<[number, string] | null>(null);

  const [activeFormIdentifier, setActiveFormIdentifier] = useState<string>('T619');

  const [t619FormData, setT619FormData] = useState<T619Data | null>(null);
  const [t4aSlips, setT4aSlips] = useState<T4ASlipData[] | null>(null);
  const [t4aSummary, setT4aSummary] = useState<T4ASummaryData | null>(null);

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [newYearShown, setNewYearShown] = useState(false)
  const [newYear, setNewYear] = useState("")

  const getSubmissions = async () => {
    const submissions: SubmissionYearRecord[] = await window.manageSubmissions.getSubmissions();
    setSubmissionsList(submissions);
  }

  const generateXML = () => {
    if (t619FormData === null || t4aSlips === null || t4aSummary === null) return

    const xml = getXML(t619FormData, t4aSlips, t4aSummary);

    downloadXML(xml, `T4A-${t4aSummary.tx_yr}-${t4aSummary
      .payerName.l1_nm.replace(/\s+/g, '_')
      .replace(/[^a-zA-Z0-9_]/g, '')}`);
  };

  const addNewYear = async () => {
    const year = parseInt(newYear)

    if (newYear === "" || isNaN(year)) return

    await window.manageSubmissions.createSubmissionDirectories(year)
    await getSubmissions()
  }

  useEffect(() => {
    if (t619FormData === null) return;

    setT4aSummary((prev) => {
      if (prev === null) return null;

      return {
        ...prev,
        contact: {
          cntc_nm: t619FormData.contact.cntc_nm,
          cntc_area_cd: t619FormData.contact.cntc_area_cd,
          cntc_phn_nbr: t619FormData.contact.cntc_phn_nbr,
          cntc_extn_nbr: t619FormData.contact.cntc_extn_nbr,
        },
      };
    });
  }, [t619FormData?.contact]);

  useEffect(() => {
    if (t4aSummary === null) return;

    setT4aSlips((prev) => {
      if (prev === null) return null;

      return prev.map((slip) => ({
        ...slip,
        bn: t4aSummary.bn,
      }))
    });
  }, [t4aSummary?.bn, t4aSlips?.length]);

  useEffect(() => {
    getSubmissions();

    window.getVersion().then(res => setVersion(res));
  }, []);

  useEffect(() => {
    if (selectedSubmissionId === null) return;

    const [year, id] = selectedSubmissionId;
    const submission = submissionsList.find((submission) => submission.year === year)?.submissions.find((sub) => sub.id === id);

    if (submission === undefined) return;

    setT619FormData(submission.t619);
    setT4aSlips(submission.t4a);
    setT4aSummary(submission.t4aSummary);
  }, [selectedSubmissionId]);

  useEffect(() => {
    if (t619FormData === null || t4aSlips === null || t4aSummary === null) return;

    const [year, id] = selectedSubmissionId as [number, string];
    const submission: SubmissionRecord = {
      id: id,
      t619: t619FormData,
      t4a: t4aSlips,
      t4aSummary: t4aSummary,
    };

    window.manageSubmissions.setSubmission(year, submission);
    getSubmissions();
  }, [t619FormData, t4aSlips, t4aSummary]);

  return (
    <div className="app">
      <Sidebar className="sidebar" collapsed={sidebarCollapsed}>
        <h1 className='sidebar-title'>T4A Forge</h1>
        <hr />

        <Menu>
          {submissionsList.map((submission) => (
            <SubMenu label={submission.year.toString()} key={submission.year.toString()}>
              {submission.submissions.map((sub) => (
                <MenuItem key={sub.id} onClick={() => setSelectedSubmissionId([submission.year, sub.id])}>
                  {sub.id} <span className='sidebar-submission-label'>{sub.t4aSummary?.payerName.l1_nm}</span>
                </MenuItem>
              ))}
              <MenuItem
                icon={<Icon name="plus"/>}
                onClick={() => {
                  createNewSubmission(submission.year).then((newSubmission) => {
                    getSubmissions();
                    setSelectedSubmissionId([submission.year, newSubmission.id]);
                  });
                }
              }>
                New Submission
              </MenuItem>
            </SubMenu>
          ))}
        </Menu>

        <hr />
        <Menu>
          <Popup
            open={newYearShown}
            trigger={
            <MenuItem
              icon={<Icon name="plus"/>}
              onClick={() => setNewYearShown(true)}>
                Add New Year
            </MenuItem>
          }>
            <div className="popup-content">
              <input type="text" value={newYear} onChange={(e) => setNewYear(e.target.value)} />
              <button onClick={() => {
                addNewYear();
                setNewYearShown(false);
              }}>Add</button>
            </div>
          </Popup>
          <MenuItem
            icon={<Icon name="arrow-left" style={{ transform: sidebarCollapsed ? "rotateZ(180deg)" : "rotateZ(0deg)" }} />}
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className='collapse-sidebar-button'>
              Collapse Sidebar
          </MenuItem>
          <p className='footer-text'>Version {version} - Apr 2025<br /><br />© 2025 ZhichGaming</p>
        </Menu>
      </Sidebar>
      <div className="content">
        {t619FormData != null && t4aSlips != null && t4aSummary != null ?
          <FormPage activeFormIdentifier={activeFormIdentifier}
            setActiveFormIdentifier={setActiveFormIdentifier}
            t619FormData={t619FormData}
            setT619FormData={setT619FormData}
            t4aSlips={t4aSlips}
            setT4aSlips={setT4aSlips}
            t4aSummary={t4aSummary}
            setT4aSummary={setT4aSummary}
            generateXML={generateXML} />
            :
            <div className="start-content">
              <p>Select or create new submission</p>
            </div>
        }
      </div>
    </div>
  );
}

export default App;
