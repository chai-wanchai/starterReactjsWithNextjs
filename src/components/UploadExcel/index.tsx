import { ButtonProps } from 'semantic-ui-react'
import XLSX, { WorkSheet, Sheet2JSONOpts } from 'xlsx'
import { FunctionComponent, ChangeEvent, useRef, useState } from 'react'
import Button from '../Button'

interface UploadExcelProps extends ButtonProps {
  isFileName?: boolean
  sheetToJsonOptins?: Sheet2JSONOpts
  onChange?: (data: { [name: string]: WorkSheet }) => void
}

const UploadExcel: FunctionComponent<UploadExcelProps> = ({
  onChange,
  isFileName,
  sheetToJsonOptins,
  ...props
}) => {
  const inputExcelFile = useRef(null)
  const [fileName, setFileName] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  
  const handleFileUploadChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files.length === 0) {
      return
    }
    setIsLoading(true)
    
    const reader = new FileReader()

    if (isFileName) {
      setFileName(e.target.files[0].name)
    }

    /** Not support multi file */
    reader.readAsBinaryString(e.target.files[0])

    /** Clear value after read file */
    e.target.value = null


    reader.onload = (readerEvent) => {
      
      const workbook = XLSX.read(readerEvent.target.result, { type: 'binary' })
      const result = {}
      
      workbook.SheetNames.forEach((sheetName) => {
        // Convert xml to json
        result[sheetName] = XLSX.utils.sheet_to_json(
          workbook.Sheets[sheetName],
          sheetToJsonOptins
        )
      })

      setIsLoading(false)

      if (onChange) {
        onChange(result)
      }
    }
  }

  return (
    <>
      {fileName &&
        <p style={{ textAlign: 'center' }}>
          <small>{fileName}</small>
        </p>
      }
      <Button
        {...props}
        loading={isLoading}
        onClick={() => inputExcelFile.current &&
          inputExcelFile.current.click()
        }
      />
      <input
        hidden
        type='file'
        ref={inputExcelFile}
        onChange={handleFileUploadChange}
        accept='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' // xlsx >= 2007
      />
    </>
  )
}

UploadExcel.defaultProps = {
  isFileName: false
}

export default UploadExcel