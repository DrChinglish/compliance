import styled from "@emotion/styled"
import { Box, BoxProps } from "@mui/material"

export const StyledBoxPointer = styled(Box)(({theme})=>({
    ':hover':{
        backgroundColor:'rgba(245,245,245,0.9)',
        cursor:'pointer'
    }
}))
export const StyledBoxDefault = styled(Box)(({theme})=>({
    ':hover':{
        backgroundColor:'rgba(245,245,245,0.9)'
    }
}))

type StyledBoxProps={
    variant:string
} & BoxProps

export function StyledBox({variant,...props}:StyledBoxProps){
    switch(variant){
        case 'hover-pointer':return <StyledBoxPointer {...props} />
        case 'hover':return <StyledBoxDefault  {...props}/>
        default:return <Box {...props}/>
    }
}