import { FollowerPointerCard } from "../aceternity/following-pointer";

export function FollowingPointerDemo() {
  return (
    <div className="mx-auto w-80">
      <FollowerPointerCard
        title={
          <TitleComponent
            title={blogContent.author}
            avatar={blogContent.authorAvatar}
          />
        }
      >
        <div className="relative h-full overflow-hidden transition duration-200 bg-white border rounded-2xl group hover:shadow-xl border-zinc-100">
          <div className="relative w-full overflow-hidden bg-gray-100 rounded-tl-lg rounded-tr-lg aspect-w-16 aspect-h-10 xl:aspect-w-16 xl:aspect-h-10">
            <img
              src={blogContent.image}
              alt="thumbnail"
              layout="fill"
              objectFit="cover"
              className={`group-hover:scale-95 group-hover:rounded-2xl transform object-cover transition duration-200 `}
            />
          </div>
          <div className="p-4 ">
            <h2 className="my-4 text-lg font-bold text-zinc-700">
              {blogContent.title}
            </h2>
            <h2 className="my-4 text-sm font-normal text-zinc-500">
              {blogContent.description}
            </h2>
            <div className="flex flex-row items-center justify-between mt-10">
              <span className="text-sm text-gray-500">{blogContent.date}</span>
              <div className="relative z-10 block px-6 py-2 text-xs font-bold text-white bg-black rounded-xl">
                Read More
              </div>
            </div>
          </div>
        </div>
      </FollowerPointerCard>
    </div>
  );
}

const blogContent = {
  slug: "amazing-tailwindcss-grid-layouts",
  author: "Manu Arora",
  date: "28th March, 2023",
  title: "Amazing Tailwindcss Grid Layout Examples",
  description:
    "Grids are cool, but Tailwindcss grids are cooler. In this article, we will learn how to create amazing Grid layouts with Tailwindcs grid and React.",
  image: "/demo/thumbnail.png",
  authorAvatar: "/manu.png",
};

const TitleComponent = ({
  title,
  avatar,
}: {
  title: string;
  avatar: string;
}) => (
  <div className="flex items-center space-x-2">
    <img
      src={avatar}
      height="20"
      width="20"
      alt="thumbnail"
      className="border-2 border-white rounded-full"
    />
    <p>{title}</p>
  </div>
);
