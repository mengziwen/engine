import { defineComponent } from 'vue';
import { message } from 'ant-design-vue';
import ace from 'ace-builds';
import 'ace-builds/webpack-resolver';
import 'ace-builds/src-noconflict/theme-xcode'; // 默认设置的主题
import 'ace-builds/src-noconflict/mode-groovy'; // 默认设置的语言模式

import '@/assets/less/function.less';

export default defineComponent({
  data() {
    return {
      aceEditor: undefined as any,
      themePath: 'ace/theme/xcode', // 不导入 webpack-resolver，该模块路径会报错
      modePath: 'ace/mode/groovy', // 同上
      codeValue: '',
      param: [] as any[],
      funObj: {
        name: '',
        funcName: '',
        shortIntroduce: '',
        scriptDetails: '',
        paramDefineList: [] as any[],
      },
    };
  },
  mounted() {
    this.aceEditor = ace.edit(this.$refs.ace as Element, {
      maxLines: 50, // 最大行数，超过会自动出现滚动条
      minLines: 30, // 最小行数，还未到最大行数时，编辑器会自动伸缩大小
      fontSize: 12, // 编辑器内字体大小
      theme: this.themePath, // 默认设置的主题
      mode: this.modePath, // 默认设置的语言模式
      tabSize: 4, // 制表符设置为 4 个空格大小
      highlightActiveLine: false,
    });
    if (this.$route.query.id) {
      this.getData(this.$route.query.id);
    }
  },
  methods: {
    async getData(id: any) {
      const res = await this.$axios.get(`/fsmEdge/v1/ruleFunc/getById/${id}`);
      this.funObj = res.data;
      this.param = res.data.paramDefineList;
      const code = this.unCode(res.data.scriptDetails);
      this.aceEditor.setValue(code);
    },
    unCode(str: string) {
      const code = window.atob(str);
      return decodeURIComponent(code);
    },
    enCode(str: string) {
      const code = encodeURIComponent(str);
      return window.btoa(code);
    },
    addParam() {
      this.param.push({});
    },
    async save() {
      const code = this.aceEditor.getValue();
      this.funObj.scriptDetails = this.enCode(code);
      this.funObj.paramDefineList = this.param;
      const res = await this.$axios.post(
        '/fsmEdge/v1/ruleFunc/save',
        this.funObj,
      );
      message.success('保存成功');
      this.$router.push('functionList');
    },
  },
  render() {
    return (
      <div class='function'>
        <div class='flex functionInfo'>
          <div class='flex1 flex ele'>
            <div class='name'>函数名：</div>
            <div class='flex1'>
              <a-input v-model={[this.funObj.name, 'value']}></a-input>
            </div>
          </div>
          <div class='flex1 flex ele'>
            <div class='name'>functionName：</div>
            <div class='flex1'>
              <a-input v-model={[this.funObj.funcName, 'value']}></a-input>
            </div>
          </div>
          <div class='flex2 flex ele'>
            <div class='name'>函数描述：</div>
            <div class='flex1'>
              <a-input
                v-model={[this.funObj.shortIntroduce, 'value']}
              ></a-input>
            </div>
          </div>
        </div>

        <div class='functionParam'>
          <div class='title'>
            参数：
            <a-button
              type='primary'
              onClick={() => {
                this.addParam();
              }}
            >
              添加
            </a-button>
          </div>
          {this.param.map((ele: any, index: number) => {
            return (
              <div class='flex param'>
                <div class='flex1 flex ele'>
                  <div class='name'>参数名：</div>
                  <div class='flex1'>
                    <a-input v-model={[ele.name, 'value']}></a-input>
                  </div>
                </div>
                <div class='flex1 flex ele'>
                  <div class='name'>paramName：</div>
                  <div class='flex1'>
                    <a-input v-model={[ele.defineCode, 'value']}></a-input>
                  </div>
                </div>
                <div class='flex1 flex ele'>
                  <div class='name'>参数类型：</div>
                  <div class='flex1'>
                    <a-input v-model={[ele.paramType, 'value']}></a-input>
                  </div>
                </div>
                <div class='flex1 flex ele'>
                  <div class='name'>参数描述：</div>
                  <div class='flex1'>
                    <a-input v-model={[ele.shortIntroduce, 'value']}></a-input>
                  </div>
                </div>
                <a-button
                  type='danger'
                  onClick={() => {
                    this.param.splice(index, 1);
                  }}
                >
                  删除
                </a-button>
              </div>
            );
          })}
        </div>

        <div class='ace-editor' ref='ace'></div>

        <div class='buttons'>
          <a-button
            type='primary'
            onClick={() => {
              this.$router.push('functionList');
            }}
          >
            取消
          </a-button>
          <a-button
            type='primary'
            onClick={() => {
              this.save();
            }}
          >
            保存
          </a-button>
        </div>
      </div>
    );
  },
});
