import { useLayoutEffect } from 'react';
import { HomeContext } from './context';

export default function Home() {
  useLayoutEffect(() => {
    HomeContext.parseAssignments();
  }, []);

  return <></>;
}
