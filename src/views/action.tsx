import { defineComponent, reactive, ref } from 'vue';
import '@/assets/less/action.less';

export default defineComponent({
  data() {
    return {
      action: {
        name: '',
        des: '',
      },
    };
  },
  methods: {},
  render() {
    return (
      <div class='action'>
        <div class='flex info'>
          <div class='flex1 flex ele'>
            <div class='name'>动作名称：</div>
            <div class='flex1'>
              <a-input v-model={[this.action.name, 'value']}></a-input>
            </div>
          </div>
          <div class='flex1 flex ele'>
            <div class='name'>描述：</div>
            <div class='flex1'>
              <a-input v-model={[this.action.des, 'value']}></a-input>
            </div>
          </div>
        </div>
        <div class='flex drag'>
          <div></div>
        </div>
      </div>
    );
  },
});
