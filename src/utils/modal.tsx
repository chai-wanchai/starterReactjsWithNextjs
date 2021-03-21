import { ReactElement } from 'react'
import Swal, { SweetAlertOptions, SweetAlertResult } from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

type OpenResult = Promise<SweetAlertResult>

interface Options extends SweetAlertOptions {
  type?: string
  title?: ReactElement | SweetAlertOptions['title']
  html?: ReactElement | SweetAlertOptions['html']
  footer?: ReactElement | SweetAlertOptions['footer']
}

class Modal {
  private _modal

  constructor() {
    this._modal = withReactContent(Swal)
  }

  public close = () => this._modal.close()

  public open = (options: Options): OpenResult => this._modal.fire(options)

  public fetching = (options?: Options): OpenResult => new Promise(resolve => {
    this._modal.fire({
      title: <p>กำลังค้นหาข้อมูล!</p>,
      html: <div>กรุณารอสักครู่</div>,
      allowOutsideClick: false,
      onBeforeOpen: this._modal.showLoading,
      ...options
    })
    setTimeout(resolve, 1000)
  })

  public error = (msgError?: string, onClose?: Function): OpenResult => this._modal.fire({
    type: 'error',
    title: <p>ผิดพลาด!</p>,
    allowOutsideClick: false,
    confirmButtonText: 'ลองใหม่',
    text: msgError || 'กรุณาลองใหม่ในภายหลัง',
    onClose: () => {
      if (onClose) {
        onClose()
      }
    }
  })
  
  public confirm = (msg: string = 'ยืนยันการแก้ไขข้อมูล'): OpenResult => this._modal.fire({
    type: 'warning',
    title: <p>{msg}</p>,
    showCancelButton: true,
    confirmButtonText: 'ยืนยัน',
    cancelButtonText: 'ยกเลิก'
  })

  public toast = ({ timer = 2000, ...options }: Options) => this._modal.mixin({
    timer,
    toast: true,
    position: 'top-end',
    showConfirmButton: false
  }).fire(options)

  public Unauthorize = (msgError?: string): OpenResult => this._modal.fire({
    type: 'error',
    title: <p>ไม่มีสิทธิเข้าใช้ </p>,
    allowOutsideClick: false,
    confirmButtonText: 'ออกจากระบบ',
    text: msgError || 'กรุณาติดต่อ Admin Website',
  })
}

export default new Modal()