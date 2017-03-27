import React, { PropTypes } from 'react';
import { Cells, Cell, CellsTitle, Progress, MediaBox, MediaBoxDescription, CellBody, CellHeader, CellFooter } from 'react-weui';
import { formatMoney, formatNumber } from 'accounting';

const List = ({ stat }) => (
  <Cells>
    {
          stat.map(({ _id, value }) => {
            if (value) {
              return (
                <Cell key={_id} href={`/acceptors/list/?project=${encodeURIComponent(_id)}`} access>
                  <CellHeader>{_id}</CellHeader>
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
