import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

const contactMessageSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    subject: { type: String, required: true, trim: true },
    message: { type: String, required: true },
    phone: { type: String, trim: true },
    website: { type: String, trim: true },
    budget: { type: String, trim: true },
    services: { type: [String], default: undefined },
    status: {
      type: String,
      enum: ["new", "read", "archived"],
      default: "new",
    },
  },
  { timestamps: true }
);

export type ContactMessageDocument = InferSchemaType<
  typeof contactMessageSchema
> & {
  _id: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
};

export const ContactMessage: Model<ContactMessageDocument> =
  mongoose.models.ContactMessage ??
  mongoose.model<ContactMessageDocument>(
    "ContactMessage",
    contactMessageSchema
  );
