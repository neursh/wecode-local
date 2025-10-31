import { hookstate } from '@hookstate/core';
import { WeCodeEndpoints } from '../../endpoints';

export interface Assignment {
  name: string;
  author: string;
  problems: string;
  submissions: string;
  notes: string;
  endDate: Date;
}

export enum ProblemStatus {
  solved,
  failed,
  noSubmission,
}

export interface Problem {
  name: string;
  score: string;
  status: ProblemStatus;
}

export class HomeContext {
  static readonly selectedAssignment = hookstate('');
  static readonly assignments = hookstate({} as { [key: string]: Assignment });

  static readonly selectedProblem = hookstate('');
  static readonly problems = hookstate(
    {} as { [key: string]: { [key: string]: Problem } }
  );

  static async parseAssignments() {
    await WeCodeEndpoints.getAssignments(async (parseDocument) => {
      if (!parseDocument) return;

      const contentRows = parseDocument.getElementsByTagName('table')[0].rows;
      const parsed: { [key: string]: Assignment } = {};

      for (let i = 1; i < contentRows.length; i++) {
        const cells = contentRows[i]?.cells;
        if (!cells) continue;

        const id = cells[0]?.innerText.trim();

        const nameAndAuthor = cells[3]?.innerText
          .replace(/\s+/g, ' ')
          .trim()
          .split(' (by:');

        const submissionsProblemsNotes = cells[4]?.innerText
          .replace(/\s+/g, ' ')
          .trim()
          .split(' sub - ');

        if (!nameAndAuthor || !submissionsProblemsNotes || !id) continue;

        const [name, author] = nameAndAuthor;
        const [submissions, probNotes] = submissionsProblemsNotes;
        const [problems, notes] = probNotes.split(' prob ');

        const rawEndDate = cells[6]?.innerText;
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

  static async parseProblems() {
    if (this.selectedAssignment.value === '') return;

    const inProcess = this.selectedAssignment.value;

    await WeCodeEndpoints.getProblems(inProcess, async (parseDocument) => {
      if (!parseDocument) return;

      const problemsRows = (
        parseDocument.getElementsByClassName(
          'wecode_table table table-bordered'
        )[0] as HTMLTableElement
      ).rows;

      const parsed: { [key: string]: Problem } = {};

      for (let i = 1; i < problemsRows.length; i++) {
        const cells = problemsRows[i]?.cells;
        if (!cells) continue;

        const id = (
          cells[1]?.children[0] as HTMLAnchorElement | undefined
        )?.href
          .split('/')
          .pop()
          ?.trim();
        const name = cells[1]?.innerText.trim();
        const score = cells[2]?.innerText.trim();

        const rawSolveStatus = cells[2]?.className.trim();
        const status = !rawSolveStatus
          ? ProblemStatus.noSubmission
          : rawSolveStatus.includes('bg-success')
          ? ProblemStatus.solved
          : ProblemStatus.failed;

        if (!id || !name || !score) {
          continue;
        }

        parsed[id] = {
          name,
          score,
          status,
        };
      }

      this.problems[inProcess].set(parsed);
    });
  }

  static clearStore() {
    this.problems.set({});
    this.selectedAssignment.set('');
    this.assignments.set({});
  }
}
