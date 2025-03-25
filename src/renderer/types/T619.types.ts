export class TransmitterName {
  l1_nm: string = '';
}

export class Contact {
  cntc_nm: string = '';
  cntc_area_cd: string = '';
  cntc_phn_nbr: string = '';
  cntc_extn_nbr: string = '';
  cntc_email_area: string = '';
  sec_cntc_email_area: string = '';
}

export default class T619Data {
  accountType: 'bn9' | 'bn15' | 'trust' | 'nr4' | 'repid' = 'bn9';
  bn9: string = '';
  bn15: string = '';
  trust: string = '';
  nr4: string = '';
  RepID: string = '';
  sbmt_ref_id: string = '';
  summ_cnt: string = '1';
  lang_cd: 'E' | 'F' = 'E';
  transmitterName: TransmitterName = new TransmitterName();
  TransmitterCountryCode: string = 'CAN';
  contact: Contact = new Contact();
}
