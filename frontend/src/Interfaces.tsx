import { NavigateFunction, Params } from "react-router-dom"

export interface FileMeta extends FileInfoBasic{
    content: object,
    ext: string,
    name: string,
    size:string,
    type:'text'|'image'|'audio'|'video'|'other'| undefined
  }

export interface FileInfoBasic{
  id: number,
  url:string,
  status:FileProcessStatus|VideoFileStatus
}

export interface FormState{
  error:boolean,
  helperText:string,
  values:any,
  touched:boolean,
}

export interface SnackbarStatus{
    show:boolean,
    text:string|Error,
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

export interface ICheckListQuestion{
  question:string,
  law_article:string,
  id:number
}

export interface ICheckListQuestionTF extends ICheckListQuestion{

} 

export interface WithRouterProps{
  navigate:NavigateFunction,
  location:Location,
  params:Readonly<Params<string>>
}


export type TFAnswer = boolean

export interface QuestionError{
  id:number,
  helperText:string
}

export interface CheckListStep{
  label:string,
  content?:JSX.Element|Function
}

export interface QuestionAnswer {
    id:number,
    value:TFAnswer
} 



export type ChecklistAnswer = QuestionAnswer[]

export type LoadingStatus = 'initial'|'loading'|'error'|'success'|string

export type FileProcessStatus = 'uploaded'|'processing'|'error'|'done'

export type VideoFileStatus = FileProcessStatus | 'ready'

export type QuestionVariant = 'TF'|'Single'|'Multiple'|'Value'