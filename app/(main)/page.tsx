import PostCard from "@/components/PostCard";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Post {
  _id: string;
  title: string;
  authorNickname: string;
  createdAt: string;
}

interface PostsResponse {
  posts: Post[];
  total: number;
  page: number;
  totalPages: number;
}

async function getPosts(page: number): Promise<PostsResponse> {
  const baseUrl = process.env.NEXTAUTH_URL ?? "http://localhost:3000";
  const res = await fetch(`${baseUrl}/api/posts?page=${page}`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("글 목록을 불러올 수 없습니다.");
  return res.json();
}

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page: pageParam } = await searchParams;
  const page = Math.max(1, parseInt(pageParam ?? "1", 10));

  let data: PostsResponse;
  try {
    data = await getPosts(page);
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
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-lg font-bold text-gray-900">전체 글</h1>
        <Link
          href="/posts/new"
          className="text-sm bg-blue-600 text-white px-4 py-1.5 rounded-full hover:bg-blue-700 transition-colors"
        >
          글쓰기
        </Link>
      </div>

      {posts.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          아직 작성된 글이 없습니다.
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
          <span className="text-sm text-gray-600">
            {page} / {totalPages}
          </span>
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
