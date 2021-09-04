import React, {useEffect} from 'react';
import {EditableProTable} from '@ant-design/pro-table';

export default ({columns, dataSource, title, setDataSource, editableKeys, setEditableRowKeys, extra}) => {

  useEffect(() => {
    setEditableRowKeys(dataSource.map(v => v.id))
  }, [dataSource])

  return (
    <EditableProTable headerTitle={title} columns={columns} rowKey='id' value={dataSource} onChange={setDataSource}
                      recordCreatorProps={{
                        newRecordType: 'dataSource',
                        record: () => ({
                          id: Date.now(),
                        }),
                      }} editable={{
      type: 'multiple',
      editableKeys,
      actionRender: (row, config, defaultDoms) => {
        return [defaultDoms.delete];
      },
      onValuesChange: (record, recordList) => {
        if (extra) {
          extra(recordList);
        }
        setDataSource(recordList);
      },
      onChange: setEditableRowKeys,
    }}/>
  );
}
