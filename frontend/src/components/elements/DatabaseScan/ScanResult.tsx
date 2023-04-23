import { Accordion, AccordionSummary, AccordionDetails,Typography } from '@mui/material'
import React from 'react'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ScanResultTable from './ScanResultTable';
import Titles from '../../typography/Titles';
type Props = {
    database_data:any,
    database_name:string
}

export default function ScanResult({database_data,database_name}: Props) {


    const get_items =()=>{
        let ret:JSX.Element[]=[]
        for(let key in database_data){
            ret.push(<ScanResultTable table_name={key} table_data={database_data[key]}></ScanResultTable>)
        }
        return ret
    }

  return (
    <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls={`${database_name}-content`}
          id={`${database_name}-head`}
        >
          <Titles>{`${database_name}中的检测结果`}</Titles>
        </AccordionSummary>
        <AccordionDetails>
            {
               get_items()
            }
        </AccordionDetails>
      </Accordion>
  )
}