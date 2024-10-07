import { formatDate } from "@angular/common";
export class AdvanceTable {
    id: number;
    tscenario: string;
    tcases: string;
    name: string;
    cdate: string;
    title: string;
    description: string;
    mname: string;
    priority: string;
    tctype: string;
    pconditions: string;
    comments: string;
    editcomments: string;
    file: string;

    constructor(advanceTable: AdvanceTable) {
        {
            this.id = advanceTable.id || this.getRandomID();
            this.tscenario = advanceTable.tscenario || '';
            this.tcases = advanceTable.tcases || '';
            this.name = advanceTable.name || '';
            this.cdate = formatDate(new Date(), "dd/MM/yyyy", "en") || "";
            this.title = advanceTable.title || '';
            this.description = advanceTable.description || '';
            this.mname = advanceTable.mname || '';
            this.priority = advanceTable.priority || '';
            this.tctype = advanceTable.tctype || '';
            this.pconditions = advanceTable.pconditions || '';
            this.comments = advanceTable.comments || '';
            this.editcomments = advanceTable.editcomments || '';
            this.file = advanceTable.file || '';
        }
    }
    public getRandomID(): number {
        const S4 = () => {
            return ((1 + Math.random()) * 0x10000) | 0;
        };
        return S4() + S4();
    }
}
