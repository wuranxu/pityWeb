import React, {useState} from 'react';
import "./AntdEditableTable.less";
import {Button, Col, Form, Input, Popconfirm, Row, Select, Table, Typography} from 'antd';
import {PlusOutlined} from "@ant-design/icons";
import {CONFIG} from "@/consts/config";

const {Option} = Select;

const EditableCell = ({
                        editing,
                        dataIndex,
                        title,
                        type,
                        setType,
                        record,
                        index,
                        key,
                        children,
                        ...restProps
                      }) => {
  return (
    <td {...restProps}>
      {
        editing ?

          <Form.Item
            name={dataIndex}
            style={{
              margin: 0,
            }}
            initialValue={record.dataIndex}
            rules={[
              {
                required: true,
                message: `Please Input ${title}!`,
              },
            ]}
          ><Input placeholder={`please input ${title}`}/>
          </Form.Item>
          : (
            children
          )}
    </td>
  );
};

const AntdEditableTable = ({data, setData, ossFileList}) => {
  const [form] = Form.useForm();
  const [editingKey, setEditingKey] = useState('');
  const [type, setType] = useState('FILE');
  const [filepath, setFilepath] = useState(null);

  const isEditing = (record) => record.key === editingKey;

  const edit = (record) => {
    form.setFieldsValue({
      ...record,
    });
    setEditingKey(record.key);
  };

  const cancel = () => {
    setEditingKey('');
  };

  const save = async (key) => {
    try {
      const row = await form.validateFields();
      console.log(row)
      const newData = [...data];
      const index = newData.findIndex((item) => key === item.key);

      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, {...item, ...row, type, value: filepath});
        setData(newData);
        setEditingKey('');
      } else {
        newData.push({...row, type, value: filepath});
        setData(newData);
        setEditingKey('');
      }
    } catch (errInfo) {
      console.log('Validate Failed:', errInfo);
    }
  };

  const columns = [
    {
      title: 'KEY',
      dataIndex: 'key',
      width: "30%",
      editable: true,
    },
    {
      title: 'TYPE',
      dataIndex: 'type',
      type: 'select',
      width: "10%",
      render: (_, record) => record.key === editingKey ?
        <Select style={{width: '100%'}} value={type} onChange={currentType => {
          setType(currentType)
        }}>
          <Option value="FILE">FILE</Option>
          <Option value="TEXT">TEXT</Option>
        </Select> : record.type,
    },
    {
      title: 'VALUE',
      dataIndex: 'value',
      width: "40%",
      render: (_, record) => record.key === editingKey ? type === 'FILE' ?
        <Select style={{width: '100%'}} placeholder="please select oss file" showSearch value={filepath}
                onChange={e => setFilepath(e)}>
          {ossFileList.map(v => <Option key={v.key} value={v.key}>{v.key}</Option>)}
        </Select> : <Input placeholder="please input VALUE" value={filepath} onChange={e => {
          setFilepath(e.target.value)
        }}/> :
        type === 'FILE' ? <a href={`${CONFIG.URL}/oss/download?filepath=${record.value}`}>{record.value}</a>: record.value
    },
    {
      title: 'OPERATION',
      dataIndex: 'operation',
      render: (_, record) => {
        const editable = isEditing(record);
        return editable ? (
          <span>
            <a
              onClick={() => save(record.key)}
              style={{
                marginRight: 8,
              }}
            >
              Save
            </a>
            <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
              <a>Cancel</a>
            </Popconfirm>
          </span>
        ) : (
          <Typography.Link disabled={editingKey !== ''} onClick={() => edit(record)}>
            Edit
          </Typography.Link>
        );
      },
    },
  ];

  const onAdd = () => {
    const newData = [...data, {key: "", type: 'TEXT', value: null}]
    setData(newData)
    setType("FILE")
  }

  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }

    return {
      ...col,
      onCell: (record) => ({
        record,
        type,
        setType,
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });
  return (
    <>
      <Row style={{marginBottom: 12}}>
        <Col span={6}>
          <Button type="primary" onClick={onAdd} icon={<PlusOutlined/>}>Add</Button>
        </Col>
      </Row>
      <Form form={form} component={false}>
        <Table
          components={{
            body: {
              cell: EditableCell,
            },
          }}
          dataSource={data}
          columns={mergedColumns}
          rowClassName="editable-row"
          pagination={{
            onChange: cancel,
          }}
        />
      </Form>
    </>
  );
};

export default AntdEditableTable;
