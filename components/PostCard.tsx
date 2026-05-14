import Link from "next/link";

interface PostCardProps {
  id: string;
  title: string;
  authorNickname: string;
  createdAt: string;
}

export default function PostCard({ id, title, authorNickname, createdAt }: PostCardProps) {
  const date = new Date(createdAt).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  return (
    <Link href={`/posts/${id}`}>
      <article className="bg-white rounded-xl border border-gray-200 p-4 hover:border-blue-300 hover:shadow-sm transition-all active:scale-[0.99]">
        <h2 className="font-medium text-gray-900 line-clamp-2 mb-2">{title}</h2>
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>{authorNickname}</span>
          <span>{date}</span>
        </div>
      </article>
    </Link>
  );
}
