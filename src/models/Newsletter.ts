import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

const newsletterSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
  },
  { timestamps: true }
);

export type NewsletterDocument = InferSchemaType<typeof newsletterSchema> & {
  _id: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
};

export const Newsletter: Model<NewsletterDocument> =
  mongoose.models.Newsletter ??
  mongoose.model<NewsletterDocument>("Newsletter", newsletterSchema);
