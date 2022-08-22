import React, { Component } from 'react'
import * as echarts from 'echarts/core'
import { TitleComponent, LegendComponent,TooltipComponent } from 'echarts/components';
import {CanvasRenderer} from 'echarts/renderers'
import {RadarChart} from 'echarts/charts'
import ReactEChartCore from 'echarts-for-react/lib/core'



const option = {
    title: {
      text: '合规性分数'
    },
    tooltip: {
      trigger: 'item'
    },
    legend: {
      data: ['企业A数据','平均水平'],
      top: '5%'
    },
    radar: {
      // shape: 'circle',
      indicator: [
        { name: '合规性', max: 100 },
        { name: '可用性', max: 100 },
        { name: '隐私性', max: 100 },
        { name: '完整性', max: 100 },
        { name: '规范性', max: 100 }
        
      ],
      center:['50%','60%']
    },
    series: [
      {
        name: '数据合规分数',
        type: 'radar',
        data: [
            // replace this with actual score
          {
            value: [98, 95, 90, 85, 70],
            name: '平均水平'
          },
          {
            value: [100, 67, 58, 31, 85],
            name: '企业A数据'
          }
        ]
      }
    ]
}

echarts.use(
    [TitleComponent,LegendComponent,RadarChart,CanvasRenderer,TooltipComponent]
)
export default class ScoreRadarChart extends Component {
    
  render() {
    return (
      <div style={{width:'100%'}}>
        <ReactEChartCore 
        //opts={{width:'505'}}
        //style={{width:'100%'}}
        echarts={echarts}
        option={option}
        />
      </div>
        
    )
  }
}
