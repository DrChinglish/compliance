import React from 'react'
import { useGridApiContext, useGridSelector, gridPageCountSelector, gridPageSelector, } from '@mui/x-data-grid'
import { Pagination } from '@mui/material';
import './DataGridPagination.scss'
export default function DataGridPagination() {
    const apiRef = useGridApiContext();
    const page = useGridSelector(apiRef, gridPageSelector);
    const pageCount = useGridSelector(apiRef, gridPageCountSelector);
  
    return (
      <Pagination
        color="primary"
        count={pageCount}
        page={page + 1}
        onChange={(event, value) => apiRef.current.setPage(value - 1)}
        style={{marginBottom:0}}
      />
    );
}
