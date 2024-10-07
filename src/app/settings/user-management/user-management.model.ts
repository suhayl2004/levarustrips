export class AdvanceTable {
    id: number;
    uname: string;
    emailid: string;
    password: string;
    company: string;
    project: string;

    constructor(advanceTable: AdvanceTable) {
        {
            this.id = advanceTable.id || this.getRandomID();
            this.uname = advanceTable.uname || '';
            this.emailid = advanceTable.emailid || '';
            this.password = advanceTable.password || '';
            this.company = advanceTable.company || '';
            this.project = advanceTable.project || '';
        }
    }
    public getRandomID(): number {
        const S4 = () => {
            return ((1 + Math.random()) * 0x10000) | 0;
        };
        return S4() + S4();
    }
}
