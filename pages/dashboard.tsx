import { signOut, useSession } from 'next-auth/react';
import { HeroSection } from '../components/LandingPage/HeroSection';
import { HeaderAction } from '../components/NavBar/NavBar';

export default function Dashboard() {
  const { data: session } = useSession();
  if (session) {
    return (
      <>
        {' '}
        Signed in as {session.user?.email} <br />{' '}
        <button type="submit" onClick={() => signOut()}>
          Sign out
        </button>{' '}
      </>
    );
  }

  return (
    <>
      <HeaderAction />
      <HeroSection />
      {/* <ColorSchemeToggle /> */}
    </>
  );
}
