export const colors = {
  primary:      '#C8102E',
  primaryDark:  '#A00D23',
  primaryTint:  '#FEF0F2',
  black:        '#000000',
  muted:        '#6B6B6B',
  dark:         '#1D1D1D',
  surface:      '#FFFFFF',
  bg:           '#F5F5F5',
} as const

export const statusColors: Record<string, { bg: string; text: string }> = {
  available:   { bg: '#DCFCE7', text: '#166534' },
  rented:      { bg: '#DBEAFE', text: '#1E40AF' },
  maintenance: { bg: '#FEF9C3', text: '#854D0E' },
  pending:     { bg: '#FEF3C7', text: '#92400E' },
  confirmed:   { bg: '#DBEAFE', text: '#1E40AF' },
  completed:   { bg: '#F3F4F6', text: '#374151' },
  cancelled:   { bg: '#FEE2E2', text: '#991B1B' },
  sold:        { bg: '#F3F4F6', text: '#374151' },
}

export const chartColors = {
  revenue:  '#C8102E',
  expense:  '#D1D5DB',
  profit:   '#166534',
  neutral:  '#9CA3AF',
} as const

export function statusClass(status: string): string {
  const map: Record<string, string> = {
    available:   'bg-[#DCFCE7] text-[#166534]',
    rented:      'bg-[#DBEAFE] text-[#1E40AF]',
    maintenance: 'bg-[#FEF9C3] text-[#854D0E]',
    pending:     'bg-[#FEF3C7] text-[#92400E]',
    confirmed:   'bg-[#DBEAFE] text-[#1E40AF]',
    completed:   'bg-[#F3F4F6] text-[#374151]',
    cancelled:   'bg-[#FEE2E2] text-[#991B1B]',
    sold:        'bg-[#F3F4F6] text-[#374151]',
  }
  return map[status?.toLowerCase()] ?? 'bg-gray-100 text-gray-500'
}
