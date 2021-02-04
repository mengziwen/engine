/*
 * @abstract: JianJie
 * @version: 0.0.1
 * @Author: bhabgs
 * @Date: 2021-01-22 11:25:14
 * @LastEditors: bhabgs
 * @LastEditTime: 2021-01-22 11:38:54
 */
import { defineComponent, reactive } from 'vue';
import { instance } from '@/util/axios';
import { getAllQuery } from '@/util/getQuery';
import uni from '@/util/stringToUni';

const data = reactive<{
  password: string;
  username: string;
  corpId: string;
}>({
  password: 'zx111222',
  username: '13900000090',
  corpId: '',
});

export default defineComponent({
  props: {
    top: {
      default: '10%',
    },
    width: {
      default: '90%',
    },
  },
  methods: {
    async login() {
      const res = await instance.get(
        `/app/login?password=${data.password}&username=${data.username}`,
      );
      window.sessionStorage.setItem('token', res.data.access_token);
      window.sessionStorage.setItem('rf_token', res.data.refresh_token);
      window.sessionStorage.setItem('corpId', data.corpId);

      const { prevpath } = getAllQuery();
      this.$router.push(prevpath);
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
          <input
            v-model={data.username}
            type='text'
            placeholder='请输入用户名'
          />
          <input
            v-model={data.password}
            type='password'
            placeholder='请输入密码'
          />
          <input type='text' v-model={data.corpId} placeholder='corpId' />
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
          <button onClick={this.login}>登 录</button>
        </div>
      </div>
    );
  },
});
