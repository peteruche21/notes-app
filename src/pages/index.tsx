import { withIronSessionSsr } from "iron-session/next";
import { sessionOptions } from "../lib/session";
import type { GetServerSideProps, NextPage } from "next";

const HomePage: NextPage = () => {
  return <></>;
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
      redirect: {
        destination: "/notes",
        permanent: false,
      },
    };
  },
  sessionOptions
);

export default HomePage;
