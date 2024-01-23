"use client";

import { faGoogle, faGithub } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useAuth } from "@web/src/context/login";
import { sign } from "crypto";

const LoginPage = () => {
  const { login } = useAuth();
  return (
    <main className="w-full h-full m-auto text-center bg-zinc-900 flex items-center justify-center">
      <div className="flex flex-col gap-4 bg-zinc-800 w-[480px] rounded-xl p-10">
        <div>
          <h2 className="text-4xl mb-2">Sign in</h2>
          <p>to discover, share and listen to note block music</p>
        </div>
        <div className="h-4"></div>
        {/* Login with Google */}
        <button
          onClick={() => {
            const url = login("google");
            // set the window location to the url
          }}
          className="flex items-center text-white outline outline-white outline-1 bg-none p-2.5 hover:outline-orange-500 hover:text-orange-500 hover:transition-all duration-200 uppercase rounded-lg"
        >
          <FontAwesomeIcon icon={faGoogle} className="align-middle mr-2 h-5" />
          <span className="flex-1">Login with Google</span>
        </button>
        {/* Login with Github */}
        <button
          onClick={() => {
            const url = login("github");
            // set the window location to the url
          }}
          className="flex items-center text-white outline outline-white outline-1 bg-none p-2.5 hover:outline-orange-500 hover:text-orange-500 hover:transition-all duration-200 uppercase rounded-lg"
        >
          <FontAwesomeIcon icon={faGithub} className="align-middle mr-2 h-5" />
          <span className="flex-1">Login with GitHub</span>
        </button>
      </div>
    </main>
  );
};

export default LoginPage;
