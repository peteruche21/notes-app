import { withIronSessionSsr } from "iron-session/next";
import { sessionOptions } from "../lib/session";
import { createProxySSGHelpers } from "@trpc/react-query/ssg";
import type {
  GetServerSideProps,
  NextPage,
  InferGetServerSidePropsType,
} from "next";
import NoteCard from "../components/Cards/NoteCard";
import superjson from "superjson";
import { createInnerTRPCContext } from "../server/api/trpc";
import { appRouter } from "../server/api/root";
import { api } from "../utils/api";

const HomePage: NextPage = (
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) => {
  const allNotes = api.notes.all.useQuery();
  const { data } = allNotes;
  console.log(data);

  return (
    <div className="flex">
      <div className="mx-auto columns-1 gap-5 lg:columns-2">
        <NoteCard />
        <NoteCard />
        <NoteCard />
        <NoteCard />
      </div>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = withIronSessionSsr(
  async function ({ req }) {
    const siwe = req.session?.siwe;

    const context = await createInnerTRPCContext({ session: req.session });

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
      props: {
        trpcState: ssg.dehydrate(),
      },
    };
  },
  sessionOptions
);

export default HomePage;
