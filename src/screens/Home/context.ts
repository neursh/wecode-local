import { hookstate } from '@hookstate/core';
import { WeCodeEndpoints } from '../../endpoints';

export interface Assignment {
  readonly name: string;
  readonly author: string;
  readonly problems: string;
  readonly submissions: string;
  readonly notes: string;
  readonly endDate: Date;
}

export enum ProblemStatus {
  solved,
  failed,
  noSubmission,
}

export interface Problem {
  readonly name: string;
  readonly score: string;
  readonly status: ProblemStatus;
  readonly description?: string;
  readonly languages?: { [key: string]: string };
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

  static async parseProblemDescription() {
    if (
      this.selectedAssignment.value === '' ||
      this.selectedProblem.value === ''
    )
      return;
    const assignmentId = this.selectedAssignment.value;
    const problemId = this.selectedProblem.value;

    await WeCodeEndpoints.getProblemDescription(
      assignmentId,
      problemId,
      (parseDocument) => {
        if (!parseDocument) return;

        const languages = parseDocument.getElementById('languages');
        if (languages) {
          const parsedLanguages: { [key: string]: string } = {};

          for (const child of languages.children) {
            if ((child as HTMLOptionElement).value) {
              parsedLanguages[(child as HTMLOptionElement).value] =
                child.innerHTML.trim().split(' ')[0].trim();
            }
          }

          this.problems[assignmentId][problemId].languages.set(parsedLanguages);
        }

        const description = parseDocument.getElementById('problem_description');
        if (!description) return;

        this.problems[assignmentId][problemId].description.set(
          // Polyfill the math renderer.
          // Inject custom styles to work on black theme.
          `
          <head>
            <link rel="stylesheet" href="/helper/katex.min.css">
            <script defer src="/helper/katex.min.js"></script>
            <script defer src="/helper/auto-render.min.js" onload="renderMathInElement(document.body);"></script>
          </head>
          ${description.innerHTML}
          <div style="height: 96px; display: block"></div>
          <script>
            document.body.style.padding = "1rem";
            document.querySelectorAll('*').forEach(el => {
              el.style.color = 'white';
              el.style.backgroundColor = '#121c22';
            });
            document.querySelectorAll('table, th, td').forEach(el => {
              el.style.borderColor = 'white';
              el.style.outlineColor = 'white';
              el.style.border = '1px solid white';
            });
          </script>
          `
        );
      }
    );
  }

  static clearStore() {
    this.problems.set({});
    this.selectedAssignment.set('');
    this.assignments.set({});
  }
}
