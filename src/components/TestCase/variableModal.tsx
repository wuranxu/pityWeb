import { Modal, Tabs, Typography } from "antd";
import Table, { ColumnsType } from "antd/es/table";


interface VariableModalProps {
    open?: boolean;
    onCancel: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
    gconfig: GConfigDataType[];
    variables: StepDataType[];
}

interface GConfigDataType {
    name: string;
}

interface StepDataType extends GConfigDataType {
    stepName: string;
}




const { TabPane } = Tabs;

const VariableModal: React.FC<VariableModalProps> = ({ open, gconfig, variables, onCancel }) => {

    const columns: ColumnsType<GConfigDataType> = [
        {
            title: '变量名',
            dataIndex: "name",
            key: 'name',
            render: (name) => <Typography.Text copyable>{name}</Typography.Text>
        },
    ]

    const stepColumns: ColumnsType<StepDataType> = [
        ...columns,
        {
            title: '来源',
            dataIndex: "stepName",
            key: 'stepName',
        },
    ]

    return (
        <Modal title="变量列表" open={open} width={500} footer={null} onCancel={onCancel}>
            <Tabs>
                <TabPane key="global" tab="全局变量">
                    <Table columns={columns} dataSource={gconfig} size="small" />
                </TabPane>
                <TabPane key="case" tab="用例变量">
                    <Table columns={stepColumns} dataSource={variables} size="small" />
                </TabPane>
            </Tabs>
        </Modal>
    )
}


export default VariableModal;