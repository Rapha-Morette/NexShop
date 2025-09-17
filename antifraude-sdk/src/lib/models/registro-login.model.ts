export interface RegistroLogin {
  id?: string;
  usuarioId: string;
  ip: string;
  dataHora: string;
  risco: 'baixo' | 'medio' | 'alto';
}