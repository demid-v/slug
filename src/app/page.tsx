import SlugIcon from "~/components/slug-icon";

const HomePage = async () => {
  return (
    <div className="flex flex-col items-center">
      <div className="absolute top-1/2 flex min-h-0 -translate-y-2/3 flex-col items-center gap-10">
        <SlugIcon width="100%" height="100%" className="h-fit max-w-80" />
        <h1 className="text-center text-6xl">
          <span className="font-semibold">Welcome to </span>
          <span className="font-bold">Slug</span>
        </h1>
      </div>
    </div>
  );
};

export default HomePage;
