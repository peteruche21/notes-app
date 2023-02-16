import { useForm } from "react-hook-form";
import { api } from "../../utils/api";

interface FormData {
  title: string;
  body: string;
}

interface IFormProps {
  data?: FormData;
  type: "new" | "update";
  docid?: string;
}
const Form = ({ type, docid, data }: IFormProps) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>();

  const addNote = api.notes.add.useMutation();
  const updateNote = api.notes.update.useMutation();

  const onSubmit = async (data: FormData) => {
    const result =
      type === "new"
        ? await addNote.mutateAsync(data)
        : await updateNote.mutateAsync({
            data,
            docid: docid as string,
            privatize: false,
          });
    // alert the user
    if (result.error) {
      console.log(result.error);
    }
    reset();
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-md space-y-5">
      <div>
        {errors.title && (
          <p className="py-2 text-red-600">This field is required</p>
        )}
        <input
          type="text"
          id="title"
          value={data?.title}
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
          value={data?.body}
          placeholder="write your note here"
          className="textarea-bordered textarea textarea-lg h-[400px] w-full max-w-md"
          {...register("body", { required: true })}
        />
      </div>
      <button type="submit" className="btn-primary btn-block btn">
        Submit
      </button>
    </form>
  );
};

export default Form;
