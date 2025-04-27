import { useParams as useNextParams } from 'next/navigation'
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
  const useRootPath: () => string = () => {
    const { locale, workspace } = useNextParams()
    return `/${locale}/w/${workspace}`
  }
  return {
    Link,
    useRootPath,
  }
}
export const { Link, useRootPath } = createNavigation()
