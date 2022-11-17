export interface FileMeta extends FileInfoBasic{
    content: object,
    ext: string,
    name: string,
    size:string,
    type:'text'|'image'|'audio'|'video'|'other'| undefined
  }

export interface FileInfoBasic{
  id: number,
  url:string
}

export interface SnackbarStatus{
    show:boolean,
    text:string,
    severity:'success'|'warning'|'error'
}

export interface VideoFrameMeta{
  id:number,
  src:string,
  timestamp:string|number,
  description:string,
}

export interface TextItemCensored{
  flag:number,
  text:string
}

export interface MenuItemMeta{
  title:string,
  icon?:React.ReactNode,
  onItemClick?:()=>void
}

export interface ClassifiedFileList{
  [key:string]:FileMeta[]
}