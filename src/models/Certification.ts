import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

const certificationSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    issuer: { type: String, required: true, trim: true },
    image: { type: String, required: true },
    issuedAt: { type: Date },
    credentialUrl: { type: String },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export type CertificationDocument = InferSchemaType<
  typeof certificationSchema
> & {
  _id: mongoose.Types.ObjectId;
};

export const Certification: Model<CertificationDocument> =
  mongoose.models.Certification ??
  mongoose.model<CertificationDocument>("Certification", certificationSchema);
