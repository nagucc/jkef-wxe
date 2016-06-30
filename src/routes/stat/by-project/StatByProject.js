import React, { PropTypes } from 'react';
import { formatMoney, formatNumber } from 'accounting';
import { connect } from 'react-redux';
import getStatByProject from '../../../actions/stat/by-project';

import { CellsTitle, Progress, MediaBoxDescription, MediaBox } from 'react-weui';
import LoadingToast from '../../../components/LoadingToast';

class StatByProject extends React.Component {
  static propTypes = {
    stat: PropTypes.array,
    totalAmount: PropTypes.number,
    lastUpdated: PropTypes.number,
    totalCount: PropTypes.number,
    maxAmount: PropTypes.number,
    getStatByProject: PropTypes.func.isRequired,
    showToast: PropTypes.bool,
  };
  static contextTypes = {
    setTitle: PropTypes.func.isRequired,
  };
  componentDidMount() {
    this.context.setTitle('按项目统计');
    this.props.getStatByProject();
  }
  render() {
    const { stat, totalAmount, totalCount, lastUpdated, maxAmount,
      showToast } = this.props;
    let year = (new Date(lastUpdated)).getYear() + 1900;
    let month = (new Date(lastUpdated)).getMonth() + 1;
    return (
      <div className="progress">
        <div className="bd spacing">
          {
            stat.map((item, i) => {
              if (item.value) {
                return (
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
                );
              }
              return null;
            })
          }
        </div>
        <MediaBox>
          <MediaBoxDescription>
            <b>
              截止至{year}年{month}月，
              一共捐赠{formatMoney(totalAmount, '￥')}元，
              共计{formatNumber(totalCount)}人次
            </b>
          </MediaBoxDescription>
        </MediaBox>
        <LoadingToast show={showToast} />
      </div>
    );
  }
}

const mapStateToProps = state => {
  const stat = state.stat.byProject.data;
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
  const { showToast } = state.stat.byProject;
  return { stat, totalAmount, totalCount, lastUpdated, maxAmount, showToast };
};

export default connect(mapStateToProps, { getStatByProject })(StatByProject);
