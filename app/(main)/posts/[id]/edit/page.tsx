import { auth } from "@/lib/auth";
import { notFound, redirect } from "next/navigation";
import PostForm from "@/components/PostForm";

interface Post {
  _id: string;
  title: string;
  content: string;
  author: string;
}

async function getPost(id: string): Promise<Post> {
  const baseUrl = process.env.NEXTAUTH_URL ?? "http://localhost:3000";
  const res = await fetch(`${baseUrl}/api/posts/${id}`, { cache: "no-store" });
  if (res.status === 404) notFound();
  if (!res.ok) throw new Error("글을 불러올 수 없습니다.");
  const data = await res.json();
  return data.post;
}

export default async function EditPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [post, session] = await Promise.all([getPost(id), auth()]);

  if (!session?.user?.id || session.user.id !== post.author?.toString()) {
    redirect("/");
  }

  return (
    <div>
      <h1 className="text-lg font-bold text-gray-900 mb-4">글 수정</h1>
      <PostForm
        mode="edit"
        postId={id}
        initialTitle={post.title}
        initialContent={post.content}
      />
    </div>
  );
}
