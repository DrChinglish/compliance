import React, { useState } from 'react'
import { StyledBox } from './StyledComponent/StyledContainers'
import { Box, Button, Stack } from '@mui/material'
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import EditIcon from '@mui/icons-material/Edit';
import { QuestionVariant } from '../../../Interfaces';
import { CustomQuestionInfo } from '../../../Interfaces/InterfaceCustomCheckList';
import EditableQuestion from './EditableQuestion';

type Props = {
    question:CustomQuestionInfo
}

type ToolBoxProps = {
    show:boolean
}

function ToolBox({show}:ToolBoxProps){
    return (
        <Stack spacing={1} p={1}  justifyContent='center' display={show?'flex':'none'}>
            <Button variant='outlined'><ArrowUpwardIcon/></Button>
            <Button variant='outlined'><EditIcon/></Button>
            <Button variant='outlined'><ArrowDownwardIcon/></Button>
        </Stack>
    )
}



export default function EditQuestionLayout({question}: Props) {

    const [hover,setHover] = useState(false)

    const handleHover = (enter:boolean)=>()=>{
        setHover(enter)
    }

  return (
   <StyledBox variant='hover' onMouseEnter={handleHover(true)} onMouseLeave={handleHover(false)} minHeight='200px'
    display='flex' p={1}>
        <Stack direction={'row'} flexGrow={1}>
            <Box flexGrow={1}>
                <EditableQuestion value={question}/>
            </Box>
            <ToolBox show={hover}/>
        </Stack>
   </StyledBox>
  )
}