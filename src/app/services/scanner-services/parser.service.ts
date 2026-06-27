import { Injectable } from '@angular/core';
import { Visitor, createEmptyVisitor } from '../../models/visit-management-models/visitor';

@Injectable({
  providedIn: 'root'
})
export class ParserService {

  constructor() {}



  parseAAMVA(data: string): any {
    const visitor: Visitor = createEmptyVisitor();
    const lines = data.split('\n');

    for (const line of lines) {
      const key = line.substring(0, 3);
      const value = line.substring(3).trim();

      switch (key) {
        case 'DAQ': visitor.dlNumber = value; break;
        case 'DBA': visitor.dlExpiration = value; break;
        case 'DAC': visitor.firstName = value; break;
        case 'DCS': visitor.lastName = value; break;
        case 'DBB': visitor.dob = value; break;
        case 'DAG': visitor.address = value; break;
        case 'DAI': visitor.city = value; break;
        case 'DAJ': visitor.state = value; break;
        case 'DAK': visitor.zip = value; break;
      }
    }
    // grab full name
    visitor.fullName = `${visitor.firstName} ${visitor.lastName}`;
    return visitor;
  }
}
