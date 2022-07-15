//Structured data table

import PropTypes from 'prop-types'
import React, { Component } from 'react'
import {DataGrid, GridActionsCellItem, GridToolbar} from '@mui/x-data-grid'

import { Box } from '@mui/system';


export default class DataGridS extends Component {
  

  render() {
    return (
      <Box sx={{height:'75vh',width:'75%'}}>
        <DataGrid columns={this.props.columns} rows={this.props.rows} components={{
          Toolbar: GridToolbar
        }} />
      </Box>
    )
  }
}

DataGridS.propTypes= {
    columns: PropTypes.arrayOf(PropTypes.object),
    rows: PropTypes.arrayOf(PropTypes.object)
}