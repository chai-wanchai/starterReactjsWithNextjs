import { FunctionComponent } from 'react'
import MainLayout from './MainLayout'

export type LayoutType = 'main' | 'none'

interface LayoutProps {
  type?: LayoutType
}

const Layout: FunctionComponent<LayoutProps> = ({
  type,
  ...props
}) => {
  switch (type) {
    case 'main':
      return <MainLayout {...props} />
    case 'none':
    default:
      return <>{props.children}</>
  }
}

export default Layout