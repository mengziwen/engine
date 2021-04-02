import { defineComponent, reactive } from 'vue';
import { RouterView } from 'vue-router';
import zhCN from 'ant-design-vue/es/locale/zh_CN';

const data = reactive<{ needLogin: boolean }>({
  needLogin: true,
});

export default defineComponent({
  data() {
    return {
      locale: zhCN,
    };
  },
  components: {},
  created() {
    data.needLogin = false;
  },
  render() {
    return (
      <div class='v_lay_body' id='layout'>
        {/* 遮罩 */}
        <div class='mask_body'></div>

        {/* 进入路由层 */}
        <a-config-provider locale={this.locale}>
          <RouterView />
        </a-config-provider>
      </div>
    );
  },
});
