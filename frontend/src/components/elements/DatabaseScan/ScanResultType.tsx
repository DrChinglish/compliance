import { Alert, AlertTitle } from '@mui/material'
import React from 'react'

type Props = {
    severity:string,
    data:any
}

const severityLocalization={
    high:"高风险",
    middle:"中风险",
    low:'低风险'
}


const tdata={
    "姓名": {
        "content_list": [
            [
                "贺泉贵",
                [
                    1,
                    2
                ]
            ],
            [
                "张飞",
                [
                    8,
                    2
                ]
            ],
            [
                "孙悟空",
                [
                    2,
                    2
                ]
            ],
            [
                "张飞",
                [
                    7,
                    2
                ]
            ],
            [
                "姚冰峰",
                [
                    3,
                    2
                ]
            ],
            [
                "刘宁",
                [
                    6,
                    2
                ]
            ],
            [
                "薛峰",
                [
                    5,
                    2
                ]
            ],
            [
                "张飞",
                [
                    4,
                    2
                ]
            ]
        ],
        "law_list": [
            {
                "id": 17,
                "law_article": "《个人信息保护法》",
                "serial_number": "第五十一条",
                "law_term": "个人信息处理者应当根据个人信息的处理目的、处理方式、个人信息的种类以及对个人权益的影响、可能存在的安全风险等，采取下列措施确保个人信息处理活动符合法律、行政法规的规定，并防止未经授权的访问以及个人信息泄露、篡改、丢失：\n（三）采取相应的加密、去标识化等安全技术措施；",
                "primary_classification": "",
                "secondary_classification": "high"
            },
            {
                "id": 20,
                "law_article": "《数据安全法》",
                "serial_number": "第二十九条",
                "law_term": "开展数据处理活动应当加强风险监测，发现数据安全缺陷、漏洞等风险时，应当立即采取补救措施；发生数据安全事件时，应当立即采取处置措施，按照规定及时告知用户并向有关主管部门报告。",
                "primary_classification": "",
                "secondary_classification": "high"
            },
            {
                "id": 21,
                "law_article": "《网络安全法》",
                "serial_number": "第二十一条",
                "law_term": "国家实行网络安全等级保护制度。网络运营者应当按照网络安全等级保护制度的要求，履行下列安全保护义务，保障网络免受干扰、破坏或者未经授权的访问，防止网络数据泄露或者被窃取、篡改：\n（四）采取数据分类、重要数据备份和加密等措施；",
                "primary_classification": "",
                "secondary_classification": "high"
            },
            {
                "id": 25,
                "law_article": "《信息安全技术个人信息安全规范》",
                "serial_number": "6.2去标识化处理",
                "law_term": "收集个人信息后，个人信息控制者宜立即进行去标识化处理，并采取技术和管理方面的措施，将可用于恢复识别个人的信息与去标识化后的信息分开存储并加强访问和使用的权限管理。",
                "primary_classification": "",
                "secondary_classification": "high"
            },
            {
                "id": 28,
                "law_article": "《互联网个人信息安全保护指南》",
                "serial_number": "6.2保存",
                "law_term": "个人信息的保存行为应满足以下要求：\nb) 收集到的个人信息应采取相应的安全加密存储等安全措施进行处理；",
                "primary_classification": "",
                "secondary_classification": "high"
            }
        ]
    }
}

export default function ScanResultType({severity,data}: Props) {

    let r_data = tdata

    const get_items = ()=>{
        let r_data = data
        let res_str:JSX.Element[] = []
        for(let key in r_data){
            res_str.push(<strong>{`发现敏感数据项类型：${key}`}</strong>)
            res_str.push(<strong>{`数据项内容及其位置:`}</strong>)
            let content =  r_data[key].content_list
            let law_list = r_data[key].law_list
            for(let item of content){
                console.log(item)
                res_str.push(<p>{`行：${item[1][0]} 列：${item[1][1]}，数据项内容：${item[0]}`}</p>)
            }
            res_str.push(<strong>{`以上敏感数据违反了下列法律：`}</strong>)
            for(let law of law_list){
                res_str.push(<p>{`${law['law_article']} ${law['serial_number']}：${law['law_term']}`}</p>)
            }
        }
        return res_str
    }
   

  return (
    <Alert severity='info'>
        <AlertTitle><strong>{severityLocalization[severity]??'未知风险项'}</strong></AlertTitle>
        {get_items()}
    </Alert>
  )
}