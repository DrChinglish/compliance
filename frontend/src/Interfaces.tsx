export interface FileMeta{
    content: object,
    ext: string,
    id: number,
    name: string,
    size:string,
    type:'text'|'image'|'audio'|'video'|'other'| undefined,
    url:string
  }

  export interface SnackbarStatus{
    show:boolean,
    text:string,
    severity:'success'|'warning'|'error'
}

export interface VideoFrameMeta{
  src:string,
  timestamp:string|number,
  label:string,
}