import React from 'react'
import { RiskData } from '../../../Interfaces/InterfaceCheckList'
import CheckListResultDataItem from './CheckListResultDataItem'

type Props = {
    data:RiskData
}

export default function CheckListResultData({data}: Props) {


    let content:JSX.Element[]=[]
    for(let key in data){
        content.push(<CheckListResultDataItem data={data[key]} category={key}/>)
    }
  return (
    <>{content}</>
    
  )
}