import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import Post from "@/models/Post";
import { CATEGORIES, type Category } from "@/lib/constants";

const PAGE_SIZE = 10;

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
    const myOnly = searchParams.get("my") === "true";
    const categoryParam = searchParams.get("category");
    const category = CATEGORIES.includes(categoryParam as Category)
      ? (categoryParam as Category)
      : null;

    const session = await auth();
    const filter: Record<string, unknown> = {};
    if (myOnly && session?.user?.id) filter.author = session.user.id;
    if (category) filter.category = category;

    const total = await Post.countDocuments(filter);
    const posts = await Post.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * PAGE_SIZE)
      .limit(PAGE_SIZE)
      .select("title authorNickname createdAt category")
      .lean();

    return NextResponse.json({
      posts,
      total,
      page,
      totalPages: Math.ceil(total / PAGE_SIZE),
    });
  } catch {
    return NextResponse.json({ error: "서버 오류가 발생했습니다." }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 });
    }

    const { title, content, category } = await req.json();
    if (!title?.trim() || !content?.trim()) {
      return NextResponse.json({ error: "제목과 내용을 입력해주세요." }, { status: 400 });
    }
    if (!CATEGORIES.includes(category)) {
      return NextResponse.json({ error: "올바른 카테고리를 선택해주세요." }, { status: 400 });
    }

    await connectDB();

    const post = await Post.create({
      title: title.trim(),
      content: content.trim(),
      author: session.user.id,
      authorNickname: session.user.name ?? "알 수 없음",
      category,
    });

    return NextResponse.json({ post }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "서버 오류가 발생했습니다." }, { status: 500 });
  }
}
