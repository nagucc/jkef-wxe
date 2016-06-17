import React, { PropTypes } from 'react';
import { formatMoney, formatNumber } from 'accounting';
import { connect } from 'react-redux';
import { CellsTitle, Progress, MediaBox, MediaBoxDescription } from 'react-weui';
import getStatByYear from '../../../actions/stat/by-year';

class StatByYear extends React.Component {
  static propTypes = {
    stat: PropTypes.array,
    getStatByYear: PropTypes.func.isRequired,
    totalAmount: PropTypes.number,
    totalCount: PropTypes.number,
    lastUpdated: PropTypes.number,
    maxAmount: PropTypes.number,
  };
  static contextTypes = {
    setTitle: PropTypes.func.isRequired,
  };
  componentDidMount() {
    this.context.setTitle('按年度统计')
    this.props.getStatByYear();
  }
  render() {
    const { stat, totalAmount, totalCount, lastUpdated, maxAmount } = this.props;
    let year = (new Date(lastUpdated)).getYear() + 1900;
    let month = (new Date(lastUpdated)).getMonth() + 1;
    return (
      <div className="progress">
        <div className="hd">
          <h1 className="page_title">年度统计</h1>
        </div>
        <div className="bd spacing">

          {
            stat.map((item, i) => {
              if (item.value) return (
                <div key={i}>
                  <CellsTitle>
                    <a href={`/acceptors/list/?year=${item._id}`}>
                      {item._id}年
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

const mapStateToProps = state => {
  const stat = state.stat.byYear.data;
  let totalAmount = 0;
  let totalCount = 0;
  let lastUpdated = 0;
  let maxAmount = 0;
  stat.forEach(item => {
    totalAmount += item.value.amount;
    totalCount += item.value.count;
    lastUpdated = Math.max(lastUpdated,
      isNaN(item.value.lastUpdated) ? 0 : item.value.lastUpdated);
    maxAmount = Math.max(maxAmount, item.value.amount);
  });
  return { stat, totalAmount, totalCount, lastUpdated, maxAmount };
};

export default connect(mapStateToProps, { getStatByYear })(StatByYear);
