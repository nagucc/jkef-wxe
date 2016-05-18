import React, { PropTypes } from 'react'
import {formatMoney, formatNumber} from 'accounting';

import {CellsTitle, Progress} from 'react-weui';

class StatByProject extends React.Component {
  static propTypes = {
    stat: React.PropTypes.array
  };
  static defaultProps = {
    stat: []
  };
  render () {
    let {stat, totalAmount} = this.props;
    console.log(stat)
    return (
      <div className="progress">
        <div className="hd">
          <h1 className="page_title">按项目统计</h1>
        </div>
        <div className="bd spacing">
          {
            stat.map((item, i) => {
              console.log('##', item.value.amount)
              if(item.value) return (
                <div key={i}>
                  <CellsTitle>
                    <a href="#">
                      {item._id}
                    </a>
                  </CellsTitle>
                  <CellsTitle>
                    {formatMoney(item.value.amount, '¥')}元 | {formatNumber(item.value.count)}人次
                  </CellsTitle>
                  <Progress value={(item.value.amount/totalAmount)*100} />

                </div>
              )
              else return null;
            })
          }
        </div>
      </div>
    )
  }
}

export default StatByProject;
