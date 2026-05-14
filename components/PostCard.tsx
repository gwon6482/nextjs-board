import Link from "next/link";
import type { Category } from "@/lib/constants";

const CATEGORY_COLOR: Record<Category, string> = {
  자유: "bg-orange-100 text-orange-600",
  정보: "bg-blue-100 text-blue-600",
  유머: "bg-yellow-100 text-yellow-600",
};

interface PostCardProps {
  id: string;
  title: string;
  authorNickname: string;
  createdAt: string;
  category: Category;
}

export default function PostCard({ id, title, authorNickname, createdAt, category }: PostCardProps) {
  const date = new Date(createdAt).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  return (
    <Link href={`/posts/${id}`}>
      <article className="bg-white rounded-xl border border-gray-200 p-4 hover:border-red-300 hover:shadow-sm transition-all active:scale-[0.99]">
        <div className="flex items-start gap-2 mb-2">
          <span className={`shrink-0 text-xs font-medium px-2 py-0.5 rounded-full ${CATEGORY_COLOR[category] ?? "bg-gray-100 text-gray-600"}`}>
            {category}
          </span>
          <h2 className="font-medium text-gray-900 line-clamp-2 leading-snug">{title}</h2>
        </div>
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>{authorNickname}</span>
          <span>{date}</span>
        </div>
      </article>
    </Link>
  );
}
