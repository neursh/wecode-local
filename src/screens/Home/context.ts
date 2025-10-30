import { hookstate, State } from '@hookstate/core';
import { WeCodeEndpoints } from '../../endpoints';

export interface Assignment {
  name: string;
  author: string;
  problems: string;
  submissions: string;
  notes: string;
  endDate: Date;
}

export class HomeContext {
  static selectedAssignment = hookstate('');
  static assignments: State<{ [key: string]: Assignment }> = hookstate(
    {} as { [key: string]: Assignment }
  );

  static async parseAssignments() {
    await WeCodeEndpoints.getAssignments(async (parseDocument) => {
      if (!parseDocument) return;

      const contentRows = parseDocument.getElementsByTagName('table')[0].rows;
      const parsed: { [key: string]: Assignment } = {};

      for (let i = 1; i < contentRows.length; i++) {
        const cells = contentRows.item(i)!.cells;

        const id = cells.item(0)?.innerText;
        if (!id) continue;

        const [name, author] = cells
          .item(3)!
          .innerText.replace(/\s+/g, ' ')
          .trim()
          .split(' (by:');

        const [submissions, probNotes] = cells
          .item(4)!
          .innerText.replace(/\s+/g, ' ')
          .trim()
          .split(' sub - ');
        const [problems, notes] = probNotes.split(' prob ');

        const rawEndDate = cells.item(6)?.innerText;
        if (!rawEndDate) continue;

        const endDate = new Date(rawEndDate);

        parsed[id] = {
          name,
          author: author.replace(')', ''),
          problems,
          submissions,
          notes,
          endDate,
        };
      }

      this.assignments.set(parsed);
    });
  }

  static clearStore() {
    this.selectedAssignment.set('');
    this.assignments.set({});
  }
}
