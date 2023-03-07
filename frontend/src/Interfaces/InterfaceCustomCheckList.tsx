import { QuestionVariant } from "../Interfaces";

export interface CustomQuestionInfo{
    index:number,
    title:string,
    variant:QuestionVariant,
    options?:string[]
}