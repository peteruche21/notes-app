/* eslint-disable @typescript-eslint/no-misused-promises */
import { withIronSessionSsr } from "iron-session/next";
import { sessionOptions } from "../lib/session";
import type { GetServerSideProps, NextPage } from "next";
import { useForm } from "react-hook-form";
import { api } from "../utils/api";

interface FormData {
  title: string;
  body: string;
}

const NewNote: NextPage = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>();

  const addNote = api.notes.add.useMutation();

  const onSubmit = async (data: FormData) => {
    const result = await addNote.mutateAsync(data);

    if (result.error) {
      console.log(result.error);
    }
    reset();
  };

  return (
    <div className="mockup-code mx-auto min-h-[600px] max-w-[1080px] p-5">
      <form onSubmit={handleSubmit(onSubmit)} className="max-w-md space-y-5">
        <div>
          {errors.title && (
            <p className="py-2 text-red-600">This field is required</p>
          )}
          <input
            type="text"
            id="title"
            placeholder="what is the title of your note?"
            className="input-bordered input w-full max-w-md"
            {...register("title", { required: true })}
          />
        </div>
        <div>
          {errors.body && (
            <p className="pb-2 text-red-600">This field is required</p>
          )}

          <textarea
            id="body"
            placeholder="write your note here"
            className="textarea-bordered textarea textarea-lg h-[400px] w-full max-w-md"
            {...register("body", { required: true })}
          />
        </div>
        <button type="submit" className="btn btn-primary btn-block">
          Submit
        </button>
      </form>
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
