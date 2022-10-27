import { Box, CssBaseline, Stack } from '@mui/material'
import React, { useEffect, useRef, useState } from 'react'
import TweenOne from 'rc-tween-one'
import Children from 'rc-tween-one/lib/plugin/ChildrenPlugin';
import Titles from '../../../../../typography/Titles'
import CheckIndicatorLayout from './CheckIndicatorLayout';


TweenOne.plugins.push(Children);
export default function NumberDisplay({
    value1:value1,
    value2:value2
}) {
    let fontSize =60
    console.log(fontSize)
    const textRef = useRef()
    const [animation, setAnimation] = useState(null)
    useEffect(()=>{
        console.log(textRef.current?.scrollWidth,textRef.current?.offsetWidth)
        setAnimation({
            Children:{
                value:value1,floatLength:0,formatMoney:false
            },
            duration:200,
            onUpdate:()=>{console.log(textRef.current?.scrollWidth,textRef.current?.offsetWidth)}
        })
    },[])
  return (
    <CheckIndicatorLayout label='问题文件'>
        <TweenOne animation={animation} ref={textRef}
            style={{fontSize:fontSize,lineHeight:'60px', maxWidth:'100%', textAlign:'center'}} component={'span'} >
                0
            </TweenOne>
    </CheckIndicatorLayout>
  )
}
