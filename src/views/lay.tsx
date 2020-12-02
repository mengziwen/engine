import { defineComponent, reactive } from 'vue';
import { RouterView } from 'vue-router';

const data = reactive<{ needLogin: boolean }>({
  needLogin: true,
});

export default defineComponent({
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
        <RouterView />
      </div>
    );
  },
});
