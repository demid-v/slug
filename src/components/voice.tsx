export const Voice = ({
  userImg,
  createdAt,
  url,
}: {
  userImg: string | undefined;
  createdAt: Date;
  url: string;
}) => {
  return (
    <div>
      <img
        src={userImg}
        className="h-8 w-8 rounded-full"
        alt="Profile picture"
      />
      <p>{createdAt.toLocaleTimeString()}</p>
      <audio src={url} controls />
    </div>
  );
};
