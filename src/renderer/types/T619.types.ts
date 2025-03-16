export interface TransmitterName {
  l1_nm: string;
}

export interface Contact {
  cntc_nm: string;
  cntc_area_cd: string;
  cntc_phn_nbr: string;
  cntc_extn_nbr: string;
  cntc_email_area: string;
  sec_cntc_email_area: string;
}

export default interface T619FormData {
  accountType: 'bn9' | 'bn15' | 'trust' | 'nr4' | 'repid';
  bn9: string;
  bn15: string;
  trust: string;
  nr4: string;
  RepID: string;
  sbmt_ref_id: string;
  summ_cnt: string;
  lang_cd: 'E' | 'F';
  transmitterName: TransmitterName;
  TransmitterCountryCode: string;
  contact: Contact;
}
