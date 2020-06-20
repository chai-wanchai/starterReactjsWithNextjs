import styled from 'styled-components'
import { useRouter } from 'next/router'
import { FunctionComponent, Fragment } from 'react'
import { Breadcrumb as BreadcrumbSemantic } from 'semantic-ui-react'

const Wrapper = styled('div')`
  margin: 0 0 20px;
  .ui.breadcrumb {
    font-family: 'K2D', sans-serif;
  }
`

// End styled-component ---------------------------

export interface BreadcrumbItem {
  link?: {
    path: string
    asPath: string
  }
  text: string
}

interface BreadcrumbProps {
  items: BreadcrumbItem[]
}

// End typescript defined -------------------------

const Breadcrumb: FunctionComponent<BreadcrumbProps> = ({
  items
}) => {
  const router = useRouter()

  return (
    <Wrapper>
      <BreadcrumbSemantic>
        {
          items.map(({ link, text }, index) => (
            <Fragment key={index}>
              <BreadcrumbSemantic.Section
                content={text}
                link={link ? true : false}
                onClick={link ? () => router.push(link.path, link.asPath) : undefined}
              />
              {index !== items.length - 1 && <BreadcrumbSemantic.Divider icon='right angle' />}
            </Fragment>
          ))
        }
      </BreadcrumbSemantic>
    </Wrapper>
  )
}

Breadcrumb.defaultProps = {
  items: []
}

export default Breadcrumb