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
          title: '规则名称',
          dataIndex: 'name',
          key: 'name',
        },
        {
          title: 'code',
          dataIndex: 'recordCode',
          key: 'recordCode',
        },
        {
          title: '创建时间',
          dataIndex: 'createTime',
          key: 'createTime',
          slots: { customRender: 'time' },
        },
        {
          title: '更新时间',
          dataIndex: 'updateTime',
          key: 'updateTime',
          slots: { customRender: 'time' },
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
    };
  },
  mounted() {
    this.getData();
  },
  methods: {
    async getData() {
      const res = await this.$axios.post('/fsmEdge/v1/componentGraph/search', {
        pageNum: 1,
        pageSize: 1000,
      });
      this.dataSource = res.data.list;
    },
    customRender() {
      const obj: any = {};
      obj.operation = (prop: any) => {
        return (
          <div>
            <a-button
              onClick={() => {
                this.$router.push({
                  path: '/action',
                  query: { id: prop.text, type: 0 },
                });
              }}
            >
              编辑
            </a-button>
            <a-button
              onClick={() => {
                // this.deleteData(prop.text);
              }}
            >
              删除
            </a-button>
          </div>
        );
      };
      obj.time = (prop: any) => {
        return moment(prop.text).format('lll');
      };
      return obj;
    },
  },
  render() {
    return (
      <div class='list'>
        <div class='flex tools'>
          <span>规则名：</span>
          <a-input class='input' v-model={[this.code, 'value']} />
          <span>修改时间：</span>
          <a-range-picker class='timeInput' v-model={[this.time, 'value']} />
          <a-button type='primary' onClick={() => {}}>
            搜索
          </a-button>
          <a-button
            type='primary'
            onClick={() => {
              this.$router.push('tree');
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
      </div>
    );
  },
});
