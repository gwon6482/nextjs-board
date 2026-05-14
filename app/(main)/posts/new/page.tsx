import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import PostForm from "@/components/PostForm";

export default async function NewPostPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login?callbackUrl=/posts/new");

  return (
    <div>
      <h1 className="text-lg font-bold text-gray-900 mb-4">글 작성</h1>
      <PostForm mode="create" />
    </div>
  );
}
