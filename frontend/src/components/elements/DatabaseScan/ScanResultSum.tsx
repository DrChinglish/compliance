import { Alert, AlertTitle } from '@mui/material'
import React from 'react'

type Props = {
    data:any
}

const t_data = {
    "high": {
        "姓名": 8,
        "身份证号": 8,
        "手机号": 5,
        "护照号": 1
    },
    "middle": {
        "年龄": 1
    },
    "low": {}
}

export default function ScanResultSum({data}: Props) {

    const get_items = ()=>{
        let r_data = data
        let ret:JSX.Element[]=[]
        let {high,middle,low} = r_data
        let h=0
        ret.push(<strong>{`高风险数据：`}</strong>)
        for(let key in high){
            ret.push(<p>{`发现了${high[key]}处${key}信息`}</p>)
            h+=high[key]
        }
        if(h===0){
            ret.push(<p>无</p>)
        }
        let m=0
        ret.push(<strong>{`中风险数据：`}</strong>)
        for(let key in middle){
            ret.push(<p>{`发现了${middle[key]}处${key}信息`}</p>)
            m+=middle[key]
        }
        if(m===0){
            ret.push(<p>无</p>)
        }
        let l=0
        ret.push(<strong>{`低风险数据：`}</strong>)
        for(let key in low){
            ret.push(<p>{`发现了${low[key]}处${key}信息`}</p>)
            l+=low[key]
        }
        if(l===0){
            ret.push(<p>无</p>)
        }
        // ret.push(<br/>)
        ret.push(<strong>{`总计发现${h}处高风险信息，${m}处中风险信息${l}和处低风险信息：`}</strong>)
        return ret
    }
  return (
    <Alert severity='info'>
        <AlertTitle><strong>检测摘要</strong></AlertTitle>
        {get_items()}
    </Alert>
  )
}