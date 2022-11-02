import request from '@/utils/request';
import {CONFIG} from '@/consts/config';
import auth from '@/utils/auth';

export async function listTestCaseTree(data) {
  return request(`${CONFIG.URL}/testcase/listTestCase`, {
    method: 'POST',
    data,
    headers: auth.headers(),
  });
}

export async function createTestCase(data) {
  return request(`${CONFIG.URL}/testcase/insertTestCase`, {
    method: 'POST',
    data,
    headers: auth.headers(),
  });
}

export async function createTestCaseV2(data) {
  return request(`${CONFIG.URL}/testcase/createTestCase`, {
    method: 'POST',
    data,
    headers: auth.headers(),
  });
}

export async function updateTestCase(data) {
  return request(`${CONFIG.URL}/testcase/updateTestCase`, {
    method: 'POST',
    data,
    headers: auth.headers(),
  });
}

export async function listTestcase(data) {
  return request(`${CONFIG.URL}/testcase/listTestCase`, {
    method: 'POST',
    data,
    headers: auth.headers(),
  });
}

export async function queryTestCase(data) {
  return request(`${CONFIG.URL}/testcase/queryTestCase`, {
    method: 'POST',
    data,
    headers: auth.headers(),
  });
}

// 新增断言
export async function insertTestCaseAsserts(data) {
  return request(`${CONFIG.URL}/testcase/insertAsserts`, {
    method: 'POST',
    data,
    headers: auth.headers(),
  });
}

// 编辑断言
export async function updateTestCaseAsserts(data) {
  return request(`${CONFIG.URL}/testcase/updateAsserts`, {
    method: 'POST',
    data,
    headers: auth.headers(),
  });
}

// 删除断言
export async function deleteTestCaseAsserts(data) {
  return request(`${CONFIG.URL}/testcase/deleteAsserts`, {
    method: 'POST',
    data,
    headers: auth.headers(),
  });
}

export async function queryXmindData(data) {
  return request(`${CONFIG.URL}/testcase/queryXmindData`, {
    method: 'POST',
    data,
    headers: auth.headers(),
  });
}

// 获取测试用例树
export async function listTestcaseTree(data) {
  return request(`${CONFIG.URL}/testcase/queryTestCaseDirTree`, {
    method: 'POST',
    data,
    headers: auth.headers(),
  });
}

export async function queryTestcaseDirectory(data) {
  return request(`${CONFIG.URL}/testcase/queryTestCaseDir`, {
    method: 'POST',
    data,
    headers: auth.headers(),
  });
}

// 新增目录
export async function insertTestcaseDirectory(data) {
  return request(`${CONFIG.URL}/testcase/insertTestCaseDir`, {
    method: 'POST',
    data,
    headers: auth.headers(),
  });
}

// 修改目录
export async function updateTestcaseDirectory(data) {
  return request(`${CONFIG.URL}/testcase/updateTestCaseDir`, {
    method: 'POST',
    data,
    headers: auth.headers(),
  });
}

/**
 * 移动用例到新目录
 * @param params
 * @returns {Promise<any>}
 */
export async function moveTestCase(data) {
  return request(`${CONFIG.URL}/testcase/moveTestCase`, {
    method: 'POST',
    data,
    headers: auth.headers(),
  });
}

// 删除目录
export async function deleteTestcaseDirectory(data) {
  return request(`${CONFIG.URL}/testcase/deleteTestCaseDir`, {
    method: 'POST',
    data,
    headers: auth.headers(),
  });
}

/**
 * 删除测试用例
 * @param data
 * @returns {Promise<any>}
 */
export async function deleteTestcase(data) {
  return request(`${CONFIG.URL}/testcase/deleteTestCase`, {
    method: 'POST',
    data,
    headers: auth.headers(),
  });
}

// 新增测试数据
export async function insertTestcaseData(data) {
  return request(`${CONFIG.URL}/testcase/insertTestData`, {
    method: 'POST',
    data,
    headers: auth.headers(),
  });
}

// 编辑测试数据
export async function updateTestcaseData(data) {
  return request(`${CONFIG.URL}/testcase/updateTestData`, {
    method: 'POST',
    data,
    headers: auth.headers(),
  });
}

// 删除测试数据
export async function deleteTestcaseData(data) {
  return request(`${CONFIG.URL}/testcase/deleteTestData`, {
    method: 'POST',
    data,
    headers: auth.headers(),
  });
}

// 在线执行py脚本
export async function onlinePyScript(params) {
  return request(`${CONFIG.URL}/online/script`, {
    method: 'POST',
    data: params,
    headers: auth.headers(),
  });
}

// 重试测试用例
export async function retryCase(params) {
  return request(`${CONFIG.URL}/request/retry`, {
    params,
    headers: auth.headers(),
  });
}

// 获取用例录制状态
export async function queryRecordStatus() {
  return request(`${CONFIG.URL}/testcase/record/status`, {
    headers: auth.headers(),
  });
}


// 开始录制
export async function startRecord(params) {
  return request(`${CONFIG.URL}/testcase/record/start`, {
    headers: auth.headers(),
    params
  });
}

// 停止录制
// 开始录制
export async function stopRecord(params) {
  return request(`${CONFIG.URL}/testcase/record/stop`, {
    headers: auth.headers(),
    params
  });
}

// 生成用例
export async function generateCase(data) {
  return request(`${CONFIG.URL}/testcase/generateTestCase`, {
    headers: auth.headers(),
    data,
    method: 'POST'
  });
}

// 导入har文件
export async function importFile(data) {
  const reader = new FileReader();
  reader.readAsDataURL(data.file)
  reader.onload = async () => {
    const res = await request(`${CONFIG.URL}/testcase/importTestCase`, {
      method: 'POST',
      data: {
        filename: data.file.name,
        content: reader.result,
        import_type: data.import_type
      },
      headers: auth.headers(),
    });
    data.callback(res)
  }
  // let res;
  // reader.onload = async () => {
  //   res = await request(`${CONFIG.URL}/testcase/importTestCase`, {
  //     method: 'POST',
  //     data: {
  //       filename: data.file.name,
  //       content: reader.result,
  //       import_type: data.import_type
  //     },
  //     headers: auth.headers(),
  //   });
  // }
  // return res;
  // const formData = new FormData();
  // formData.append("file", data.file)
  // return await request(`${CONFIG.URL}/testcase/import`, {
  //   method: 'POST',
  //   data: formData,
  //   params: {import_type: data.import_type},
  //   requestType: 'form',
  //   headers: auth.headers(false),
  // });
}

// 删除录制数据
export async function removeRecord(index) {
  return await request(`${CONFIG.URL}/testcase/record/remove`, {
    method: 'GET',
    params: {index},
    headers: auth.headers(),
  });
}
