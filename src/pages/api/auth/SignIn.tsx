import type { NextPage } from "next";

const SignIn: NextPage = (): JSX.Element => {
  return (
    <div>
      <form>
        <h1>Login</h1>
        <input type="email" placeholder="cat@purrmail.paw"></input>
        <input type="password" placeholder="*******"></input>
        <input type="a" placeholder="*******"></input>
      </form>
    </div>
  );
};

export default SignIn;
 