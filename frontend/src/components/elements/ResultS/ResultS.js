import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Card, CardHeader, CardContent, Stack, Button, ListSubheader  } from '@mui/material'
import SuggestionListItem from './SuggestionListItem';
import getSeriousness from './util';
import SuggestionAccordion from './SuggestionAccordion';

// icons
import BuildIcon from '@mui/icons-material/Build';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import IosShareIcon from '@mui/icons-material/IosShare';


export default class ResultS extends Component {

static getDerivedStateFromProps(props,state){
    return null
    // //get new suggestions
    // return {
    //     suggestions:props.suggestions
    // }
}

handleSelectAll=(type)=>{
    let newchecked = {...this.state.selected}
    let modified = []
    let seriousness = -1
    if(type==='high'){
        modified=newchecked.high
        seriousness=0
    }else if(type==='medium'){
        modified=newchecked.medium
        seriousness=1
    }else if(type==='low'){
        modified=newchecked.low
        seriousness=2
    }else{
        console.log('Unknown type')
    }

    let targetID=[]
    for(let sugg of this.props.suggestions){
        if(getSeriousness(sugg)===seriousness){//correct seriousness 
            targetID.push(sugg.id)
        }
    }
    if(targetID.length===modified.length){
        //disselect all
        modified.splice(0,modified.length)
    }else{
        //select all
        for(let id of targetID){
            if(modified.indexOf(id)===-1){
                modified.push(id)
            }
        }
    }
    this.setState({
        selected:newchecked
    })
}

handleCheck=(type,id)=>{
    console.log('in handle check',id)
    let index = -1
    let newchecked = {...this.state.selected}
    let modified = []
    if(type==='high'){
        modified=newchecked.high
    }else if(type==='medium'){
        modified=newchecked.medium
    }else if(type==='low'){
        modified=newchecked.low
    }else{
        console.log('Unknown type')
    }
    index=modified.indexOf(id)
    if(index===-1){//new checked
        modified.push(id)
    }else{
        modified.splice(index,1)
    }
    this.setState({
        selected:newchecked
    })
}

constructor(props){
    super(props)
    this.state={
        //selected(checked) suggestion
        selected:{
            high:[],
            medium:[],
            low:[]
        },
        suggestions:[],//all suggestions
    }
}

render() {

    let suggestionItem = {
        high:[],
        medium:[],
        low:[]
    }

    for(let sugg of this.props.suggestions){
        let target=[]
        let checked=[]
        console.log(sugg)
        switch(getSeriousness(sugg)){
            case 0:target=suggestionItem.high;checked=this.state.selected.high;break;
            case 1:target=suggestionItem.medium;checked=this.state.selected.medium;break;
            case 2:target=suggestionItem.low;checked=this.state.selected.low;break;
            default:console.log("Incorrect seriousness");
        }
        target.push(
            <SuggestionListItem suggestion={sugg} handleCheck={this.handleCheck} checked={checked} />
        )
    }

    return (
        <Card>
        <CardHeader 
          title='审计结果'
          titleTypographyProps={{variant:'h6',fontWeight:'bold'}}
          action={
            <Stack direction='row' spacing={2}>
                <Button variant='contained' startIcon={<CheckBoxIcon/>} size='small' disabled={(this.state.selected.high.length+this.state.selected.medium.length+this.state.selected.low.length)<=0}>处理选中</Button>
                <Button variant='contained' startIcon={<BuildIcon/>} size='small'>FIX ALL</Button>
                <Button variant='contained' startIcon={<IosShareIcon/>} size='small'>导出报告</Button>
            </Stack>
          }
        >

        </CardHeader>
        <CardContent>
            <SuggestionAccordion seriousness="high" selected={this.state.selected.high} title="高风险" handleSelectAll={this.handleSelectAll}>
                {suggestionItem.high}
            </SuggestionAccordion>
            <SuggestionAccordion seriousness="medium" selected={this.state.selected.medium} title="中风险" handleSelectAll={this.handleSelectAll}>
                {suggestionItem.medium}
            </SuggestionAccordion>
            <SuggestionAccordion seriousness="low" selected={this.state.selected.low} title="低风险" handleSelectAll={this.handleSelectAll}>
                {suggestionItem.low}
            </SuggestionAccordion>
        </CardContent>
    </Card>
    )
  }
}

ResultS.propTypes={
    suggestions: PropTypes.array
}