import { defineComponent } from 'vue';
import moment from 'moment';
import { message, notification } from 'ant-design-vue';
import codeUtil from '@/util/uriAndMD5';
import '@/assets/less/list.less';

export default defineComponent({
  data() {
    return {
      dataSource: [],
      columns: [
        {
          title: '函数名称',
          dataIndex: 'name',
          key: 'name',
        },
        {
          title: 'functionName',
          dataIndex: 'funcName',
          key: 'funcName',
        },
        {
          title: '创建时间',
          dataIndex: 'createTime',
          key: 'createTime',
        },
        {
          title: '更新时间',
          dataIndex: 'updateTime',
          key: 'updateTime',
        },
        {
          title: '操作',
          dataIndex: 'id',
          key: 'id',
          slots: { customRender: 'operation' },
        },
      ],
      funCode: '',
      time: [] as any[],
      diaShow: false,
      dia: {
        param: '',
        context: '',
        code: '',
        res: '',
        funCode: '',
      },
    };
  },
  mounted() {
    this.getData();
  },
  methods: {
    async getData() {
      const par: any = { searchTag: this.funCode };
      if (this.time.length !== 0) {
        par.startTime = this.time[0].valueOf();
        par.endTime = this.time[1].valueOf();
      }
      const res = await this.$axios.post('/fsmEdge/v1/ruleFunc/search', {
        pageNum: 1,
        pageSize: 1000,
        ...par,
      });
      res.data.list.forEach((ele: any) => {
        ele.createTime = moment(ele.createTime).format('lll');
        ele.updateTime = moment(ele.updateTime).format('lll');
      });
      this.dataSource = res.data.list;
    },
    async deleteData(id: any) {
      const res: any = await this.$axios.delete(
        `/fsmEdge/v1/ruleFunc/delete/${id}`,
      );
      if (res.code === 'M0000') {
        message.success('删除成功');
        this.getData();
      } else {
        message.error('服务异常');
      }
    },
    async preview(funcName: string) {
      const res: any = await this.$axios.get(
        `/fsmEdge/v1/define/getScriptDetails/${funcName}`,
      );
      const str = res.data.scriptSourceCode;
      this.dia.code = codeUtil.unCode(str);
      this.dia.funCode = funcName;
      this.diaShow = true;
    },
    customRender() {
      const obj: any = {};
      obj.operation = (prop: any) => {
        return (
          <div>
            <a-button
              onClick={() => {
                this.preview(prop.record.funcName);
              }}
            >
              预览
            </a-button>
            <a-button
              onClick={() => {
                this.$router.push({
                  path: '/function',
                  query: { id: prop.text },
                });
              }}
            >
              编辑
            </a-button>
            <a-button
              onClick={() => {
                this.deleteData(prop.text);
              }}
            >
              删除
            </a-button>
          </div>
        );
      };

      return obj;
    },
    async test() {
      const par: any = {
        scriptCode: this.dia.funCode,
      };
      par.args = this.dia.param ? JSON.parse(this.dia.param) : {};
      par.ctx = this.dia.context ? JSON.parse(this.dia.context) : {};
      const res = await this.$axios.post('/fsmEdge/v1/ruleFunc/testRun', par);
      this.dia.res = JSON.stringify(res.data, null, 2);
    },
    renderDia() {
      return (
        <a-modal
          class='funPreviewDia'
          v-model={[this.diaShow, 'visible']}
          title='预览'
          width='1200px'
          cancelText='关闭'
          okText='执行'
          onOk={() => {
            this.test();
          }}
        >
          <div class='flex'>
            <div class='flex1 flex item'>
              <div>参数：</div>
              <div class='flex1'>
                <a-input v-model={[this.dia.param, 'value']} />
              </div>
            </div>
            <div class='flex1 flex item'>
              <div>上下文：</div>
              <div class='flex1'>
                <a-input v-model={[this.dia.context, 'value']} />
              </div>
            </div>
          </div>
          <div class='preview flex'>
            <div class='code'>
              <a-textarea v-model={[this.dia.code, 'value']} autoSize={true} />
            </div>
            <pre class='res'>{this.dia.res}</pre>
          </div>
        </a-modal>
      );
    },
  },

  render() {
    return (
      <div class='list'>
        <div class='flex tools'>
          <span>函数名：</span>
          <a-input class='input' v-model={[this.funCode, 'value']} />
          <span>修改时间：</span>
          <a-range-picker class='timeInput' v-model={[this.time, 'value']} />
          <a-button
            type='primary'
            onClick={() => {
              this.getData();
            }}
          >
            搜索
          </a-button>
          <a-button
            type='primary'
            onClick={() => {
              this.$router.push('function');
            }}
          >
            新建
          </a-button>
        </div>
        <a-table
          dataSource={this.dataSource}
          columns={this.columns}
          rowKey='id'
          vSlots={this.customRender()}
        />
        {this.renderDia()}
      </div>
    );
  },
});
