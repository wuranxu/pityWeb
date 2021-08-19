import {createFromIconfontCN} from '@ant-design/icons';
import {CONFIG} from "@/consts/config";

const IconFont = createFromIconfontCN({
  scriptUrl: CONFIG.ICONFONT,
});

export default IconFont;
