import { Component } from 'react'
import { RebateAppPageProps, RebateAppContext, RequestApiResponse } from '../src/intefaces'
import modal from '../src/utils/modal'
import withAuth from '../src/utils/withAuth'
import EditUser from '../src/modules/EditUser'
import { userProfileApi } from '../src/api/UserProfileApi'
import Breadcrumb, { BreadcrumbItem } from '../src/components/ฺฺBreadcrumb'

interface EditUserPageProps extends RebateAppPageProps {
  breadcrumb: BreadcrumbItem[]
  resUserProfile: RequestApiResponse
}

class EditUserPage extends Component<EditUserPageProps> {
  static getInitialProps = (ctx: RebateAppContext) => withAuth(ctx).then<RebateAppPageProps>(
    async (props): Promise<EditUserPageProps> => {

      const resUserProfile = await userProfileApi.getUserProfile(props.token)

      return  {
        ...props,
        resUserProfile,
        layout: 'main',
        breadcrumb: [
          { text: 'หน้าหลัก', link: { path: '/home', asPath: '/' } },
          { text: 'จัดการผู้ใช้งาน' }
        ]
      }
    }
  )

  componentDidMount() {
    if (!this.props.resUserProfile.isSuccess) {
      modal.error(this.props.resUserProfile.error.message)
    }
  }
  
  render() {
    return (
      <>
        <Breadcrumb items={this.props.breadcrumb} />
        <EditUser
          user={this.props.resUserProfile.isSuccess
            ? this.props.resUserProfile.data : []
          }
        />
      </>
    )
  }
}

export default EditUserPage