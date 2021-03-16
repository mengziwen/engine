import { defineComponent, reactive, ref } from 'vue';
import { RightCircleOutlined, DownSquareOutlined } from '@ant-design/icons-vue';
import { TreeDataItem } from 'ant-design-vue/es/tree/Tree';

export default defineComponent({
  mounted() {},
  data() {
    return {};
  },
  setup() {
    const expandedKeys = ref<string[]>([]);
    const selectedKeys = ref<string[]>([]);
    const tree = ref<Array<any>>([
      {
        key: '0-0',
        slots: { title: 'node', switcherIcon: 'arrow' },
        children: [
          {
            key: '0-0-1',
            slots: { title: 'node', switcherIcon: 'arrow' },
          },
          {
            key: '0-0-2',
            data: [
              { type: 'input', value: '' },
              { type: 'select', value: '' },
            ],
            slots: { title: 'condition', switcherIcon: 'arrow' },
          },
        ],
      },
    ]);
    const findSelf = (ele: any, key: string) => {
      let res: any;
      if (ele.key === key) {
        res = ele;
      } else {
        for (let i = 0; i < ele.children.length; i += 1) {
          const element = ele.children[i];
          if (element.key === key) {
            res = element;
            break;
          } else if (element.children) {
            findSelf(element, key);
          }
        }
      }

      return res;
    };
    const addNode = (param: any) => {
      const data = [...tree.value];
      const item: any = findSelf(data[0], param.key);
      if (!item.children) {
        item.children = [];
      }
      item.children.push({
        key: Math.random().toString(),
        slots: { title: 'node', switcherIcon: 'arrow' },
      });
      tree.value = data;
    };
    const addCondition = (param: any) => {
      if (!param.children) {
        param.children = [];
      }
      param.children.push({
        key: Math.random().toString(),
        data: [],
        slots: { title: 'condition', switcherIcon: 'arrow' },
      });
    };
    return {
      tree,
      expandedKeys,
      selectedKeys,
      addNode,
      addCondition,
    };
  },
  methods: {
    deleteNode(param: any) {
      const item: any = this.findParent(this.tree[0], param.key);
      for (let i = 0; i < item.children.length; i += 1) {
        const element = item.children[i];
        if (element.key === param.key) {
          item.children.splice(i, 1);
          i -= 1;
        }
      }
    },
    findParent(ele: any, key: string) {
      let res: any;
      for (let i = 0; i < ele.children.length; i += 1) {
        const element = ele.children[i];
        if (element.key === key) {
          res = ele;
          break;
        } else if (element.children) {
          this.findParent(element, key);
        }
      }
      return res;
    },
    customRender() {
      const obj: any = {};
      obj.node = (param: any) => {
        return (
          <div class='flex'>
            <a-select style='width: 120px'>
              <a-select-option value='lucy'>Lucy</a-select-option>
            </a-select>
            <a-button
              type='primary'
              onClick={() => {
                this.addNode(param);
              }}
            >
              添加条件
            </a-button>
            <a-button
              type='primary'
              onClick={() => {
                this.addCondition(param);
              }}
            >
              添加联合条件
            </a-button>
            <a-button
              type='danger'
              onClick={() => {
                this.deleteNode(param);
              }}
            >
              删除
            </a-button>
          </div>
        );
      };
      obj.condition = (param: any) => {
        return (
          <div class='flex'>
            {param.data
              .filter((ele: any) => {
                return ele.type === 'input';
              })
              .map((ele: any) => {
                return <a-input v-model={ele.value} />;
              })}
            {param.data
              .filter((ele: any) => {
                return ele.type === 'select';
              })
              .map((ele: any) => {
                return (
                  <a-select
                    show-search
                    placeholder='input search text'
                    style='width: 200px'
                    v-model={ele.value}
                  >
                    <a-select-option value='234'>123</a-select-option>
                  </a-select>
                );
              })}

            <a-button
              type='primary'
              onClick={() => {
                param.data.push({ type: 'select', value: '' });
              }}
            >
              添加函数
            </a-button>
            <a-button
              type='primary'
              onClick={() => {
                param.data.push({ type: 'input', value: '' });
              }}
            >
              添加输入框
            </a-button>
            <a-button
              type='danger'
              onClick={() => {
                this.deleteNode(param);
              }}
            >
              删除
            </a-button>
          </div>
        );
      };
      obj.arrow = (param: any) => {
        let res: any;
        if (param.isLeaf) {
          res = <RightCircleOutlined></RightCircleOutlined>;
        } else {
          res = <DownSquareOutlined />;
        }
        return res;
      };
      return obj;
    },
  },
  render() {
    return (
      <div class='index'>
        <a-tree
          treeData={this.tree}
          showLine={true}
          showIcon={false}
          autoExpandParent={true}
          v-model={[this.expandedKeys, 'expandedKeys']}
          vSlots={this.customRender()}
        ></a-tree>
      </div>
    );
  },
});
