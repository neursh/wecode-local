/* eslint-disable react-hooks/refs */
import { useHookstate } from '@hookstate/core';
import { RefObject, useMemo, useRef } from 'react';
import { GlobalContext } from '../../../context';

export default function ProfileItem(props: {
  server: string;
  username?: string;
  id: string;
}) {
  const modal = useRef<HTMLDialogElement>(null);
  const selectedProfile = useHookstate(GlobalContext.selectedProfile);

  const displayServer = useMemo(
    () => props.server.replace('https://', '').replace('http://', ''),
    [props.server]
  );

  return (
    <>
      <li
        className="flex justify-between items-center list-row outline cursor-pointer"
        onClick={() => selectedProfile.set(props.id)}
      >
        <div className="flex items-center gap-2">
          <svg
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m21 7.5-2.25-1.313M21 7.5v2.25m0-2.25-2.25 1.313M3 7.5l2.25-1.313M3 7.5l2.25 1.313M3 7.5v2.25m9 3 2.25-1.313M12 12.75l-2.25-1.313M12 12.75V15m0 6.75 2.25-1.313M12 21.75V19.5m0 2.25-2.25-1.313m0-16.875L12 2.25l2.25 1.313M21 14.25v2.25l-2.25 1.313m-13.5 0L3 16.5v-2.25"
            />
          </svg>
          <div className="flex flex-col">
            <p className="font-bold">{displayServer}</p>
            <p>
              {props.username ? `Active user: ${props.username}` : 'No user'}
            </p>
          </div>
        </div>
        <button
          className="btn btn-ghost"
          onClick={(event) => {
            event.stopPropagation();
            modal.current!.showModal();
          }}
        >
          <svg
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-4"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
            />
          </svg>
        </button>
      </li>
      <DeleteModal
        ref={modal}
        id={props.id}
        displayServer={displayServer}
        username={props.username}
      />
    </>
  );
}

function DeleteModal(props: {
  ref: RefObject<HTMLDialogElement | null>;
  id: string;
  displayServer: string;
  username?: string;
}) {
  const checking = useHookstate(false);
  const field = useRef<HTMLInputElement>(null);

  return (
    <dialog ref={props.ref} className="modal">
      <div className="modal-box">
        <h3 className="font-bold text-lg">Are you sure?</h3>
        <p className="py-4">
          You are about to delete{' '}
          <span className="font-bold">{props.displayServer}</span>. Type{' '}
          <span className="font-bold font-mono">&apos;delete&apos;</span> in the
          field below to confirm.
        </p>
        {props.username && (
          <p>
            You will lose access to{' '}
            <span className="font-bold font-mono">{props.username}</span>
          </p>
        )}
        <label className="w-full input input-error font-mono">
          <input ref={field} type="url" required />
        </label>
        <div className="modal-action">
          <a
            className={`btn btn-outline ${checking.value && 'btn-disabled'}`}
            onClick={() => !checking.value && props.ref.current!.close()}
          >
            Cancel
          </a>
          <a
            className={`btn btn-error ${checking.value && 'btn-disabled'}`}
            onClick={async () => {
              if (field.current!.value === 'delete' && !checking.value) {
                checking.set(true);
                try {
                  await GlobalContext.deleteProfile(props.id);
                } catch (err) {
                  console.error(err);
                }
              }
            }}
          >
            <div className="flex items-center gap-2">
              {checking.value && (
                <span className="loading loading-spinner loading-xs"></span>
              )}
              <span>Delete</span>
            </div>
          </a>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  );
}
