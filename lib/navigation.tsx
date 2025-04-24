import {
  useParams as useNextParams,
  usePathname as useNextPathname,
} from 'next/navigation'
import NextLink from 'next/link'

function createNavigation() {
  const Link = (props: React.ComponentPropsWithRef<typeof NextLink>) => {
    const { locale, workspace } = useNextParams()
    const { href, ...other } = props
    return (
      <NextLink href={`/${locale}/w/${workspace}${href}`} {...other}>
        {props.children}
      </NextLink>
    )
  }
  const usePathname: () => string = () => {
    const { locale, workspace } = useNextParams()
    const pathname = useNextPathname()
    return pathname.replace(`/${locale}/w/${workspace}`, '')
  }
  return {
    Link,
    usePathname,
  }
}
export const { Link, usePathname } = createNavigation()
