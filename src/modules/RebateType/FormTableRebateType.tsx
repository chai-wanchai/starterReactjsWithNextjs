import styled from 'styled-components'
import { connect } from 'react-redux'
import { FunctionComponent, FormEvent, useState, useEffect } from 'react'
import {
  Menu,
  Table,
  Segment,
  Checkbox,
  CheckboxProps,
  Button as ButtonSemantic
} from 'semantic-ui-react'
import { RootState } from '../../stores'
import { RebateData } from './index'

const ButtonSave = styled(ButtonSemantic)`
  & {
    width: 120px;
    margin-right: 5px !important;
  }
`

const ButtonDelete = styled(ButtonSemantic)`
  & {
    width: 120px;
    margin-right: 0 !important;
    margin-left: 5px !important;
  }
`

const Wrapper = styled(Segment)`
  overflow: auto;
  padding: 0 !important;
  .ui.table {
    border: 0;
    border-bottom: 1px solid rgba(34,36,38,.15);
    
    thead th {
      font-weight: 300;
      color: #FFFFFF;
      background-color: #2085D0;
    }

  }
`
// End styled-component ------------------------------

interface MasterItem {
  id: number
  name: string
}

interface FormTableRebateTypeProps {
  rebate: RebateData[]
  selected: RebateData
  onFormCheck: (val: any) => void
  onFormDelete: () => Promise<any>
  master: {
    company: MasterItem[]
  }
}

// End typescript defined ----------------------------

const sortRebateType = (a: RebateData, b: RebateData) => {
  const nameA = a.rebate_type.toUpperCase()
  const nameB = b.rebate_type.toUpperCase()

  if (nameA < nameB) {
    return -1
  }

  if (nameA > nameB) {
    return 1
  }

  return 0 // names must be equal

}

const FormTableRebateType: FunctionComponent<FormTableRebateTypeProps> = ({
  rebate,
  master,
  selected,
  onFormCheck,
  onFormDelete
}) => {
  const [viewTab, setViewTab] = useState(1)

  const handleSelect = (e: FormEvent<HTMLInputElement>, data: CheckboxProps) => {
    e.preventDefault()
    onFormCheck(data.name)
  }

  useEffect(() => {
    setViewTab(1)
  }, [rebate])

  return (
    <div>
      <Menu pointing secondary color='blue'>
        <Menu.Item
          link
          name='Rebate type แก้ไขได้'
          active={viewTab === 1}
          onClick={() => setViewTab(1)}
        />
        <Menu.Item
          link
          name='Rebate type ทั้งหมด'
          active={viewTab === 2}
          onClick={() => setViewTab(2)}
        />
      </Menu>
      {viewTab === 1 &&
        <Segment.Group raised>
          <Wrapper>
            <Table celled textAlign='center'>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell>เลือก</Table.HeaderCell>
                  <Table.HeaderCell>Rebate Type</Table.HeaderCell>
                  <Table.HeaderCell>Comp. Response</Table.HeaderCell>
                  <Table.HeaderCell>Rebate Description THAI</Table.HeaderCell>
                  <Table.HeaderCell>Rebate Description ENG</Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {
                  rebate.filter(item => item.rebate_owner).sort(sortRebateType).map(item => {
                    const company = master.company.find(company => company.id === item.comp_resp)
                    return (
                      <Table.Row
                        textAlign='left'
                        key={item.rebate_type}
                        warning={selected.rebate_type === item.rebate_type}
                        disabled={selected.rebate_type
                          ? selected.rebate_type !== item.rebate_type : false
                        }
                      >
                        <Table.Cell textAlign='center'>
                          <Checkbox
                            name={item.rebate_type}
                            onChange={handleSelect}
                            checked={selected.rebate_type === item.rebate_type}
                          />
                        </Table.Cell>
                        <Table.Cell>{item.rebate_type}</Table.Cell>
                        <Table.Cell>{company ? `${company.id} - ${company.name}` : '-'}</Table.Cell>
                        <Table.Cell>{item.rebate_desc_th}</Table.Cell>
                        <Table.Cell>{item.rebate_desc_en}</Table.Cell>
                      </Table.Row>
                    )
                  })
                }
              </Table.Body>
            </Table>
          </Wrapper>
          <Segment textAlign='right'>
            <ButtonDelete
              color='red'
              content='ลบ'
              icon='trash'
              type='button'
              onClick={onFormDelete}
              disabled={!selected.rebate_type}
            />
          </Segment>
        </Segment.Group>
      }
      {viewTab === 2 &&
        <Segment.Group raised>
          <Wrapper>
            <Table celled textAlign='center'>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell>Rebate Type</Table.HeaderCell>
                  <Table.HeaderCell>Comp. Response</Table.HeaderCell>
                  <Table.HeaderCell>Rebate Description THAI</Table.HeaderCell>
                  <Table.HeaderCell>Rebate Description ENG</Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {
                  rebate.sort(sortRebateType).map(item => {
                    const company = master.company.find(company => company.id === item.comp_resp)
                    return (
                      <Table.Row key={item.rebate_type} textAlign='left'>
                        <Table.Cell>{item.rebate_type}</Table.Cell>
                        <Table.Cell>{company ? `${company.id} - ${company.name}` : '-'}</Table.Cell>
                        <Table.Cell>{item.rebate_desc_th}</Table.Cell>
                        <Table.Cell>{item.rebate_desc_en}</Table.Cell>
                      </Table.Row>
                    )
                  })
                }
              </Table.Body>
            </Table>
          </Wrapper>
        </Segment.Group>
      }
    </div>
  )

}

const mapStateToProps = ({ master }: RootState) => ({
  master: {
    company: master.raw.company
  }
})

export default connect(mapStateToProps, null)(FormTableRebateType)