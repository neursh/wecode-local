import { hookstate, State } from '@hookstate/core';
import { GlobalContext } from '../../context';
import { WeCodeEndpoints } from '../../endpoints';

export enum SessionStatus {
  notChosen,
  launching,
  signInRequired,
  signedIn,
  invalidSession,
}

export enum SignInStatus {
  noSession,
  failed,
  success,
}

export class CredentialsService {
  static sessionLogo: State<string> = hookstate('');
  static sessionStatus: State<SessionStatus> = hookstate(
    SessionStatus.notChosen as SessionStatus
  );
  static signInStatus: State<SignInStatus> = hookstate(
    SignInStatus.noSession as SignInStatus
  );

  static async initSession() {
    if (GlobalContext.selectedProfile.value === '') {
      return SessionStatus.notChosen;
    }

    this.sessionStatus.set(SessionStatus.launching);

    const result = await this._initSession();
    this.sessionStatus.set(result);
    if (result === SessionStatus.signedIn) {
      this.signInStatus.set(SignInStatus.success);
    }
    return result;
  }

  private static async _initSession() {
    try {
      const result = await WeCodeEndpoints.checkService((parseDocument) => {
        if (!parseDocument) return;
        const logo = parseDocument.querySelector('img')?.getAttribute('src');
        if (!logo) return;
        this.sessionLogo.set(logo);
      });

      if (
        result.status === 302 &&
        result.headers.get('location')?.endsWith('home')
      ) {
        return SessionStatus.signedIn;
      }

      if (result.status !== 200) {
        return SessionStatus.invalidSession;
      }

      return SessionStatus.signInRequired;
    } catch (err) {
      console.error(err);
      return SessionStatus.invalidSession;
    }
  }

  static async signIn(username: string, password: string, remember: boolean) {
    if (this.sessionStatus.value !== SessionStatus.signInRequired) {
      return this.signInStatus.value;
    }

    const result = await this._signIn(username, password, remember);
    this.signInStatus.set(result);
    if (result === SignInStatus.success) {
      this.sessionStatus.set(SessionStatus.signedIn);
    }
    return result;
  }

  private static async _signIn(
    username: string,
    password: string,
    remember: boolean
  ) {
    try {
      const result = await WeCodeEndpoints.signIn(username, password, remember);

      if (
        result.status === 302 &&
        result.headers.get('location')?.endsWith('home')
      ) {
        GlobalContext.updateProfile(GlobalContext.selectedProfile.value, {
          username: username,
        });
        return SignInStatus.success;
      } else {
        return SignInStatus.failed;
      }
    } catch (err) {
      console.error(err);
      return SignInStatus.failed;
    }
  }

  static clearSession() {
    this.sessionStatus.set(SessionStatus.invalidSession);
    this.signInStatus.set(SignInStatus.noSession);
    this.sessionLogo.set('');
  }
}
