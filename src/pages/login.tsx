import React from "react";
import LoginButton from "../components/Login";

const Login = () => {
  return (
    <div className="flex h-[80vh] px-4">
      <div className="card image-full m-auto w-[500px] bg-base-100 shadow-xl">
        <figure>
          <img
            src="https://www.murdoch.edu.au/sf-images/newsportallibrary/feature-images/note-taking-feature.jpg?sfvrsn=ff31cf5f_0"
            alt="notes"
          />
        </figure>
        <div className="card-body">
          <h2 className="card-title">WeaveDB Notes App</h2>
          <p>You have to sign in with your ethereum wallet to use this app!</p>
          <div className="card-actions justify-end">
            <LoginButton />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
