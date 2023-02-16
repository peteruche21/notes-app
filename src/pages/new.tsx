import { withIronSessionSsr } from "iron-session/next";
import { sessionOptions } from "../lib/session";
import type { GetServerSideProps, NextPage } from "next";
import Form from "../components/Form";

const NewNote: NextPage = () => {
  return (
    <div className="mockup-code mx-auto min-h-[600px] max-w-[1080px] p-5">
      <Form type="new"/>
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

export default NewNote;
