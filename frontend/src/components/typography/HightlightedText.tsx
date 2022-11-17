import React from 'react'
import { TextItemCensored } from '../../Interfaces'
import { getTextColorFromFlag } from '../../utils/util'

type Props = {
    textlist:TextItemCensored[]
}

export default function HightlightedText(props: Props) {
    let lastcolor='black'
    let tmpstr=''
    let texts:React.ReactNode[]=[]
    for(let i in props.textlist){
        let color = getTextColorFromFlag(props.textlist[i].flag)
        if(color==='black'){
            tmpstr+=props.textlist[i].text
        }else {
            
            if(lastcolor==='black'){
                //legal -> illegal
                if(tmpstr.length>0){
                    texts.push(<span color={lastcolor}>{tmpstr}</span>)
                }
                tmpstr=''
            }
            texts.push(<span style={{background:color, borderRadius:'3px', color:'white'}}>
                {props.textlist[i].text}
                </span>)
        }
        lastcolor=color
    }
    if(tmpstr.length>0)
        texts.push(<span color={lastcolor}>{tmpstr}</span>)
  return (
    <>
        {texts}
    </>
  )
}