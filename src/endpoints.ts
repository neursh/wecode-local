import { fetch } from '@tauri-apps/plugin-http';
import { GlobalContext, Profile } from './context';

export class WeCodeEndpoints {
  static readonly domParser = new DOMParser();
  static readonly textDecoder = new TextDecoder();

  static async checkService(
    customParsing?: (parseDocument?: Document) => Promise<void> | void
  ) {
    const profile =
      GlobalContext.profiles[GlobalContext.selectedProfile.value].value;

    const checkUrl = new URL(`${profile.server}/login`);
    const result = await fetch(checkUrl.href, {
      danger: { acceptInvalidHostnames: true, acceptInvalidCerts: true },
      maxRedirections: 0,
    });

    await this.updateSession(await result.text(), customParsing);
    return result;
  }

  static async signIn(username: string, password: string, remember: boolean) {
    const profile =
      GlobalContext.profiles[GlobalContext.selectedProfile.value].value;

    const pack = new URLSearchParams();
    pack.append('_token', profile.token);
    pack.append('username', username);
    pack.append('password', password);
    if (remember) {
      pack.append('remember', 'on');
    }

    const loginUrl = new URL(`${profile.server}/login`);
    const result = await fetch(loginUrl.href, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      danger: { acceptInvalidHostnames: true, acceptInvalidCerts: true },
      body: pack.toString(),
      mode: 'cors',
      maxRedirections: 0,
    });

    await this.updateSession(await result.text());
    return result;
  }

  static async signOut(externalProfile?: Profile) {
    const profile =
      externalProfile ??
      GlobalContext.profiles[GlobalContext.selectedProfile.value].value;

    const loginUrl = new URL(`${profile.server}/logout`);
    const result = await fetch(loginUrl.href, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      danger: { acceptInvalidHostnames: true, acceptInvalidCerts: true },
      body: `_token=${profile.token}`,
      mode: 'cors',
      maxRedirections: 0,
    });

    return result;
  }

  static async getAssignments(
    customParsing?: (parseDocument?: Document) => Promise<void> | void
  ) {
    const profile =
      GlobalContext.profiles[GlobalContext.selectedProfile.value].value;

    const checkUrl = new URL(`${profile.server}/assignments`);
    const result = await fetch(checkUrl.href, {
      danger: { acceptInvalidHostnames: true, acceptInvalidCerts: true },
      redirect: 'manual',
    });

    await this.updateSession(await result.text(), customParsing);
    return result;
  }

  static async getProblems(
    id: string,
    customParsing?: (parseDocument?: Document) => Promise<void> | void
  ) {
    const profile =
      GlobalContext.profiles[GlobalContext.selectedProfile.value].value;

    const checkUrl = new URL(`${profile.server}/assignment/${id}/0`);
    const result = await fetch(checkUrl.href, {
      danger: { acceptInvalidHostnames: true, acceptInvalidCerts: true },
      redirect: 'manual',
    });

    await this.updateSession(await result.text(), customParsing);
    return result;
  }

  static async getProblemDescription(
    assignmentId: string,
    problemId: string,
    customParsing?: (parseDocument?: Document) => Promise<void> | void
  ) {
    const profile =
      GlobalContext.profiles[GlobalContext.selectedProfile.value].value;

    const checkUrl = new URL(
      `${profile.server}/assignment/${assignmentId}/${problemId}`
    );
    const result = await fetch(checkUrl.href, {
      danger: { acceptInvalidHostnames: true, acceptInvalidCerts: true },
      redirect: 'manual',
    });

    await this.updateSession(await result.text(), customParsing);
    return result;
  }

  static async updateSession(
    body: string,
    customParsing?: (parseDocument?: Document) => Promise<void> | void
  ) {
    let parseDocument: Document | undefined = undefined;
    let username: string | undefined = undefined;
    let token: string | undefined | null = undefined;
    let userId: string | undefined = undefined;
    try {
      parseDocument = this.domParser.parseFromString(body, 'text/html');
      token = parseDocument
        .querySelector('meta[name=csrf-token]')
        ?.getAttribute('content');
      username = parseDocument.getElementById('profile_link')?.innerText;
      userId = (
        parseDocument.getElementsByClassName('btn btn-info text-nowrap')[0] as
          | HTMLAnchorElement
          | undefined
      )?.href
        .split('/')
        .pop();
    } catch (err) {
      console.error("Can't update session service!!!");
      console.error(err);
    }

    GlobalContext.updateProfile(GlobalContext.selectedProfile.value, {
      username,
      token,
      userId,
    });

    if (customParsing) {
      await customParsing(parseDocument);
    }
  }
}
