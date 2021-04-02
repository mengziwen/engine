import { defineComponent } from 'vue';
import moment from 'moment';
import { message } from 'ant-design-vue';

export default defineComponent({
  data() {
    return {
      dataSource: [],
      columns: [
        {
          title: '规则名称',
          dataIndex: 'treeName',
          key: 'treeName',
        },
        {
          title: 'treeCode',
          dataIndex: 'treeCode',
          key: 'treeCode',
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
    };
  },
  mounted() {
    this.getData();
  },
  methods: {
    async getData() {
      const res = await this.$axios.post('/fsmEdge/v1/ruleExpression/search', {
        pageNum: 1,
        pageSize: 1000,
      });
      res.data.list.forEach((ele: any) => {
        ele.createTime = moment(ele.createTime).format('lll');
        ele.updateTime = moment(ele.updateTime).format('lll');
      });
      this.dataSource = res.data.list;
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
                  path: '/tree',
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
  },
  render() {
    return (
      <div>
        <a-table
          dataSource={this.dataSource}
          columns={this.columns}
          vSlots={this.customRender()}
        />
      </div>
    );
  },
});
