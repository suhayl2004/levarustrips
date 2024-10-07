import { formatDate } from "@angular/common";
export class AdvanceTable {
  id: number;
  cdate: string;
  udate: string;
  createdby: string;
  title: string;
  owner: string;
  items: string;
  assignedto: string;
  description: string;
  sprint: string;
  testtype: string;
  eresults: string;
  edate: string;

  constructor(advanceTable: AdvanceTable) {
    {
      this.id = advanceTable.id || this.getRandomID();
      this.cdate = formatDate(new Date(), "dd/MM/yyyy", "en") || "";
      this.udate = formatDate(new Date(), "dd/MM/yyyy", "en") || "";
      this.createdby = advanceTable.createdby || "";
      this.title = advanceTable.title || "";
      this.owner = advanceTable.owner || "";
      this.items = advanceTable.items || "";
      this.assignedto = advanceTable.assignedto || "";
      this.description = advanceTable.description || "";
      this.sprint = advanceTable.sprint || "";
      this.testtype = advanceTable.testtype || "";
      this.eresults = advanceTable.eresults || "";
      this.edate = advanceTable.edate || "";
    }
  }
  public getRandomID(): number {
    const S4 = () => {
      return ((1 + Math.random()) * 0x10000) | 0;
    };
    return S4() + S4();
  }
}
