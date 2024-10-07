export class AdvanceTable {
    id: number;
    company: string;
    pcode: string;
    pname: string;

    constructor(advanceTable: AdvanceTable) {
        {
            this.id = advanceTable.id || this.getRandomID();
            this.company = advanceTable.company || '';
            this.pcode = advanceTable.pcode || '';
            this.pname = advanceTable.pname || '';
        }
    }
    public getRandomID(): number {
        const S4 = () => {
            return ((1 + Math.random()) * 0x10000) | 0;
        };
        return S4() + S4();
    }
}
