import mongoose, { Schema, Document } from 'mongoose';

// Interface para o documento do projeto
export interface IProject extends Document {
  name: string;
  client: string;
  startDate: Date;
  endDate: Date;
  coverImage?: string;
  isFavorite: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Schema do projeto
const ProjectSchema: Schema = new Schema({
  name: {
    type: String,
    required: [true, 'Nome do projeto é obrigatório'],
    trim: true,
    minlength: [2, 'Nome deve ter pelo menos 2 caracteres'],
    maxlength: [100, 'Nome deve ter no máximo 100 caracteres']
  },
  client: {
    type: String,
    required: [true, 'Cliente é obrigatório'],
    trim: true,
    minlength: [2, 'Nome do cliente deve ter pelo menos 2 caracteres'],
    maxlength: [100, 'Nome do cliente deve ter no máximo 100 caracteres']
  },
  startDate: {
    type: Date,
    required: [true, 'Data de início é obrigatória']
  },
  endDate: {
    type: Date,
    required: [true, 'Data final é obrigatória']
  },
  coverImage: {
    type: String,
    default: null
  },
  isFavorite: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true // Adiciona createdAt e updatedAt automaticamente
});

// Índices para melhor performance
ProjectSchema.index({ name: 1 });
ProjectSchema.index({ client: 1 });
ProjectSchema.index({ startDate: 1 });
ProjectSchema.index({ endDate: 1 });
ProjectSchema.index({ isFavorite: 1 });
ProjectSchema.index({ createdAt: -1 });

// Middleware para validação adicional
ProjectSchema.pre<IProject>('save', function(next) {
  // Agora o TypeScript reconhece corretamente o tipo
  if (this.endDate <= this.startDate) {
    next(new Error('Data final deve ser posterior à data de início'));
    return;
  }
  next();
});

// Método para converter para JSON personalizado
ProjectSchema.methods.toJSON = function() {
  const obj = this.toObject();
  obj.id = obj._id.toString();
  delete obj._id;
  delete obj.__v;
  return obj;
};

export const ProjectModel = mongoose.model<IProject>('Project', ProjectSchema);
