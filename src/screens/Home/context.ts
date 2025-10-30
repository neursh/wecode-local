import { WeCodeEndpoints } from '../../endpoints';

export class HomeContext {
  static async parseAssignments() {
    await WeCodeEndpoints.getAssignments(async (parseDocument) => {
      if (!parseDocument) return;

      const contentRows = parseDocument.getElementsByTagName('table')[0].rows;
      // const parse: HTMLTableRowElement[] = [];

      for (let i = 1; i < contentRows.length; i++) {
        const cells = contentRows.item(i)!.cells;
        console.log(cells.item(3)?.innerText.replace(/\s+/g, ' ').trim());
      }
    });
  }
}
