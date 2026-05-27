export type StatusPedido =
  | 'pendente'
  | 'pago'
  | 'em_separacao'
  | 'enviado'
  | 'entregue'
  | 'cancelado';

export const STATUS_INFO: Record<StatusPedido, { rotulo: string; classe: string }> = {
  pendente: { rotulo: 'Pendente', classe: 'bg-yellow-100 text-yellow-800' },
  pago: { rotulo: 'Pago', classe: 'bg-blue-100 text-blue-800' },
  em_separacao: { rotulo: 'Em separação', classe: 'bg-purple-100 text-purple-800' },
  enviado: { rotulo: 'Enviado', classe: 'bg-orange-100 text-orange-800' },
  entregue: { rotulo: 'Entregue', classe: 'bg-green-100 text-green-800' },
  cancelado: { rotulo: 'Cancelado', classe: 'bg-red-100 text-red-800' },
};

/** Ordem da timeline (cancelado é tratado à parte). */
export const TIMELINE: StatusPedido[] = ['pendente', 'pago', 'em_separacao', 'enviado', 'entregue'];

export function formatarPreco(valor: number) {
  return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

export function formatarData(iso: string) {
  return new Date(iso).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}
