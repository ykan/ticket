import { useLocale } from 'next-intl'
import { useRouter } from 'next/navigation'

export default function LanguageSwitcher() {
  const locale = useLocale()
  const router = useRouter()

  const toggleLocale = () => {
    const newLocale = locale === 'en' ? 'zh' : 'en'
    router.push(`/${newLocale}`)
  }

  return (
    <button
      onClick={toggleLocale}
      className="px-4 py-2 rounded-md bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700"
    >
      {locale === 'en' ? '中文' : 'English'}
    </button>
  )
}
