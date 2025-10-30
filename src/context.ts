import { hookstate, none, State } from '@hookstate/core';
import { LocalStored, localstored } from '@hookstate/localstored';
import { nanoid } from 'nanoid';
import { WeCodeEndpoints } from './endpoints';
import { CredentialsService } from './screens/Credentials/context';
import { HomeContext } from './screens/Home/context';

export interface Profile {
  server: string;
  cookie: string;
  token: string;
  username?: string;
  userId?: string;
}

const urlNormalizer = (input: string) => input.replace(/\/+\//g, () => '/');

export class GlobalContext {
  static selectedProfile = hookstate('');
  static profiles: State<{ [key: string]: Profile }, LocalStored> = hookstate(
    JSON.parse(localStorage.getItem('PROFILES') ?? '{}') as {
      [key: string]: Profile;
    },
    localstored({ key: 'PROFILE' })
  );

  static createNewProfile(props: {
    server: string;
    cookie?: string;
    token?: string;
    username?: string;
    userId?: string;
  }) {
    const id = nanoid();

    const serverCollision = new URL(urlNormalizer(props.server));

    for (const profile of Object.values(this.profiles.value)) {
      if (new URL(profile.server).host === serverCollision.host) {
        return false;
      }
    }

    this.profiles[id].set({
      server: new URL(urlNormalizer(props.server)).href,
      cookie: props.cookie ?? '',
      token: props.token ?? '',
      username: props.username,
      userId: props.userId,
    });

    return id;
  }

  static updateProfile(
    id: string,
    props: {
      server?: string;
      cookie?: string;
      token?: string | null;
      username?: string;
      userId?: string;
    }
  ) {
    const old = this.profiles[id].value;

    this.profiles[id].set({
      server: new URL(urlNormalizer(props.server ?? old.server)).href,
      cookie: props.cookie ?? old.cookie,
      token: props.token ?? old.cookie,
      username: props.username ?? old.username,
      userId: props.userId ?? old.userId,
    });
  }

  static async deleteProfile(id: string) {
    await WeCodeEndpoints.signOut(this.profiles[id].value);
    this.profiles[id].set(none);
  }

  static exitCurrentProfile() {
    HomeContext.clearStore();
    CredentialsService.clearSession();
    this.selectedProfile.set('');
  }
}
