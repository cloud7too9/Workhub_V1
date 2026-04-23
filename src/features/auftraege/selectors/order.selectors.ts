import type { Order, OrderStatusFilter, OrderSortMode } from '@/types/orders';
import type { Werkstueck } from '@/types/workpieces';

export function selectFilteredOrders(
  orders: Order[],
  workpieces: Werkstueck[],
  options: {
    statusFilter: OrderStatusFilter;
    searchTerm: string;
    sortMode: OrderSortMode;
  },
): Order[] {
  let result = orders;

  if (options.statusFilter !== 'all') {
    result = result.filter((o) => o.status === options.statusFilter);
  }

  const term = options.searchTerm.trim().toLowerCase();
  if (term) {
    result = result.filter((o) => {
      const wp = workpieces.find((w) => w.id === o.workpieceId);
      return [
        o.article,
        o.customer,
        o.orderNumber,
        wp?.bezeichnung,
        wp?.fertigmass,
        wp?.saegemass,
      ].some((f) => f?.toLowerCase().includes(term));
    });
  }

  const sorted = [...result];
  switch (options.sortMode) {
    case 'deliveryDateAsc':
      sorted.sort((a, b) => a.deliveryDate.localeCompare(b.deliveryDate));
      break;
    case 'deliveryDateDesc':
      sorted.sort((a, b) => b.deliveryDate.localeCompare(a.deliveryDate));
      break;
    case 'updatedAtDesc':
      sorted.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
      break;
  }

  return sorted;
}
