import {PageContainer} from "@ant-design/pro-layout";

import {connect} from 'umi';
import React, {useEffect, useState} from 'react'
import Terminal from 'react-console-emulator'
import {Alert, Card, Col, Menu, Row, Select} from "antd";
import IconFont from "@/components/Icon/IconFont";

const {Option} = Select;


const RedisOnline = ({dispatch, gconfig}) => {

  const [label, setLabel] = useState('disconnected> ');
  const [currentRedis, setCurrentRedis] = useState(null);

  const {redisConfig} = gconfig;

  const getArray = (result)=> {
    if (typeof result === 'string') {
      return result;
    }
    if (result.length === 0) {
      return "(empty array)"
    }
    return result.map((item, index) => `${index+1}) ${item}`).join("\n");
  }

  const commands = {
    get: {
      description: 'Get Key',
      usage: 'get [key]',
      fn: async (...args) => {
        const cmd = "get" + " " + args.join(' ')
        const result = await onlineRedis(cmd)
        if (result === null) {
          return "nil"
        }
        return result;
      },
    },
    set: {
      description: 'Set Key value',
      usage: 'set [key] [value]',
      fn: async (...args) => {
        const cmd = "set" + " " + args.join(' ')
        return await onlineRedis(cmd)
      },
    },
    hget: {
      description: 'hget key field',
      usage: 'hget [key] [field]',
      fn: async (...args) => {
        const cmd = "hget" + " " + args.join(' ')
        const result = await onlineRedis(cmd)
        if (result === null) {
          return "nil"
        }
        return result;
      },
    },
    hgetall: {
      description: 'hgetall key',
      usage: 'hgetall [key]',
      fn: async (...args) => {
        const cmd = "hgetall" + " " + args.join(' ')
        const result = await onlineRedis(cmd)
        return getArray(result);
      },
    },

    hset: {
      description: 'hset key field value',
      usage: 'hset [key] [field] [value]',
      fn: async (...args) => {
        const cmd = "hset" + " " + args.join(' ')
        return await onlineRedis(cmd)
      },
    },

    keys: {
      description: 'keys pattern',
      usage: 'keys [regex]',
      fn: async (...args) => {
        const cmd = "keys" + " " + args.join(' ')
        const result = await onlineRedis(cmd)
        return getArray(result);
      },
    },

    lpush: {
      description: 'lpush key value',
      usage: 'lpush [key] [value]',
      fn: async (...args) => {
        const cmd = "lpush" + " " + args.join(' ')
        return await onlineRedis(cmd);
      },
    },

    rpush: {
      description: 'rpush key value',
      usage: 'rpush [key] [value]',
      fn: async (...args) => {
        const cmd = "rpush" + " " + args.join(' ')
        return await onlineRedis(cmd);
      },
    },

    lrange: {
      description: 'lrange key start end',
      usage: 'lrange [key] [start] [end]',
      fn: async (...args) => {
        const cmd = "lrange" + " " + args.join(' ')
        const result = await onlineRedis(cmd);
        return getArray(result);
      },
    },

    del: {
      description: 'del key',
      usage: 'del [key]',
      fn: async (...args) => {
        const cmd = "del" + " " + args.join(' ')
        return await onlineRedis(cmd);
      },
    }

  }

  useEffect(() => {
    dispatch({
      type: 'gconfig/fetchRedisConfig',
    })
  }, [])

  const onlineRedis = async command => {
    return await dispatch({
      type: 'gconfig/onlineRedisCommand',
      payload: {
        id: currentRedis,
        command,
      }
    })
  }

  const handleClick = (a) => {
    setLabel(a.item.props.children[1].props.children + "> ")
    setCurrentRedis(parseInt(a.key, 10))
  }

  return (
    <PageContainer title="在线执行Redis" breadcrumb={false}>

      <Card style={{margin: -12}}>
        <Row>
          <Col span={24}>
            <Alert style={{marginBottom: 8}} type="info" showIcon closable
                   message="选中左侧菜单可以切换Redis, 目前支持get/set/hget/hgetall/hset等常见操作"/>
          </Col>
          <Col span={5}>
            <Menu
              style={{minHeight: 380, maxHeight: 380, overflow: 'auto', background: 'rgb(33, 33, 33)'}}
              theme="dark"
              onClick={handleClick}
              mode="inline"
            >
              {redisConfig.map(v => <Menu.Item key={v.id} icon={v.cluster ? <IconFont type="icon-jiqun"/> :
                <IconFont type="icon-fuwushili"/>}>{v.addr}</Menu.Item>)}
            </Menu>
          </Col>

          <Col span={19}>
            <div style={{minHeight: 380, maxHeight: 380, overflow: 'auto', borderLeft: '1px solid rgb(70 68 12)'}}>
              <Terminal
                style={{height: 400, borderRadius: 0}}
                ignoreCommandCase
                commands={commands}
                disabled={label === 'disconnected> '}
                autoFocus
                welcomeMessage={'Welcome to the Redis Terminal!\nEnter "help" show all command supported!'}
                promptLabel={label}
              />
            </div>
          </Col>
        </Row>
      </Card>


    </PageContainer>
  )
}

export default connect(({gconfig}) => ({gconfig}))(RedisOnline);
