import { auth } from "@/lib/auth";
import { notFound, redirect } from "next/navigation";
import PostForm from "@/components/PostForm";
import { getPostById } from "@/lib/posts";

export default async function EditPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [post, session] = await Promise.all([getPostById(id), auth()]);

  if (!post) notFound();

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
        initialCategory={post.category}
      />
    </div>
  );
}
