export class AdvanceTable {
    id: number;
    title: string;
    description: string;
    mname: string;
    priority: string;
    status: string;
    reviewer: string;
    comments: string;
    editcomments: string;
    file: string;
    size: string;

    constructor(advanceTable: AdvanceTable) {
        {
            // this.id = advanceTable.id || this.getRandomID();
            this.id = advanceTable.id; // ID will be set later
            this.title = advanceTable.title || '';
            this.description = advanceTable.description || '';
            this.mname = advanceTable.mname || '';
            this.priority = advanceTable.priority || '';
            this.status = advanceTable.status || '';
            this.reviewer = advanceTable.reviewer || '';
            this.comments = advanceTable.comments || '';
            this.editcomments = advanceTable.editcomments || '';
            this.file = advanceTable.file || '';
            this.size = advanceTable.size || '';
        }
    }
    public getRandomID(): number {
        const S4 = () => {
            return ((1 + Math.random()) * 0x10000) | 0;
        };
        return S4() + S4();
    }
}
