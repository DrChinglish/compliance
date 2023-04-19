import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'
// import { SxProps } from '@mui/material';
import TweenOne from 'rc-tween-one'
import Children from 'rc-tween-one/lib/plugin/ChildrenPlugin';
import { Box } from '@mui/material';
import CheckIndicatorLayout from './CheckIndicatorLayout';


interface NumberDisplayProps{
    value1:number,
    value2?:number,
    color1?:string,
    color2?:string,
    title:string
}

const breakPointV1=[
    {
       fontSize:'60px'//0-9
    },
    {
        fontSize:'40px'//10-99
    },
    {
        fontSize:'26px'//100-999
    },
    {
        fontSize:'20px'//999+
    }
]

const breakPointV2=[
    {
        right:10,
        fontSize:'30px'
    },
    {
        right:5,
        fontSize:'20px'
    },
    {
        right:5,
        fontSize:'15px'
    },
    {
        right:10,
        fontSize:'12px'
    },

]

TweenOne.plugins.push(Children);
export default function NumberDisplay(props:NumberDisplayProps) {
    let fontSize = 60
    console.log(fontSize)
    const [displayValue,setDisplayValue] = useState('0')
    const textRef = useRef<any>(null)
    const textRef2 = useRef<any>(null)
    let bp2 = (props.value2?.toString().length??1) - 1
    console.log(bp2,'hello')
    let layoutProps = props.value2?{}:{
        display:'flex',
        justifyContent:'center'
    }
    //console.log(layoutProps)
    const [animation, setAnimation] = useState({})
    useLayoutEffect(()=>{
        let bp1 = props.value1.toString().length - 1  
        if(bp1<0)
            bp1 = 0
        //console.log(textRef.current!.style)
        textRef.current!.style.fontSize = breakPointV1[bp1].fontSize
        setAnimation({
            Children:{
                value:props.value1<=999?props.value1:999,floatLength:0,formatMoney:false
            },
            duration:1000,
            onComplete:()=>{
                if (props.value1.toString().length === breakPointV2.length) 
                    setDisplayValue(props.value2+'+')
            }
        })
    },[props.value1,props.value2,bp2])
  return (
    <CheckIndicatorLayout label={props.title}>
        <Box width='100%' position='relative' {...layoutProps}>
            <TweenOne animation={animation} ref={textRef}
                style={{color:props.color1, fontSize:fontSize, lineHeight:'60px', maxWidth:props.value2?'75%':'100%', textAlign:'center'}} component={'span'} >
                    {displayValue}
            </TweenOne>
            {props.value2&&<span style={{color:props.color2,width:'25%',bottom:0, position:'absolute',...breakPointV2[bp2]}} ref={textRef2}>
                {'/'+props.value2+(bp2===breakPointV2.length-1?'+':'')}
            </span>}
        </Box>
    </CheckIndicatorLayout>
  )
}
