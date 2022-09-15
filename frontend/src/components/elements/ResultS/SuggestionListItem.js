import { Avatar, ListItemAvatar, ListItemText, ListItem, Checkbox, FormControlLabel } from '@mui/material'
import PropTypes from 'prop-types'
import React, { Component } from 'react'

export default class SuggestionListItem extends Component {
  

  render() {
    let suggestion=this.props.suggestion
    return (
        <ListItem
        
        disableGutters
        key={suggestion?.id}
        secondaryAction={
          <FormControlLabel
          control={
            <Checkbox

            edge='end'
            onChange={(e)=>this.props.handleCheck(suggestion.seriousness,suggestion.id)}
            checked={this.props.checked.indexOf(suggestion?.id) !== -1}
          />
          }
          
          />
          
        }
      > 
        <ListItemAvatar>
            <Avatar>#{suggestion?.id??'E'}</Avatar>
        </ListItemAvatar>
        <ListItemText
        primary={suggestion?.title??"Suggestion"}
        secondary={
            suggestion?.description??"Description"
        }
        >

        </ListItemText>
      </ListItem>
    )
  }
}

SuggestionListItem.propTypes={
    suggestion:PropTypes.object,
    handleCheck: PropTypes.func,
    checked: PropTypes.array
}