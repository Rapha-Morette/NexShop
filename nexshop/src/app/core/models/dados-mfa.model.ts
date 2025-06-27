export interface DadosMfa {
  usuarioId: string;
  email: string;
  ip: string;
  nivel: 'baixo' | 'medio' | 'alto';
}
