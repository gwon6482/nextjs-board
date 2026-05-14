import { auth } from "@/lib/auth";
import { notFound } from "next/navigation";
import Link from "next/link";
import DeleteButton from "./DeleteButton";
import { getPostById } from "@/lib/posts";
import type { Category } from "@/lib/constants";

const CATEGORY_COLOR: Record<Category, string> = {
  자유: "bg-orange-100 text-orange-600",
  정보: "bg-blue-100 text-blue-600",
  유머: "bg-yellow-100 text-yellow-600",
};

export default async function PostDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [post, session] = await Promise.all([getPostById(id), auth()]);

  if (!post) notFound();

  const isAuthor = session?.user?.id === post.author?.toString();

  const date = new Date(post.createdAt).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div>
      <div className="mb-4">
        <Link href="/" className="text-sm text-gray-500 hover:text-red-600">
          ← 목록으로
        </Link>
      </div>

      <article className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div className="p-5 border-b border-gray-100">
          <div className="flex items-center gap-2 mb-2">
            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${CATEGORY_COLOR[post.category] ?? "bg-gray-100 text-gray-600"}`}>
              {post.category}
            </span>
          </div>
          <h1 className="text-xl font-bold text-gray-900 mb-3">{post.title}</h1>
          <div className="flex items-center justify-between text-sm text-gray-500">
            <span>{post.authorNickname}</span>
            <span>{date}</span>
          </div>
        </div>

        <div className="p-5">
          <p className="text-gray-800 whitespace-pre-wrap leading-relaxed">{post.content}</p>
        </div>
      </article>

      {isAuthor && (
        <div className="flex gap-3 mt-4">
          <Link
            href={`/posts/${id}/edit`}
            className="flex-1 text-center py-2.5 border border-gray-300 rounded-lg text-gray-700 text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            수정
          </Link>
          <DeleteButton postId={id} />
        </div>
      )}
    </div>
  );
}
