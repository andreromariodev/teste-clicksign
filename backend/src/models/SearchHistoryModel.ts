import mongoose, { Schema } from 'mongoose';

// Interface para o histórico de busca
export interface ISearchHistory {
  term: string;
  createdAt: Date;
}

// Schema do histórico de busca
const SearchHistorySchema: Schema = new Schema({
  term: {
    type: String,
    required: true,
    trim: true,
    minlength: 3
  }
}, {
  timestamps: { createdAt: true, updatedAt: false }
});

// Índice para ordenação por data
SearchHistorySchema.index({ createdAt: -1 });

export const SearchHistoryModel = mongoose.model<ISearchHistory>('SearchHistory', SearchHistorySchema);
