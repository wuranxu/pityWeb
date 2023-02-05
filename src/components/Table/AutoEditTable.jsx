import React, {useContext, useEffect, useRef, useState} from 'react';
import {Form, Input, Popconfirm, Select, Table} from 'antd';
import "./AutoEditTable.less";
import {DeleteTwoTone} from "@ant-design/icons";

const {Option} = Select;
const EditableContext = React.createContext(null);

const EditableRow = ({index, ...props}) => {
  const [form] = Form.useForm();
  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  );
};


export default ({columns, dataSource, setDataSource}) => {
  const [editing, setEditing] = useState(null);

  const EditableCell = ({
                          title,
                          editable,
                          children,
                          dataIndex,
                          name,
                          record,
                          handleSave,
                          toggleEdit,
                          ...restProps
                        }) => {
    const form = useContext(EditableContext);
    const inputRef = useRef(null);

    useEffect(() => {
      if (editing != null) {
        form.setFieldsValue(dataSource[editing])
      }
    }, [editing])

    const onUpdateRecord = (record, name, value) => {
      const newData = [...dataSource];
      const index = newData.findIndex((item) => record.key === item.key);
      const item = newData[index];
      newData[index] = {...item, [name]: value}
      setDataSource(newData)
    }

    const getComponent = (name, dataIndex, record, inputRef, save) => {
      if (dataIndex === 'source') {
        return <Form.Item
          style={{
            margin: 0,
          }}
          name={dataIndex}
          rules={[
            {
              required: true,
              message: `${name} is required.`,
            },
          ]}
        >
          <Select placeholder="选择数据来源" style={{width: '90%'}} ref={inputRef} onSelect={e => {
            onUpdateRecord(record, dataIndex, e)
          }} onBlur={save}>
            <Option value={0}>Response: 正则</Option>
            <Option value={1}>Response: JSONPath</Option>
            <Option value={2}>Header: K/V</Option>
            <Option value={3}>Cookie: K/V</Option>
            <Option value={4}>响应状态码</Option>
            <Option value={5}>Body: 正则</Option>
            <Option value={6}>Body: JSONPath</Option>
            <Option value={7}>Request Header: K/V</Option>
          </Select>
        </Form.Item>
      }
      if (dataIndex === 'expression') {
        return <Form.Item
          style={{
            margin: 0,
          }}
          name={dataIndex}
          rules={[
            {
              required: record.source !== 4,
              message: `${name} is required.`,
            },
          ]}
        >
          <Input ref={inputRef} onPressEnter={save} disabled={record.source === 4}
                 onBlur={save} placeholder={record.source === 4 ? '无需填写' : '请输入表达式'}/>
        </Form.Item>
      }
      if (dataIndex === 'match_index') {
        return <Form.Item
          style={{
            margin: 0,
          }}
          name={dataIndex}
          rules={[
            {
              required: record.source !== 4,
              message: `${name} is required.`,
            },
          ]}
        >
          <Input ref={inputRef} onPressEnter={save} disabled={record.source === 4 || record.source === 1 || record.source === 6}
                 onBlur={save} placeholder={record.source === 4 ? '无需填写' : '请输入匹配项'}/>
        </Form.Item>
      }
      return <Form.Item
        style={{
          margin: 0,
        }}
        name={dataIndex}
        rules={[
          {
            required: true,
            message: `${name} is required.`,
          },
        ]}
      >
        <Input ref={inputRef} onPressEnter={save}
               onBlur={save} placeholder={`请输入${name}`}/>
      </Form.Item>
    }


    const save = async () => {
      try {
        const values = await form.validateFields();
        setEditing(null)
        form.setFieldsValue(record)
        handleSave({...record, ...values});
      } catch (errInfo) {
        console.log('Save failed:', errInfo);
      }
    };

    let childNode = children;

    if (editable) {
      childNode = editing === record.key ? (
        getComponent(name, dataIndex, record, inputRef, save)
      ) : (
        <div
          className="editable-cell-value-wrap"
          style={{
            paddingRight: 24,
          }}
        >
          {children}
        </div>
      );
    }

    return <td {...restProps}>{childNode}</td>;
  };

  const handleSave = (row) => {
    const newData = [...dataSource];
    const index = newData.findIndex((item) => row.key === item.key);
    const item = newData[index];
    newData.splice(index, 1, {...item, ...row});
    if (newData.filter(item => item.name).length === newData.length) {
      newData.push({
        key: dataSource.length === 0 ? 0 : dataSource[dataSource.length - 1].key + 1,
        source: 1,
      })
    }
    setDataSource(newData);

  };

  const handleDelete = (key) => {
    const data = [...dataSource];
    setDataSource(data.filter((item) => item.key !== key).map((v, index) => ({...v, key: index})))
  };

  let newColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }

    return {
      ...col,
      onCell: (record) => ({
        record,
        editable: col.editable,
        dataIndex: col.dataIndex,
        title: col.title,
        name: col.name,
        handleSave: handleSave,
      }),
    };
  });

  newColumns = [
    ...newColumns,
    {
      title: '操作',
      render: (_, record) =>
        dataSource.length > 1 ? (
          <Popconfirm title="确定删除吗?" onConfirm={() => {
            handleDelete(record.key)
          }}>
            <DeleteTwoTone twoToneColor="red" onClick={e => {
              e.stopPropagation();
            }}/>
          </Popconfirm>
        ) : null,
    },
  ]

  const components = {
    body: {
      row: EditableRow,
      cell: EditableCell,
    },
  };

  return (
    <Table
      onRow={record => {
        return {
          onClick: (event) => {
            setEditing(record.key)
          }, // 点击行
        };
      }}
      components={components}
      rowClassName='editable-row'
      dataSource={dataSource}
      columns={newColumns}
      pagination={false}
    />
  )
}

