//Structured data table

import PropTypes from 'prop-types'
import React, { Component } from 'react'
import {DataGrid, GridActionsCellItem,zhCN} from '@mui/x-data-grid'
import { CssBaseline } from '@mui/material';
import { Box } from '@mui/system';
import DataGridSPagination from './DataGridSPagination';
import { DataGridSToolbar } from './DataGridSToolbar';


export default class DataGridS extends Component {
  

  render() {
    return (
      <Box sx={{height:'75vh',width:'100%'}}>
        {/* <CssBaseline/> */}
        <DataGrid columns={this.props.columns} rows={this.props.rows} 
        localeText={zhCN.components.MuiDataGrid.defaultProps.localeText}
        components={{
          Toolbar: DataGridSToolbar,
          Pagination: DataGridSPagination
        }} />
      </Box>
    )
  }
}

DataGridS.propTypes= {
    columns: PropTypes.arrayOf(PropTypes.object),
    rows: PropTypes.arrayOf(PropTypes.object)
}