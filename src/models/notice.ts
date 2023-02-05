import {deleteNotice, queryNotices, updateNotices} from '@/services/user';
import auth from "@/utils/auth";
import {useState} from 'react';


export default () => {
  const [notices, setNotices] = useState<any[]>([]);
  const [ws, setWs] = useState(null);
  const [noticeCount, setNoticeCount] = useState<number>(0);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [totalCount, setTotalCount] = useState<number>(0);

  const saveNotices = (payload: any[]) => {
    setNotices(payload)
  }

  const clearNotices = (payload: string) => {
    const count = notices.length;
    const unreadCount = notices.filter((item) => !item.read).length || 0;
    setNotices(notices.filter((item) => item.type !== payload))
    setTotalCount(count)
    setUnreadCount(unreadCount)
  }

  const fetchNotices = async (params: Record<string, string | number>) => {
    const resp = await queryNotices(params)
    saveNotices(resp)
    return resp;
  }

  const deleteNotices = async (idList: number[]) => {
    const resp = await deleteNotice(idList)
    auth.response(resp);
  }

  const readNotices = async (data: any[]) => {
    const broadcast = data?.filter(item => item.msg_type === 1).map(item => item.id) || []
    const personal = data?.filter(item => item.msg_type === 2).map(item => item.id) || []
    if (broadcast.length > 0 || personal.length > 0) {
      const resp = await updateNotices({broadcast, personal})
      auth.response(resp)
    }
  }

  return {
    clearNotices,
    fetchNotices,
    notices,
    totalCount,
    noticeCount,
    ws,
    setWs,
    unreadCount,
    deleteNotices,
    setNoticeCount,
    readNotices,
    setTotalCount
  }
}

