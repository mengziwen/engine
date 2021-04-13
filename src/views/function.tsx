import { defineComponent } from 'vue';
import { message, notification } from 'ant-design-vue';
import ace from 'ace-builds';
import 'ace-builds/webpack-resolver';
import 'ace-builds/src-noconflict/theme-xcode'; // 默认设置的主题
import 'ace-builds/src-noconflict/mode-groovy'; // 默认设置的语言模式
import codeUtil from '@/util/uriAndMD5';

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
        moduleCode: '',
        shortIntroduce: '',
        scriptDetails: '',
        paramDefineList: [] as any[],
      },
      timeTrigger: [] as any[],
      dataTrigger: [] as any[],
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
      // 详情
      const res = await this.$axios.get(`/fsmEdge/v1/ruleFunc/getById/${id}`);
      this.funObj = res.data;
      this.param = res.data.paramDefineList;
      const code = codeUtil.unCode(res.data.scriptDetails);
      this.aceEditor.setValue(code);
      // 触发条件
      const res2 = await this.$axios.get(
        `/fsmEdge/v1/scheduler/getByCode/${this.funObj.funcName}`,
      );
      if (res2.data) {
        this.dataTrigger = res2.data.schedulerOnDataItems;
        this.timeTrigger = [
          { delay: res2.data.startTime, period: res2.data.period },
        ];
      }
    },
    addParam() {
      this.param.push({});
    },
    async save() {
      const code = this.aceEditor.getValue();
      this.funObj.scriptDetails = codeUtil.enCode(code);
      this.funObj.paramDefineList = this.param;
      // 保存详情
      const res = await this.$axios.post(
        '/fsmEdge/v1/ruleFunc/save',
        this.funObj,
      );
      // 保存触发条件
      if (this.timeTrigger.length === 0 && this.dataTrigger.length === 0) {
        const res2 = await this.$axios.delete(
          `/fsmEdge/v1/scheduler/deleteByCode/${this.funObj.funcName}`,
        );
      } else {
        const par: any = {
          enabled: true,
          moduleCode: this.funObj.moduleCode,
          name: `${this.funObj.name}触发器`,
          triggerCode: this.funObj.funcName,
          schedulerOnDataItems: this.dataTrigger,
        };
        if (this.timeTrigger.length !== 0) {
          par.startTime = this.timeTrigger[0].delay;
          par.period = this.timeTrigger[0].period;
        }
        const res2 = await this.$axios.post('/fsmEdge/v1/scheduler/save', par);
      }

      message.success('保存成功');
      this.$router.push('functionList');
    },
    async preview() {
      const code = this.aceEditor.getValue();
      this.funObj.scriptDetails = codeUtil.enCode(code);
      this.funObj.paramDefineList = this.param;
      const res = await this.$axios.post(
        '/fsmEdge/v1/ruleFunc/preview',
        this.funObj,
      );
      const str = res.data.scriptSourceCode;
      const resCode = codeUtil.unCode(str);
      notification.open({
        message: '结果',
        description: resCode,
        duration: null,
        style: {
          width: '1000px',
          marginLeft: `${335 - 1000}px`,
        },
      });
    },
    addTrigger(type: string) {
      if (type === 'time') {
        if (this.timeTrigger.length >= 1) {
          message.error('定时触发最多一个');
        } else {
          this.timeTrigger.push({});
        }
      } else {
        this.dataTrigger.push({});
      }
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
          <div class='flex1 flex ele'>
            <div class='name'>moduleCode：</div>
            <div class='flex1'>
              <a-input v-model={[this.funObj.moduleCode, 'value']}></a-input>
            </div>
          </div>
          <div class='flex1 flex ele'>
            <div class='name'>函数描述：</div>
            <div class='flex1'>
              <a-input
                v-model={[this.funObj.shortIntroduce, 'value']}
              ></a-input>
            </div>
          </div>
        </div>

        <div class='trigger'>
          <div class='title'>
            触发条件：
            <a-button
              type='primary'
              onClick={() => {
                this.addTrigger('time');
              }}
            >
              定时触发
            </a-button>
            <a-button
              type='primary'
              onClick={() => {
                this.addTrigger('data');
              }}
            >
              数据触发
            </a-button>
          </div>
          {this.timeTrigger.map((ele: any, index: number) => {
            return (
              <div class='flex line'>
                <div class='flex1 flex ele'>
                  <div class='name'>定时触发：</div>
                  <div class='name'>首次延时(秒)：</div>
                  <div class='flex1'>
                    <a-input v-model={[ele.delay, 'value']}></a-input>
                  </div>
                </div>
                <div class='flex1 flex ele'>
                  <div class='name'>周期(秒)：</div>
                  <div class='flex1'>
                    <a-input v-model={[ele.period, 'value']}></a-input>
                  </div>
                  <div>
                    <a-button
                      type='danger'
                      onClick={() => {
                        this.timeTrigger.splice(index, 1);
                      }}
                    >
                      删除
                    </a-button>
                  </div>
                </div>
              </div>
            );
          })}
          {this.dataTrigger.map((ele: any, index: number) => {
            return (
              <div class='flex line'>
                <div class='flex1 flex ele'>
                  <div class='name'>数据触发：</div>
                  <div class='name'>设备编号(tc)：</div>
                  <div class='flex1'>
                    <a-input v-model={[ele.thingCode, 'value']}></a-input>
                  </div>
                </div>
                <div class='flex1 flex ele'>
                  <div class='name'>属性编码(mc)：</div>
                  <div class='flex1'>
                    <a-input v-model={[ele.metricCode, 'value']}></a-input>
                  </div>
                  <div>
                    <a-button
                      type='danger'
                      onClick={() => {
                        this.dataTrigger.splice(index, 1);
                      }}
                    >
                      删除
                    </a-button>
                  </div>
                </div>
              </div>
            );
          })}
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
              this.preview();
            }}
          >
            预览
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
