import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import PostCard from "@/components/PostCard";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getMyPosts } from "@/lib/posts";

export default async function MyPostsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const { page: pageParam } = await searchParams;
  const page = Math.max(1, parseInt(pageParam ?? "1", 10));

  let data;
  try {
    data = await getMyPosts(session.user.id, page);
  } catch {
    return (
      <div className="text-center py-20 text-gray-500">
        글 목록을 불러오는 데 실패했습니다.
      </div>
    );
  }

  const { posts, totalPages } = data;

  return (
    <div>
      <h1 className="text-lg font-bold text-gray-900 mb-4">내 글 목록</h1>

      {posts.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-gray-400 mb-4">작성한 글이 없습니다.</p>
          <Link href="/posts/new" className="text-sm text-red-600 hover:underline">
            첫 글을 작성해보세요 →
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {posts.map((post) => (
            <PostCard
              key={post._id}
              id={post._id}
              title={post.title}
              authorNickname={post.authorNickname}
              createdAt={post.createdAt}
              category={post.category}
            />
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-8">
          {page > 1 && (
            <Link
              href={`?page=${page - 1}`}
              className="p-2 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors"
            >
              <ChevronLeft size={16} />
            </Link>
          )}
          <span className="text-sm text-gray-600">{page} / {totalPages}</span>
          {page < totalPages && (
            <Link
              href={`?page=${page + 1}`}
              className="p-2 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors"
            >
              <ChevronRight size={16} />
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
