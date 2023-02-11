import { withIronSessionSsr } from "iron-session/next";
import { sessionOptions } from "../lib/session";
import type { GetServerSideProps, NextPage } from "next";
import NoteCard from "../components/Cards/NoteCard";

import { api } from "../utils/api";

const HomePage: NextPage = () => {
  const allNotes = api.notes.all.useQuery();

  const renderList = (): JSX.Element[] | undefined => {
    return allNotes.data?.data
      ?.filter((element) => !element.data.private)
      .map((element, index) => {
        return <NoteCard data={element} key={index} />;
      });
  };

  const refresh = async () => {
    await allNotes.refetch();
  };

  return (
    <div className="flex flex-col items-center">
      <button
        className="btn mb-10 max-w-[5rem] text-sm lowercase"
        onClick={refresh}
      >
        refresh
      </button>
      <div className="columns-1 gap-5 lg:columns-2">
        {allNotes.data?.ok ? (
          allNotes.data.data!.length > 0 ? (
            renderList()
          ) : (
            <div className="alert alert-info shadow-lg">
              <div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  className="h-6 w-6 flex-shrink-0 stroke-current"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  ></path>
                </svg>
                <span>No notes. create one</span>
              </div>
            </div>
          )
        ) : (
          <button className="loading btn-square btn"></button>
        )}
      </div>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = withIronSessionSsr(
  function ({ req }) {
    const siwe = req.session?.siwe;

    if (!siwe) {
      return {
        redirect: {
          destination: "/login",
          permanent: false,
        },
      };
    }

    return {
      props: {},
    };
  },
  sessionOptions
);

export default HomePage;
