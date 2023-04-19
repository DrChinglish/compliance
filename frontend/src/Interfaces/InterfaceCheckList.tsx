

export interface CheckListResult{ 
    riskData:{
      identity:{
        [key in IdentityType]:string[]
      },
      bioInfo:{
        [key in BioInfoType]:any[]
      },
      financialInfo:{
        [key in FinancialInfoType]:any[]
      },
      healthCare:{
        [key in HealthCareInfoType]:any[]
      },
      track:{
        [key in TrackInfoType]:any[]
      },
      juveniles:{
        [key in JuvenilesInfoType]:any[]
      },
      authInfo:{
        [key in AuthInfoType]:any[]
      },
      other:{
        [key in OtherInfoType]:any[]
      }
    },
    scores:CheckListResultScore,
    suggestion:string[],
    law:string[]
  
  }
  
  export function loadResultFromResponse(res:any){
    let riskData = res.risk_data

    let result:CheckListResult={
        suggestion:res.suggestion,
        law:res.law,
        scores:res.scores,
        riskData:{
            identity:riskData.specified_identity,
            bioInfo:riskData.bioinformation,
            financialInfo:riskData.financial_account,
            healthCare:riskData.healthcare,
            track:riskData.track,
            juveniles:riskData.juveniles_information,
            authInfo:riskData.authentication_information,
            other:riskData.other
        }
    }
    return result 
  }

  export interface CheckListResultScore{
      privacy_protection_score: number,
      data_security_score: number,
      process_specification_score:number,
      data_privacy_score: number
 
  }

  export type RiskData = {
    [key in RiskDataCategory]:RiskDataItem
  }

  export type RiskDataCategory = 'identity'|'bioInfo'|'financialInfo'|'healthCare'|'track'|'juveniles'|'authInfo'|
  'other'

  export type RiskDataTypes = OtherInfoType|AuthInfoType|JuvenilesInfoType|TrackInfoType|HealthCareInfoType
  |FinancialInfoType|BioInfoType|IdentityType

  export type RiskDataItem = {
    [key in RiskDataTypes]: any[]
  } 

  export type OtherInfoType = 'sex'|'nation'
  
  export type AuthInfoType = 'password'|'auth_code'
  
  export type JuvenilesInfoType = 'juveniles' 
  
  export type TrackInfoType = 'Latitude_longitude'|'position'
  
  export type HealthCareInfoType = 'birth_information'|'hospital_records'
  
  export type FinancialInfoType = 'debit'|'fund_account'|'Alipay_account'
  
  export type BioInfoType = 'face'|'fingerprint'|'iris'|'eye_pattern'
  
  export type IdentityType = 'passport'|'IDNumber'|'officer'|'HM_pass'|'carnum'

  export const CheckListResultKeyLocalization={
    identity:'个人身份信息',
    bioInfo:'生物信息',
    financialInfo:'金融信息',
    healthCare:'健康信息',
    track:'物理位置信息',
    juveniles:'未成年人信息',
    authInfo:'权限认证信息',
    other:'其他信息',
    sex:'性别',
    nation:'国籍',
    password:'密码',
    auth_code:'认证码',
    Latitude_longitude:'经纬度坐标',
    position:'位置信息',
    birth_information:'出生信息',
    hospital_records:'病历记录',
    debit:'借记卡',
    fund_account:'基金账户',
    Alipay_account:'支付宝账户',
    face:'面部信息',
    fingerprint:'指纹',
    iris:'虹膜',
    Eye_pattern:'眼部特征',
    passport:'护照',
    IDNumber:'身份证号码',
    officer:'警号',
    HM_pass:'港澳通行证',
    carnum:'车牌号',
    scores:{
      privacy_protection_score:'个人隐私保护',
      data_security_score: '数据安全',
      process_specification_score:'处理规范',
      data_privacy_score: '数据隐私'

    }
  }
  