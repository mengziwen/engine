import { defineComponent } from 'vue';
import uni from '@/util/stringToUni';

export default defineComponent({
  props: {
    top: {
      default: '10%',
    },
    width: {
      default: '90%',
    },
  },
  render() {
    const { width, top, $route } = this;
    const msg: any = $route.query.msg || '';
    return (
      <div
        id='login'
        style={{
          paddingTop: top,
        }}
      >
        <div
          class='login_box'
          style={{
            width,
          }}
        >
          <input type='text' placeholder='请输入用户名' />
          <input type='text' placeholder='请输入密码' />
          <input type='text' placeholder='corpId' />
          <input type='text' placeholder='uid' />
          <p class='red'>
            <b>注意⚠️</b> <br />
            <span>
              此情况仅出现在调试环境或生产环境 corpId与用户不存在的情况下 <br />
              如果生产环境遇到此问题请尽快联系管理员
              <br />
              {uni.decodeUnicode(msg)}
            </span>
          </p>
          <button>登 录</button>
        </div>
      </div>
    );
  },
});
