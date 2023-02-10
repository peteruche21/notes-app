import { ConnectButton } from "@rainbow-me/rainbowkit";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const NavBar = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    switch (router.pathname) {
      case "/":
        setActiveTab(0);
        break;
      case "/me":
        setActiveTab(1);
        break;
      case "/new":
        setActiveTab(2);
        break;
      default:
        setActiveTab(0);
    }
  }, [router.pathname]);

  return (
    <div className="navbar bg-base-100">
      <div className="navbar-start">
        <div className="dropdown">
          <label tabIndex={0} className="btn-ghost btn lg:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h8m-8 6h16"
              />
            </svg>
          </label>
          <ul
            tabIndex={0}
            className="dropdown-content menu rounded-box menu-compact mt-3 w-52 bg-base-100 p-2 shadow"
          >
            <li>
              <Link
                href="/"
                className={`btn-ghost btn font-semibold normal-case ${
                  activeTab === 0 ? "btn-active" : ""
                } `}
              >
                public
              </Link>
            </li>
            <li>
              <Link
                href="/me"
                className={`btn-ghost btn font-semibold normal-case ${
                  activeTab === 1 ? "btn-active" : ""
                } `}
              >
                me
              </Link>
            </li>
            <li>
              <Link
                href="/new"
                className={`btn-ghost btn font-semibold normal-case ${
                  activeTab === 2 ? "btn-active" : ""
                } `}
              >
                new note
              </Link>
            </li>
          </ul>
        </div>
        <a className="btn-ghost btn text-xl normal-case">WeaveDB Notes</a>
      </div>
      <div className="navbar-center hidden lg:flex">
        <ul className="tabs">
          <li>
            <Link
              href="/"
              className={`tab tab-bordered ${
                activeTab === 0 ? "tab-active" : ""
              }`}
            >
              public
            </Link>
          </li>
          <li>
            <Link
              href="/me"
              className={`tab tab-bordered ${
                activeTab === 1 ? "tab-active" : ""
              }`}
            >
              me
            </Link>
          </li>
          <li>
            <Link
              href="/new"
              className={`tab tab-bordered ${
                activeTab === 2 ? "tab-active" : ""
              }`}
            >
              new
            </Link>
          </li>
        </ul>
      </div>
      <div className="navbar-end">
        <ConnectButton chainStatus="none" showBalance={false} />
      </div>
    </div>
  );
};

export default NavBar;
