import { connectDB } from "./mongodb";
import Post from "@/models/Post";
import type { Category } from "./constants";

const PAGE_SIZE = 10;

export interface PostSummary {
  _id: string;
  title: string;
  authorNickname: string;
  createdAt: string;
  category: Category;
}

export interface PostDetail {
  _id: string;
  title: string;
  content: string;
  authorNickname: string;
  author: string;
  category: Category;
  createdAt: string;
  updatedAt: string;
}

export interface PostsResult {
  posts: PostSummary[];
  total: number;
  page: number;
  totalPages: number;
}

export async function getPosts(page: number, category: Category | null): Promise<PostsResult> {
  await connectDB();

  const filter: Record<string, unknown> = {};
  if (category) filter.category = category;

  const total = await Post.countDocuments(filter);
  const posts = await Post.find(filter)
    .sort({ createdAt: -1 })
    .skip((page - 1) * PAGE_SIZE)
    .limit(PAGE_SIZE)
    .select("title authorNickname createdAt category")
    .lean();

  return {
    posts: posts as unknown as PostSummary[],
    total,
    page,
    totalPages: Math.ceil(total / PAGE_SIZE),
  };
}

export async function getMyPosts(userId: string, page: number): Promise<PostsResult> {
  await connectDB();

  const filter = { author: userId };
  const total = await Post.countDocuments(filter);
  const posts = await Post.find(filter)
    .sort({ createdAt: -1 })
    .skip((page - 1) * PAGE_SIZE)
    .limit(PAGE_SIZE)
    .select("title authorNickname createdAt category")
    .lean();

  return {
    posts: posts as unknown as PostSummary[],
    total,
    page,
    totalPages: Math.ceil(total / PAGE_SIZE),
  };
}

export async function getPostById(id: string): Promise<PostDetail | null> {
  await connectDB();

  const post = await Post.findById(id).lean();
  if (!post) return null;
  return post as unknown as PostDetail;
}
