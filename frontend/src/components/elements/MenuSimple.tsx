import React from 'react'
import { MenuItemMeta } from '../../Interfaces'
import { Menu, MenuItem, ListItemIcon, ListItemText } from '@mui/material'
type Props = {
    id?:string
    menuItems:MenuItemMeta[],
    anchorEl?:null | Element | ((element: Element) => Element),
    onclose:(event:any,reason:string)=>void,
    onItemClickIndex?:(index:number)=>()=>void
}

export default function MenuSimple(props: Props) {
    //console.log(props)
  return (
        <Menu id={props.id??'menu'}
        anchorEl={props.anchorEl} open={props.anchorEl?true:false} onClose={props.onclose}
        PaperProps={{
            style:{
                maxHeight:400
            }
        }}
        >
        {props.menuItems?.map((item,index)=>{
            //console.log(item)
            return <MenuItem key={item.title} onClick={item.onItemClick??(props.onItemClickIndex?
                props.onItemClickIndex(index):undefined)}>
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText>{item.title}</ListItemText>
            </MenuItem>
            })}
        </Menu> 
  )
}