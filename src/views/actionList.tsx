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
          title: '决策名称',
          dataIndex: 'name',
          key: 'name',
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
          title: '是否启用',
          dataIndex: 'enabled',
          key: 'enabled',
          slots: { customRender: 'enabled' },
        },
        {
          title: '操作',
          dataIndex: 'id',
          key: 'id',
          slots: { customRender: 'operation' },
        },
      ],
      code: '',
      time: [] as any[],
      test: '',
    };
  },
  mounted() {
    this.getData();
  },
  methods: {
    async getData() {
      const par: any = { searchTag: this.code };
      if (this.time.length !== 0) {
        par.startTime = this.time[0].valueOf();
        par.endTime = this.time[1].valueOf();
      }
      const res = await this.$axios.post(
        '/smartfsm/v1/fsmEdge/componentGraph/search',
        {
          recordType: 1,
          pageNum: 1,
          pageSize: 1000,
          ...par,
        },
      );
      res.data.list.forEach((ele: any) => {
        ele.createTime = moment(ele.createTime).format('lll');
        ele.updateTime = moment(ele.updateTime).format('lll');
      });
      this.dataSource = res.data.list;
    },
    async deleteData(id: any) {
      const res: any = await this.$axios.delete(
        `/smartfsm/v1/fsmEdge/componentGraph/delete/${id}`,
      );
      if (res.code === 'M0000') {
        message.success('删除成功');
        this.getData();
      } else {
        message.error('服务异常');
      }
    },
    async preview(val: string) {
      const res: any = await this.$axios.get(
        `/smartfsm/v1/fsmEdge/define/getScriptDetails/${val}`,
      );
      const str = res.data.scriptSourceCode;
      const code = codeUtil.unCode(str);
      notification.open({
        message: '结果',
        description: code,
        duration: null,
        style: {
          width: '1000px',
          marginLeft: `${335 - 1000}px`,
        },
      });
    },
    customRender() {
      const obj: any = {};
      obj.enabled = (prop: any) => {
        return prop ? '启用' : '未启用';
      };
      obj.operation = (prop: any) => {
        return (
          <div>
            <a-button
              onClick={() => {
                this.$router.push({
                  path: '/action',
                  query: { id: prop.text, recordType: 1 },
                });
              }}
            >
              编辑
            </a-button>
            <a-popconfirm
              title='确认删除?'
              onConfirm={() => {
                this.deleteData(prop.text);
              }}
            >
              <a-button>删除</a-button>
            </a-popconfirm>
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
          <span>决策名称：</span>
          <a-input class='input' v-model={[this.code, 'value']} />
          <span>修改时间：</span>
          <a-range-picker class='timeInput' v-model={[this.time, 'value']} />
          <a-button
            type='primary'
            onClick={async () => {
              this.getData();
            }}
          >
            搜索
          </a-button>
          <a-button
            type='primary'
            onClick={() => {
              this.$router.push({
                path: '/action',
                query: { recordType: 1 },
              });
            }}
          >
            新建
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
