import { formatDate } from "@angular/common";
export class AdvanceTable {
  id: number;
  text: string;
  flag: string;
  lang: string;
  constructor(advanceTable: AdvanceTable) {
    {
      this.id = advanceTable.id || this.getRandomID();
      this.text = advanceTable.text || "";
      this.flag = advanceTable.flag || "";
      this.lang = advanceTable.lang || "";
    }
  }
  public getRandomID(): number {
    const S4 = () => {
      return ((1 + Math.random()) * 0x10000) | 0;
    };
    return S4() + S4();
  }
}
