import { formatDate } from "@angular/common";

export class AdvanceTable {
  id: number;
  title: string;
  cdate: string;
  createdby: string;
  assignee: string;
  frequency: string;
  emate: string;
  ddescription: string;
  mname: string;
  priority: string;
  status: string;
  severity: string;
  reqid: string;
  tcaseid: string;
  tscenarioid: string;
  complexity: string;
  file: string;
  comments: string;
  editcomments: string;

  constructor(advanceTable: AdvanceTable) {
    {
      // this.id = advanceTable.id || this.getRandomID();
      this.id = advanceTable.id; // ID will be set later
     // this.id = advanceTable.id || 0; // Initialize ID with 0, but will be set dynamically
      this.title = advanceTable.title || "";
      this.cdate = formatDate(new Date(), "dd/MM/yyyy", "en") || "";
      this.createdby = advanceTable.createdby || "";
      this.assignee = advanceTable.assignee || "";
      this.frequency = advanceTable.frequency || "";
      this.emate = formatDate(new Date(), "dd/MM/yyyy", "en") || "";
      this.ddescription = advanceTable.ddescription || "";
      this.mname = advanceTable.mname || "";
      this.priority = advanceTable.priority || "";
      this.status = advanceTable.status || "";
      this.severity = advanceTable.severity || "";
      this.reqid = advanceTable.reqid || "";
      this.tcaseid = advanceTable.tcaseid || "";
      this.tscenarioid = advanceTable.tscenarioid || "";
      this.complexity = advanceTable.complexity || "";
      this.file = advanceTable.file || "";
      this.comments = advanceTable.comments || "";
      this.editcomments = advanceTable.editcomments || "";
    }
  }
  public getRandomID(): number {
    const S4 = () => {
      return ((1 + Math.random()) * 0x10000) | 0;
    };
    return S4() + S4();
  }
}
