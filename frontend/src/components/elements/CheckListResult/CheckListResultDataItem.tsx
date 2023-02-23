import React, { useMemo } from 'react'
import { CheckListResult, CheckListResultKeyLocalization, RiskDataItem } from '../../../Interfaces/InterfaceCheckList'
import { Alert, AlertTitle } from '@mui/material'

type Props = {
    data:RiskDataItem,
    category:string
}

export default function CheckListResultDataItem({data,category}: Props) {

    let content = useMemo(()=>{
        let tmp:JSX.Element[]=[]
        for(let key in data){
            let d = data[key]
            if(d.length>0)
                tmp.push(
                <p>
                    {`${CheckListResultKeyLocalization[key]??key}:`} 
                    {d.map((value,index)=>(`${index===0?' ':','}${value}`))}
                </p>
               )
        }
        return tmp
    },[data])

  return (
    (content.length>0 ?
    (<Alert severity='error'>
        <AlertTitle><strong>{CheckListResultKeyLocalization[category]??category}</strong></AlertTitle>
        {content}
    </Alert>
    ):<></>)
    
  )
}