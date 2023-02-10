import { useRouter } from "next/router";

const NoteCard = () => {
  const router = useRouter();

  return (
    <div className="card mb-8 max-w-[600px] shadow-xl dark:bg-neutral">
      <div className="card-body">
        <div className="inline-flex justify-between">
          <h3 className="text-md font-thin">card ID</h3>
          <div className="badge-primary badge">0xaddress</div>
        </div>
        <h2 className="card-title">Note Title!</h2>
        <div className="flex gap-4">
          <h4 className="text-xs font-bold italic">created at: </h4>
          <h4 className="text-xs font-bold italic">last updated at</h4>
        </div>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Illo
          repudiandae fugit quod, impedit dolores, incidunt ratione delectus
          maiores cupiditate quasi nulla consectetur exercitationem aliquid
          quidem alias ipsam quas, unde blanditiis?
        </p>
        <div className="card-actions btn-group absolute -bottom-3 left-5 justify-start gap-0">
          <button className="btn btn-sm">
            <svg
              fill="currentColor"
              className="h-5 w-5 dark:text-white "
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path d="M5.433 13.917l1.262-3.155A4 4 0 017.58 9.42l6.92-6.918a2.121 2.121 0 013 3l-6.92 6.918c-.383.383-.84.685-1.343.886l-3.154 1.262a.5.5 0 01-.65-.65z" />
              <path d="M3.5 5.75c0-.69.56-1.25 1.25-1.25H10A.75.75 0 0010 3H4.75A2.75 2.75 0 002 5.75v9.5A2.75 2.75 0 004.75 18h9.5A2.75 2.75 0 0017 15.25V10a.75.75 0 00-1.5 0v5.25c0 .69-.56 1.25-1.25 1.25h-9.5c-.69 0-1.25-.56-1.25-1.25v-9.5z" />
            </svg>
          </button>
          <button className="btn btn-sm">
            <svg
              fill="currentColor"
              className="h-5 w-5 dark:text-white "
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                clipRule="evenodd"
                fillRule="evenodd"
                d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 10.23 1.482l.149-.022.841 10.518A2.75 2.75 0 007.596 19h4.807a2.75 2.75 0 002.742-2.53l.841-10.52.149.023a.75.75 0 00.23-1.482A41.03 41.03 0 0014 4.193V3.75A2.75 2.75 0 0011.25 1h-2.5zM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4zM8.58 7.72a.75.75 0 00-1.5.06l.3 7.5a.75.75 0 101.5-.06l-.3-7.5zm4.34.06a.75.75 0 10-1.5-.06l-.3 7.5a.75.75 0 101.5.06l.3-7.5z"
              />
            </svg>
          </button>
          {router.pathname === "/me" && (
            <button className="btn btn-sm">
              <svg
                fill="currentColor"
                className="h-5 w-5 dark:text-white "
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path
                  clipRule="evenodd"
                  fillRule="evenodd"
                  d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z"
                />
              </svg>
            </button>
          )}
        </div>
        <div className="card-actions btn-group absolute -bottom-3 right-5 justify-end gap-0">
          <button className="btn-disabled btn btn-active btn-sm">1</button>
          <button className="btn btn-sm">
            <svg
              fill="currentColor"
              className="h-5 w-5 text-red-600"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default NoteCard;