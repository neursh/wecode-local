import { RefObject, useRef } from 'react';
import { GlobalContext } from '../../../context';

export default function NewServerInput() {
  const modal = useRef<HTMLDialogElement>(null);
  const server = useRef<HTMLInputElement>(null);

  return (
    <>
      <li className="w-full">
        <label className="w-full input">
          <svg className="h-[1em] opacity-50" viewBox="0 0 24 24">
            <g
              strokeLinejoin="round"
              strokeLinecap="round"
              strokeWidth="2.5"
              fill="none"
              stroke="currentColor"
            >
              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
            </g>
          </svg>
          <input
            ref={server}
            type="url"
            required
            placeholder="New WeCode server"
          />
          <svg
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-6 cursor-pointer"
            onClick={() => {
              if (server.current!.value !== '') {
                !GlobalContext.createNewProfile({
                  server: server.current!.value,
                }) && modal.current!.showModal();
                server.current!.value = '';
              }
            }}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 4.5v15m7.5-7.5h-15"
            />
          </svg>
        </label>
      </li>
      <CollisionDetected ref={modal} />
    </>
  );
}

function CollisionDetected(props: {
  ref: RefObject<HTMLDialogElement | null>;
}) {
  return (
    <dialog ref={props.ref} className="modal">
      <div className="modal-box">
        <h3 className="font-bold text-lg">
          There is another server with the same host
        </h3>
        <p className="py-4">
          Sessions are stored per host, just like how browser's cookie works.
          That results in the limit of only one server with one active account.
          <br />
          So no, can't add the same one.
        </p>
        <div className="modal-action">
          <a
            className="btn btn-info"
            onClick={() => props.ref.current!.close()}
          >
            Okay, bad app, just say it.
          </a>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  );
}
