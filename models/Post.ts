import mongoose, { Schema, Document, Model, Types } from "mongoose";
import { CATEGORIES, type Category } from "@/lib/constants";

export { CATEGORIES, type Category };

export interface IPost extends Document {
  title: string;
  content: string;
  author: Types.ObjectId;
  authorNickname: string;
  category: Category;
  createdAt: Date;
  updatedAt: Date;
}

const PostSchema = new Schema<IPost>(
  {
    title: { type: String, required: true, trim: true },
    content: { type: String, required: true },
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
    authorNickname: { type: String, required: true },
    category: { type: String, enum: CATEGORIES, required: true, default: "자유" },
  },
  { timestamps: true }
);

const Post: Model<IPost> =
  mongoose.models.Post ?? mongoose.model<IPost>("Post", PostSchema);

export default Post;
