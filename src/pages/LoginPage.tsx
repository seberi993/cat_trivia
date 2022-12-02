import { signIn, signOut, useSession } from "next-auth/react";
import { sayMeow } from "say-meow";


const LoginPage = () => {
  
  const { data: session } = useSession();
  const user = session?.user;
  if (session) {
    console.log(session);
    return(    
    <div>{sayMeow(user?.name ? user?.name:"purrson")}.. That means Welcome<> {user?.name} </>
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
