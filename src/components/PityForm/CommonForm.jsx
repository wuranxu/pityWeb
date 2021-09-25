import {Col, Form, Row} from 'antd';
import React, {useEffect} from 'react';


import getComponent from './index';

const {Item: FormItem} = Form;

export default ({left, right, formName, record, onFinish, fields, pForm}) => {
    let currentForm = pForm;
    if (pForm === undefined) {
        const [form] = Form.useForm();
        currentForm = form;
    }
    const layout = {
        labelCol: {span: left},
        wrapperCol: {span: right},
    }

    useEffect(() => {
        currentForm.setFieldsValue(record);
    }, [record])

    return (
        <Form
            form={currentForm}
            {...layout}
            name={formName}
            initialValues={record}
            onFinish={onFinish}
        >
            <Row gutter={8}>
                {
                    fields.map(item =>
                        <Col span={item.span || 24}>
                            <FormItem label={item.label} colon={item.colon || true}
                                      rules={
                                          [{required: item.required, message: item.message}]
                                      } name={item.name} valuePropName={item.valuePropName || 'value'}
                                      {...(item.layout || layout)}
                            >
                                {getComponent(item.type, item.placeholder, item.component)}
                            </FormItem>
                        </Col>
                    )
                }
            </Row>
        </Form>
    )
}
