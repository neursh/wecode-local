import { useHookstate } from '@hookstate/core';
import { motion } from 'motion/react';
import { GlobalContext } from '../../context';
import NewServerInput from './content/NewProfileInput';
import ProfileItem from './content/ProfileItem';

export default function Profiles() {
  const profiles = useHookstate(GlobalContext.profiles);

  return (
    <section
      className="w-full h-dvh flex items-center justify-center"
      data-tauri-drag-region
    >
      <motion.div
        layout
        className="card w-160 bg-base-100 shadow-sm outline outline-[white]/20"
        transition={{ duration: 0.25, ease: [0.5, 0.5, 0, 1] }}
      >
        <div className="card-body">
          <div className="flex font-bold text-2xl pb-4">Select profile</div>
          <ul className="w-full list gap-4 rounded-box shadow-md">
            {Object.entries(profiles.value).map((value, index) => (
              <ProfileItem
                key={`prof${index}`}
                server={value[1].server}
                username={value[1].username}
                id={value[0]}
              />
            ))}
            <NewServerInput />
          </ul>
        </div>
      </motion.div>
    </section>
  );
}
