import React, { PropTypes } from 'react';
import { Cells, Cell, CellsTitle, Progress, MediaBox, MediaBoxDescription, CellBody, CellHeader, CellFooter } from 'react-weui';
import { formatMoney, formatNumber } from 'accounting';

const List = ({ stat }) => (
  <Cells>
    {
        stat.map(({ _id, value }) => {
          if (value) {
            return (
              <Cell key={_id} href={`/acceptors/list/?year=${_id}`} access>
                <CellHeader>{_id}年</CellHeader>
                <CellBody />
                <CellFooter>{formatMoney(value.amount, '¥')}元 | {formatNumber(value.count)}人次</CellFooter>
              </Cell>
            );
          }
          return null;
        })
      }
  </Cells>
  );

export default List;
