import { FunctionComponent, FormEvent } from 'react'
import { Grid, Header, Segment, Button } from 'semantic-ui-react'
import Field from '../../components/Field'

// End styled-component ---------------------------

interface FormSearchCustomerProps {
  customerId: string
  errorCustomerId: string
  onFormClear: () => void
  onFormChange: (data: string) => void
  onSubmit: (e: FormEvent<HTMLFormElement>) => void
}

// End typescript defined -------------------------

const FormSearchCustomer: FunctionComponent<FormSearchCustomerProps> = ({
  onSubmit,
  customerId,
  onFormClear,
  onFormChange,
  errorCustomerId
}) => {
  return (
    <form onSubmit={onSubmit}>
      <Segment.Group raised>
        <Segment inverted color='blue'>
          <Header as='h3'>
            <Header.Content>ค้นหาลูกค้า</Header.Content>
          </Header>
        </Segment>
        <Segment>
          <Grid>
            <Grid.Column computer={6}>
              <Field
                value={customerId}
                errorText={errorCustomerId}
                onChange={(e, data) => onFormChange(data.value)}
                action={
                  <Button
                    color='blue'
                    icon='search'
                    content='ค้นหา'
                  />
                }
                placeholder='รหัสลูกค้า'
              />
            </Grid.Column>
            <Grid.Column computer={6}>
              <Button
                type='button'
                content='เริ่มงานใหม่'
                onClick={onFormClear}
              />
            </Grid.Column>
          </Grid>
        </Segment>
      </Segment.Group>
    </form>
  )
}

export default FormSearchCustomer