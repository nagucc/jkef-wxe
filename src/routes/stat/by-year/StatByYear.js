import React, { PropTypes } from 'react';
import { formatMoney, formatNumber } from 'accounting';
import { connect } from 'react-redux';
import { MediaBox, MediaBoxDescription } from 'react-weui';
import getStatByYear from '../../../actions/stat/by-year';
import LoadingToast from '../../../components/LoadingToast';
import List from './List';

class StatByYear extends React.Component {
  static propTypes = {
    stat: PropTypes.array,
    getStatByYear: PropTypes.func.isRequired,
    totalAmount: PropTypes.number,
    totalCount: PropTypes.number,
    lastUpdated: PropTypes.number,
    maxAmount: PropTypes.number,
    showToast: PropTypes.bool,
  };
  componentDidMount() {
    this.props.getStatByYear();
  }
  render() {
    const { stat, totalAmount, totalCount, lastUpdated, maxAmount,
      showToast } = this.props;
    const year = (new Date(lastUpdated)).getYear() + 1900;
    const month = (new Date(lastUpdated)).getMonth() + 1;
    return (
      <div className="progress">
        <div className="bd spacing">
          <List stat={stat} />
        </div>
        <MediaBox>
          <MediaBoxDescription>
            <b>
              截止至{year}年{month}月
              一共捐赠{formatMoney(totalAmount, '￥')}元
              共计{formatNumber(totalCount)}人次
            </b>
          </MediaBoxDescription>
        </MediaBox>
        <LoadingToast show={showToast} />
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const stat = state.stat.byYear.data;
  let totalAmount = 0;
  let totalCount = 0;
  let lastUpdated = 0;
  let maxAmount = 0;
  stat.forEach((item) => {
    totalAmount += item.value.amount;
    totalCount += item.value.count;
    lastUpdated = Math.max(lastUpdated,
      isNaN(item.value.lastUpdated) ? 0 : item.value.lastUpdated);
    maxAmount = Math.max(maxAmount, item.value.amount);
  });
  const { showToast } = state.stat.byYear;
  return { stat, totalAmount, totalCount, lastUpdated, maxAmount, showToast };
};

export default connect(mapStateToProps, { getStatByYear })(StatByYear);
