import type { Metadata } from 'next'
import { useTranslations } from 'next-intl'

export const metadata: Metadata = {
  title: 'Ticket System List',
  description: 'Ticket System List',
}

export default function TicketList() {
  const t = useTranslations('farm.list')
  return (
    <div>
      <div>{t('title')}</div>
    </div>
  )
}
