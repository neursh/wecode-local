import { useHookstate } from '@hookstate/core';
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

  if (selectedProfile.value === '') {
    return <Profiles />;
  }

  if (sessionStatus.value === SessionStatus.signedIn) {
    return <Home />;
  } else {
    return <Credentials />;
  }
}
