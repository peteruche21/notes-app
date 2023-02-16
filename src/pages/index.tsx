import { withIronSessionSsr } from "iron-session/next";
import { sessionOptions } from "../lib/session";
import type {
  GetServerSideProps,
  InferGetServerSidePropsType,
  NextPage,
} from "next";
import { createProxySSGHelpers } from "@trpc/react-query/ssg";
import superjson from "superjson";

import NoteCard from "../components/Cards/NoteCard";

import { api } from "../utils/api";
import { appRouter } from "../server/api/root";
import { createInnerTRPCContext } from "../server/api/trpc";
import Alert from "../components/Alert";

const HomePage: NextPage = (
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) => {
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
      {allNotes.isFetching && (
        <button className="btn loading btn-circle mb-10 max-w-[5rem]"></button>
      )}
      {!allNotes.isFetching && (
        <button
          className="btn mb-10 max-w-[5rem] text-sm lowercase"
          onClick={refresh}
        >
          refresh
        </button>
      )}
      <div className="columns-1 gap-5 lg:columns-2">
        {allNotes.isError ? (
          <Alert
            status="warning"
            message="Error! check your internet connection and try again."
          />
        ) : allNotes.data?.ok ? (
          allNotes.data.data!.length > 0 ? (
            renderList()
          ) : (
            <Alert
              status="info"
              message="No notes found! click new to create new note."
            />
          )
        ) : (
          <Alert
            status="error"
            message="Error! unable to fetch notes. try again later!"
          />
        )}
      </div>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = withIronSessionSsr(
  async function ({ req }) {
    const siwe = req.session?.siwe;

    const context = createInnerTRPCContext({ session: req.session });

    const ssg = createProxySSGHelpers({
      router: appRouter,
      ctx: context,
      transformer: superjson,
    });

    await ssg.notes.all.prefetch();

    if (!siwe) {
      return {
        redirect: {
          destination: "/login",
          permanent: false,
        },
      };
    }

    return {
      props: { trpcState: ssg.dehydrate() },
    };
  },
  sessionOptions
);

export default HomePage;
