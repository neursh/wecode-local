import { useHookstate } from '@hookstate/core';
import { getCurrentWindow } from '@tauri-apps/api/window';
import { useLayoutEffect } from 'react';
import { GlobalContext } from './context';
import Credentials from './screens/Credentials';
import {
  CredentialsService,
  SessionStatus,
} from './screens/Credentials/context';
import Home from './screens/Home';
import Profiles from './screens/Profiles';

export default function App() {
  const selectedProfile = useHookstate(GlobalContext.selectedProfile);
  const sessionStatus = useHookstate(CredentialsService.sessionStatus);

  useLayoutEffect(() => {
    if (sessionStatus.value === SessionStatus.signedIn) {
      getCurrentWindow().maximize();
    }
  }, [sessionStatus.value]);

  if (selectedProfile.value === '') {
    return <Profiles />;
  }

  if (sessionStatus.value === SessionStatus.signedIn) {
    return <Home />;
  } else {
    return <Credentials />;
  }
}
