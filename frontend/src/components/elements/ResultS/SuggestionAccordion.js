import React, { Component } from 'react'
import { Accordion, AccordionSummary, AccordionDetails, Typography, List, ListSubheader, Stack, Button, Chip, Checkbox, FormControlLabel } from '@mui/material'
import PropTypes from 'prop-types'
import { ExpandMore, MoreVert } from '@mui/icons-material';
import IosShareIcon from '@mui/icons-material/IosShare';

const MAX_SUGGESTION_COUNT=99

export default class SuggestionAccordion extends Component {
  render() {
    let bgColor='white'
    let chipColor='default'
    let suggestions = this.props.children
    let selected = this.props.selected
    switch(this.props.seriousness?.toLowerCase()){
        //预设的颜色映射，需要的话可以在此处添加
        case 'medium': bgColor='orange'; chipColor='warning';break;
        case 'high': bgColor='red'; chipColor='error';break;
        case 'low': bgColor='lightblue'; chipColor='info';break;
        default:bgColor='white';chipColor='default';
    }

    return (
        <Accordion disableGutters>
        <AccordionSummary sx={{backgroundColor:bgColor}} expandIcon={<ExpandMore color='inherit'/>}>
            <Typography color='white' fontWeight='bold'>
                {this.props.title}
            </Typography>
            <Chip label={suggestions.length>MAX_SUGGESTION_COUNT?'99+':suggestions.length} size='small' color={chipColor} sx={{ml: 1}}/>
        </AccordionSummary>
        <AccordionDetails>
            <List
            subheader={
                <ListSubheader id={"subheader"+this.props.seriousness} component='div' disableGutters color='default'>
                    <Stack spacing={2} direction="row" alignItems="center" justifyContent="space-between">
                        <Typography color="black" fontWeight="bold"  component='div' sx={{height:'48px',lineHeight:'48px'}}>
                            {
                                "共发现了"+suggestions.length+"项问题"+((selected.length>0?("，已选中"+selected.length+"项。"):("。")))
                            }
                        </Typography>
                        <FormControlLabel
                        sx={{pr:'3px'}}
                        control={
                        <Checkbox
                        // edge='end'
                        onChange={(e)=>this.props.handleSelectAll(this.props.seriousness)}
                        checked={selected.length===suggestions.length&&suggestions.length>0}
                        indeterminate={selected.length<suggestions.length&&selected.length>0}
                        disabled={suggestions.length<=0}
                        />
                        }
                        label='选择所有'
                        labelPlacement='start'
                        />
                        {/* <Button variant='contained' startIcon={<IosShareIcon/>} size='small' sx={{height:1}}>导出报告</Button> */}
                    </Stack>
                </ListSubheader>
            }
            >
                {this.props.children}
                {/* {suggestionItem.medium} */}
            </List>
        </AccordionDetails>
    </Accordion>
    )
  }
}

SuggestionAccordion.propTypes={
    title: PropTypes.string,//折叠面板标题
    selected: PropTypes.array,//用于记录选中的suggestion
    seriousness: PropTypes.string,//问题严重程度（影响折叠标题和数量chip的颜色）
    handleSelectAll:PropTypes.func.isRequired//处理全选按钮
}

SuggestionAccordion.defaultProps={
    color:"medium",
    title: "Title"
}