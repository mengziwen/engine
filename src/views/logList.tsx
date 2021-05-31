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
          title: 'moduleCode',
          dataIndex: 'moduleCode',
          key: 'moduleCode',
        },
        {
          title: '决策code',
          dataIndex: 'recordCode',
          key: 'recordCode',
        },
        {
          title: '创建时间',
          dataIndex: 'time',
          key: 'time',
        },
        {
          title: '操作',
          dataIndex: 'id',
          key: 'id',
          slots: { customRender: 'operation' },
        },
      ],
      code: '',
      time: [moment().subtract(1, 'hours'), moment()],
      test: '',
    };
  },
  mounted() {
    this.getData();
  },
  methods: {
    async getData() {
      const par: any = { decisionCode: this.code };
      if (this.time.length !== 0) {
        par.startTime = this.time[0].valueOf();
        par.endTime = this.time[1].valueOf();
      }
      const res = await this.$axios.post('/fsmEdge/v1/componentLog/search', {
        ...par,
      });
      res.data.forEach((ele: any) => {
        ele.time = moment(ele.createTime).format('lll');
      });
      this.dataSource = res.data;
    },
    async deleteData(id: any) {
      const res: any = await this.$axios.delete(
        `/fsmEdge/v1/ruleExpression/deleteTree/${id}`,
      );
      if (res.code === 'M0000') {
        message.success('删除成功');
        this.getData();
      } else {
        message.error('服务异常');
      }
    },

    customRender() {
      const obj: any = {};
      obj.operation = (prop: any) => {
        return (
          <div>
            <a-button
              onClick={() => {
                this.$router.push({
                  path: '/actionRes',
                  query: {
                    id: prop.text,
                    createTime: prop.record.createTime,
                  },
                });
              }}
            >
              查看
            </a-button>
          </div>
        );
      };

      return obj;
    },
  },
  render() {
    return (
      <div class='list'>
        <div class='flex tools'>
          <span>决策code：</span>
          <a-input class='input' v-model={[this.code, 'value']} />
          <span>修改时间：</span>
          <a-range-picker
            class='timeInput'
            show-time={{ format: 'HH:mm' }}
            format='YYYY-MM-DD HH:mm'
            v-model={[this.time, 'value']}
          />
          <a-button
            type='primary'
            onClick={async () => {
              this.getData();
            }}
          >
            搜索
          </a-button>

          {this.test}
        </div>
        <a-table
          dataSource={this.dataSource}
          columns={this.columns}
          rowKey='id'
          vSlots={this.customRender()}
        />
      </div>
    );
  },
});
