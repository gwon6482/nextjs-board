"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function DeleteButton({ postId }: { postId: string }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm("정말로 이 글을 삭제하시겠습니까?")) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/posts/${postId}`, { method: "DELETE" });
      if (res.ok) {
        router.push("/");
        router.refresh();
      } else {
        const data = await res.json();
        alert(data.error ?? "삭제에 실패했습니다.");
      }
    } catch {
      alert("서버 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="flex-1 py-2.5 border border-red-200 rounded-lg text-red-500 text-sm font-medium hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
    >
      {loading ? "삭제 중..." : "삭제"}
    </button>
  );
}
