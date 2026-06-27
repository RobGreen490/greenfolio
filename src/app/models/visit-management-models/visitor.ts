export interface Visitor{
  dlNumber: string; //DAQ
  dlExpiration: string;
  firstName: string; //DAC
  lastName: string; //DCS
  fullName: string;
  dob: string;//DBB
  address: string;//DAG
  city: string; //DAI
  state: string;//DAJ
  zip: string; //DAK
}

export function createEmptyVisitor(): Visitor {
  return {
    dlNumber: '',
    dlExpiration: '',
    firstName: '',
    lastName: '',
    fullName: '',
    dob: '',
    address: '',
    city: '',
    state: '',
    zip: ''
  };
}
