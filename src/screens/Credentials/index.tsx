import { useHookstate } from '@hookstate/core';
import { fetch } from '@tauri-apps/plugin-http';
import { motion } from 'motion/react';
import { useLayoutEffect, useRef } from 'react';
import { GlobalContext } from '../../context';
import { CredentialsService, SessionStatus, SignInStatus } from './context';

export default function Credentials() {
  const selectedProfile = useHookstate(GlobalContext.selectedProfile);
  const sessionStatus = useHookstate(CredentialsService.sessionStatus);
  const sessionLogo = useHookstate(CredentialsService.sessionLogo);
  const logoLink = useHookstate('');

  useLayoutEffect(() => {
    if (selectedProfile.value !== '') {
      CredentialsService.clearSession();
      CredentialsService.initSession();
      logoLink.set('');
    }
    // Ignore `logoLink`
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedProfile.value]);

  useLayoutEffect(() => {
    if (sessionLogo.value !== '' && logoLink.get() === '') {
      fetch(sessionLogo.value, {
        danger: { acceptInvalidHostnames: true, acceptInvalidCerts: true },
      }).then(async (result) => {
        logoLink.set(
          `data:image/png;base64, ${new Uint8Array(
            await result.arrayBuffer()
          ).toBase64()}`
        );
      });
    }
    // Ignore `logoLink`
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionLogo.value]);

  return (
    <section
      className="w-dvw h-dvh flex items-center justify-center"
      data-tauri-drag-region
    >
      <motion.div
        layout
        className="card w-120 bg-base-100 shadow-sm outline outline-[white]/20"
        transition={{ duration: 0.25, ease: [0.5, 0.5, 0, 1] }}
      >
        <div className="card-body">
          <div className="relative flex justify-between items-center mb-4">
            <div className="flex items-center gap-4">
              {logoLink.value !== '' && (
                <img
                  className="object-contain size-12"
                  src={logoLink.value}
                ></img>
              )}
              <motion.h2
                layout
                className="text-3xl font-bold"
                transition={{ duration: 0.25, ease: [0.5, 0.5, 0, 1] }}
              >
                WeCode
              </motion.h2>
            </div>
            <Assist />
          </div>
          {sessionStatus.value === SessionStatus.launching && <Loading />}
          {sessionStatus.value === SessionStatus.signInRequired && <SignIn />}
        </div>
      </motion.div>
    </section>
  );
}

function Loading() {
  return (
    <div className="w-full flex justify-center items-center">
      <span className="loading loading-spinner loading-xl"></span>
    </div>
  );
}

function Assist() {
  const sessionStatus = useHookstate(CredentialsService.sessionStatus);

  return (
    <motion.span
      layout
      className="badge badge-outline text-ellipsis text-nowrap cursor-pointer"
      transition={{ duration: 0.25, ease: [0.5, 0.5, 0, 1] }}
      onClick={() => {
        CredentialsService.clearSession();
        GlobalContext.selectedProfile.set('');
      }}
    >
      {sessionStatus.value === SessionStatus.invalidSession ? (
        'Welcome!'
      ) : (
        <div className="flex gap-1 items-center justify-between">
          Select profile
          <svg
            className="size-3 translate-y-px"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m8.25 4.5 7.5 7.5-7.5 7.5"
            />
          </svg>
        </div>
      )}
    </motion.span>
  );
}

function SignIn() {
  const username = useRef<HTMLInputElement>(null);
  const password = useRef<HTMLInputElement>(null);
  const remember = useRef<HTMLInputElement>(null);
  const checking = useHookstate(false);

  const signin = async () => {
    if (username.current!.value === '' || password.current!.value === '') {
      return;
    }
    checking.set(true);
    const result = await CredentialsService.signIn(
      username.current!.value,
      password.current!.value,
      remember.current!.checked
    );

    checking.set(result === SignInStatus.success);
  };

  return (
    <>
      <label className="w-full input">
        <svg className="h-[1em] opacity-50" viewBox="0 0 24 24">
          <g
            strokeLinejoin="round"
            strokeLinecap="round"
            strokeWidth="2.5"
            fill="none"
            stroke="currentColor"
          >
            <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </g>
        </svg>
        <input ref={username} type="text" required placeholder="Username" />
      </label>
      <label className="w-full input">
        <svg className="h-[1em] opacity-50" viewBox="0 0 24 24">
          <g
            strokeLinejoin="round"
            strokeLinecap="round"
            strokeWidth="2.5"
            fill="none"
            stroke="currentColor"
          >
            <path d="M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z" />
            <circle cx="16.5" cy="7.5" r=".5" fill="currentColor" />
          </g>
        </svg>
        <input ref={password} type="password" required placeholder="Password" />
      </label>
      <label className="flex ml-3 gap-1.5 items-center pt-1 pb-1">
        <input
          ref={remember}
          type="checkbox"
          className="checkbox checkbox-xs checkbox-accent"
        />
        <p>Keep me signed in! (server handles ts idk)</p>
      </label>
      <div className="mt-2">
        <button
          className={
            !checking.value
              ? 'btn btn-primary btn-block'
              : 'btn btn-dash w-full'
          }
          onClick={() => signin()}
        >
          {!checking.value && 'Login'}
          {checking.value && (
            <span className="loading loading-spinner loading-sm" />
          )}
        </button>
      </div>
    </>
  );
}
