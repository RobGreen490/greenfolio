import { Injectable } from '@angular/core';
import { Visitor } from '@models';

@Injectable({
  providedIn: 'root'
})
export class ScanRulesService {

  // will return true if visitor contains a value within each variables(key)
  isValidVisitor(visitor: Visitor): boolean{
    return Object.values(visitor).every(v => v !== '');
  }

  isDuplicate(currentVisitor: Visitor, previousVisitor: Visitor): boolean{
    return !(!previousVisitor?.dlNumber) && previousVisitor.dlNumber === currentVisitor.dlNumber;
  }
}
