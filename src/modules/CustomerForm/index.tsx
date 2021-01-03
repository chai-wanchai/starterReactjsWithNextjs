import { FunctionComponent } from "react"
import { Form } from "semantic-ui-react"
interface Props{

}
const CustomerForm: FunctionComponent<Props> = () => {

  return (
    <>
     <Form>
       <Form.Input label="Name"></Form.Input>
       <Form.Input label="Email"></Form.Input>
       <Form.Input label="PhoneNo"></Form.Input>
       <Form.Input label="Line ID"></Form.Input>
     </Form>
    </>
  )
}

export default CustomerForm