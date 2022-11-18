import { signIn, signOut, useSession } from "next-auth/react";


const LoginPage = () => {
  const { data: session } = useSession();
  if (session) {
    console.log(session);
    return(    
    <div>
      <> Welcome {session.user} </>
      <button className=" border-white border-2 relative text-white rounded-md bg-legendary" onClick={() => signOut()}>Sign out</button>
    </div>
    );
  } else {
    return (
      <div>
        <button
          className=" border-white border-2 relative text-white rounded-md bg-uncommon"
          onClick={() => signIn()}
        >
          Sign in
        </button>
      </div>
    );
  }
};
export default LoginPage;
