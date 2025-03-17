/* eslint-disable max-classes-per-file */
import { Contact, TransmitterName } from './T619.types';
import { PayerName, Address, ProprietorSin } from './T4A.types';

export class TransmitterPreset {
  accountType: 'bn9' | 'bn15' | 'trust' | 'nr4' | 'repid' = 'bn9';

  bn9: string = '';

  bn15: string = '';

  trust: string = '';

  nr4: string = '';

  RepID: string = '';

  lang_cd: 'E' | 'F' = 'E';

  transmitterName: TransmitterName = {
    l1_nm: '',
  };

  TransmitterCountryCode: string = '';

  contact: Contact = {
    cntc_nm: '',
    cntc_area_cd: '',
    cntc_phn_nbr: '',
    cntc_extn_nbr: '',
    cntc_email_area: '',
    sec_cntc_email_area: '',
  };
}

export class PayerPreset {
  bn: string = '';

  payerName: PayerName = {
    l1_nm: '',
    l2_nm: '',
    l3_nm: '',
  };

  payerAddress: Address = {
    addr_l1_txt: '',
    addr_l2_txt: '',
    cty_nm: '',
    prov_cd: '',
    cntry_cd: '',
    pstl_cd: '',
  };

  proprietorSin: ProprietorSin = {
    pprtr_1_sin: '',
    pprtr_2_sin: '',
  };
}

export default interface Preset {
  id: string;
  name: string;
  data: TransmitterPreset | PayerPreset;
}
