import { Visitor } from "./visitor";

export interface Scan{
  timestamp: Date;
  raw: string;
  visitor: Visitor;
}
