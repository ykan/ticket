import { createTranslator } from 'next-intl'

import { PageView, PageHead, PageBody } from '@/components/page-view'
import { getFarm, getMiners } from '@/lib/supabase'
import { FarmDisplay } from '@/components/farm-display'
import { CreateButton } from './create-button'

type RouteParams = {
  id: string
  locale: string
}
export default async function Farm({
  params,
}: {
  params: Promise<RouteParams>
}) {
  const { id, locale } = await params
  const messages = (await import(`@/messages/${locale}.json`)).default
  const t = createTranslator({
    locale: locale,
    messages,
    namespace: 'farm.list',
  })
  const [farm, miners] = await Promise.all([getFarm(id), getMiners(id)])

  return (
    <PageView>
      <PageHead>
        <div className="text-lg font-semibold flex-1">{t('title')}</div>
        <div>
          <CreateButton farmId={id} />
        </div>
      </PageHead>
      <PageBody>
        {farm ? (
          <FarmDisplay className="p-10" farm={farm} miners={miners} />
        ) : null}
      </PageBody>
    </PageView>
  )
}
