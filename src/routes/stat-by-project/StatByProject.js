import React, { PropTypes } from 'react'
import {formatMoney, formatNumber} from 'accounting';

import {CellsTitle, Progress, MediaBoxDescription, MediaBox} from 'react-weui';

class StatByProject extends React.Component {
  static propTypes = {
    stat: React.PropTypes.array
  };
  static defaultProps = {
    stat: []
  };
  render () {
    const { stat, totalAmount, totalCount, lastUpdated, maxAmount } = this.props;
    let year = (new Date(lastUpdated)).getYear() + 1900;
    let month = (new Date(lastUpdated)).getMonth() + 1;
    return (
      <div className="progress">
        <div className="hd">
          <h1 className="page_title">按项目统计</h1>
        </div>
        <div className="bd spacing">
          {
            stat.map((item, i) => {
              if (item.value) return (
                <div key={i}>
                  <CellsTitle>
                    <a href={`/acceptors/list/?project=${encodeURIComponent(item._id)}`} >
                      {item._id}
                    </a>
                  </CellsTitle>
                  <CellsTitle>
                    {formatMoney(item.value.amount, '¥')}元 | {formatNumber(item.value.count)}人次
                  </CellsTitle>
                  <Progress value={(item.value.amount / maxAmount) * 100} />

                </div>
              )
              return null;
            })
          }
        </div>
        <MediaBox>
          <MediaBoxDescription>
            <b>截止至{year}年{month}月，一共捐赠{formatMoney(totalAmount, '￥')}元，共计{formatNumber(totalCount)}人次</b>
          </MediaBoxDescription>
        </MediaBox>
      </div>
    )
  }
}

export default StatByProject;
