import PostCard from "@/components/PostCard";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { CATEGORIES, type Category } from "@/lib/constants";

interface Post {
  _id: string;
  title: string;
  authorNickname: string;
  createdAt: string;
  category: Category;
}

interface PostsResponse {
  posts: Post[];
  total: number;
  page: number;
  totalPages: number;
}

async function getPosts(page: number, category: string | null): Promise<PostsResponse> {
  const baseUrl = process.env.NEXTAUTH_URL ?? "http://localhost:3000";
  const params = new URLSearchParams({ page: String(page) });
  if (category) params.set("category", category);
  const res = await fetch(`${baseUrl}/api/posts?${params}`, { cache: "no-store" });
  if (!res.ok) throw new Error("글 목록을 불러올 수 없습니다.");
  return res.json();
}

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; category?: string }>;
}) {
  const { page: pageParam, category: categoryParam } = await searchParams;
  const page = Math.max(1, parseInt(pageParam ?? "1", 10));
  const activeCategory = CATEGORIES.includes(categoryParam as Category)
    ? (categoryParam as Category)
    : null;

  let data: PostsResponse;
  try {
    data = await getPosts(page, activeCategory);
  } catch {
    return (
      <div className="text-center py-20 text-gray-500">
        글 목록을 불러오는 데 실패했습니다.
      </div>
    );
  }

  const { posts, totalPages } = data;

  const tabBase = "flex-1 py-2.5 text-sm font-medium transition-colors border-b-2";
  const tabActive = "border-red-500 text-red-600";
  const tabInactive = "border-transparent text-gray-500 hover:text-red-500";

  return (
    <div>
      {/* 상단 타이틀 + 글쓰기 버튼 */}
      <div className="flex items-center justify-between mb-3">
        <h1 className="text-lg font-bold text-gray-900">게시판</h1>
        <Link
          href="/posts/new"
          className="text-sm bg-red-500 text-white px-4 py-1.5 rounded-full hover:bg-red-600 transition-colors"
        >
          글쓰기
        </Link>
      </div>

      {/* 카테고리 탭 */}
      <div className="flex border-b border-gray-200 mb-4">
        <Link
          href="/?page=1"
          className={`${tabBase} ${activeCategory === null ? tabActive : tabInactive}`}
        >
          전체
        </Link>
        {CATEGORIES.map((cat) => (
          <Link
            key={cat}
            href={`/?category=${cat}&page=1`}
            className={`${tabBase} ${activeCategory === cat ? tabActive : tabInactive}`}
          >
            {cat}
          </Link>
        ))}
      </div>

      {/* 글 목록 */}
      {posts.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          {activeCategory ? `${activeCategory} 게시판에 글이 없습니다.` : "아직 작성된 글이 없습니다."}
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

      {/* 페이지네이션 */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-8">
          {page > 1 && (
            <Link
              href={`?${activeCategory ? `category=${activeCategory}&` : ""}page=${page - 1}`}
              className="p-2 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors"
            >
              <ChevronLeft size={16} />
            </Link>
          )}
          <span className="text-sm text-gray-600">{page} / {totalPages}</span>
          {page < totalPages && (
            <Link
              href={`?${activeCategory ? `category=${activeCategory}&` : ""}page=${page + 1}`}
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
