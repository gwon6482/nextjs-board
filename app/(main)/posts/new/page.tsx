import PostForm from "@/components/PostForm";

export default function NewPostPage() {
  return (
    <div>
      <h1 className="text-lg font-bold text-gray-900 mb-4">글 작성</h1>
      <PostForm mode="create" />
    </div>
  );
}
