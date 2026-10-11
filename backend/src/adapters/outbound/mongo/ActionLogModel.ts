import mongoose, { Schema, Document } from 'mongoose';

export interface IActionLog extends Document {
  userId?: string;
  action: string;
  resource: string;
  details: string;
  durationMs: number;
  createdAt: Date;
}

const ActionLogSchema: Schema = new Schema({
  userId: { type: String, required: false },
  action: { type: String, required: true },
  resource: { type: String, required: true },
  details: { type: String, required: true },
  durationMs: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now }
});

export const ActionLogModel = mongoose.model<IActionLog>('ActionLog', ActionLogSchema);
