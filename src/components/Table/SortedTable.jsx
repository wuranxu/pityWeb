import {Table} from 'antd';
import {sortableContainer, sortableElement, sortableHandle} from 'react-sortable-hoc';
import {MenuOutlined} from '@ant-design/icons';
import {arrayMoveImmutable} from 'array-move';
import './SortedTable.less';

const DragHandle = sortableHandle(() => <MenuOutlined style={{cursor: 'grab', color: '#999'}}/>);

const defaultCols = [
  {
    title: '排序',
    dataIndex: 'sort',
    width: 50,
    className: 'drag-visible',
    render: () => <DragHandle/>,
  },
];

const SortableItem = sortableElement(props => <tr {...props} />);
const SortableContainer = sortableContainer(props => <tbody {...props} />);

export default ({dataSource, columns, setDataSource, dragCallback}) => {
  const onSortEnd = async ({oldIndex, newIndex}) => {
    if (oldIndex !== newIndex) {
      const newData = arrayMoveImmutable([].concat(dataSource), oldIndex, newIndex).filter(el => !!el);
      if (dragCallback) {
        const res = await dragCallback(newData);
        if (res) {
          setDataSource(newData);
        }
      } else {
        setDataSource(newData);
      }
    }
  };

  const DraggableContainer = props => (
    <SortableContainer
      useDragHandle
      disableAutoscroll
      helperClass="row-dragging"
      onSortEnd={onSortEnd}
      {...props}
    />
  );

  const DraggableBodyRow = ({className, style, ...restProps}) => {
    // function findIndex base on Table rowKey props and should always be a right array index
    const index = dataSource.findIndex(x => x.index === restProps['data-row-key']);
    return <SortableItem index={index} {...restProps} />;
  };
  return (
    <Table
      size="small"
      pagination={false}
      dataSource={dataSource}
      columns={[...defaultCols, ...columns]}
      rowKey="index"
      components={{
        body: {
          wrapper: DraggableContainer,
          row: DraggableBodyRow,
        },
      }}
    />
  );
}

