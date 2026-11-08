import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

const projectSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true },
    summary: { type: String, required: true },
    description: { type: String, required: true },
    role: { type: String, required: true },
    category: { type: String, required: true },
    coverImage: { type: String, required: true },
    featured: { type: Boolean, default: false },
    published: { type: Boolean, default: true },
    tags: { type: [String], default: [] },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export type ProjectDocument = InferSchemaType<typeof projectSchema> & {
  _id: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
};

export const Project: Model<ProjectDocument> =
  mongoose.models.Project ??
  mongoose.model<ProjectDocument>("Project", projectSchema);
