import { defineComponent, getCurrentInstance, reactive, ref } from 'vue';
import { RightCircleOutlined, DownSquareOutlined } from '@ant-design/icons-vue';
import { TreeDataItem } from 'ant-design-vue/es/tree/Tree';

import '@/assets/less/tree.less';
import { message } from 'ant-design-vue';

export default defineComponent({
  mounted() {
    if (this.$route.query.id) {
      this.getData(this.$route.query.id);
    }
  },
  data() {
    return {
      dialogShow: false,
      // 节点函数原数据临时变量
      funObj: {} as any,
      // 树基本信息
      treeObj: {
        treeCode: '',
        treeName: '',
      },
    };
  },
  setup(props, context) {
    // 选择函数绑定界面显示用
    const state = reactive({
      fun: { name: '', id: '', paramDefineList: [], funName: '' },
    });
    // 全部函数
    let funAll: never[] = [];
    // 函数下拉数据
    const funOption = ref([]);
    const tree = ref<Array<any>>([
      {
        key: '0-0',
        slots: { title: 'simple', switcherIcon: 'arrow' },
        value: '',
        // children: [
        //   {
        //     key: '0-0-2',
        //     data: [
        //       { type: 'input', value: '' },
        //       { type: 'fun', value: '', show: '', param: [] },
        //     ],
        //     slots: { title: 'multi', switcherIcon: 'arrow' },
        //   },
        // ],
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
        slots: { title: 'simple', switcherIcon: 'arrow' },
      });
      tree.value = data;
    };
    const addCondition = (param: any) => {
      const data = [...tree.value];
      const item: any = findSelf(data[0], param.key);
      if (!item.children) {
        item.children = [];
      }
      item.children.push({
        key: Math.random().toString(),
        data: [],
        slots: { title: 'multi', switcherIcon: 'arrow' },
      });
      tree.value = data;
    };
    const handleSearch = (val: string) => {
      const arr = funAll.filter((ele: any) => {
        return (
          (ele.name && ele.name.indexOf(val) >= 0) ||
          ele.funcName.indexOf(val) >= 0
        );
      });
      funOption.value = arr;
    };
    const handleChange = (val: string) => {
      funAll.forEach((element: any) => {
        if (element.funcName === val) {
          state.fun = element;
          state.fun.funName = element.funcName;
        }
      });
      const arr = funAll.filter((ele: any) => {
        return (
          (ele.name && ele.name.indexOf(val) >= 0) ||
          ele.funcName.indexOf(val) >= 0
        );
      });
      funOption.value = arr;
    };
    const { proxy }: any = getCurrentInstance();

    proxy.$axios
      .get('/fsmEdge/v1/define/getAllMethodDefinition')
      .then((res: any) => {
        funAll = res.data;
      });

    return {
      tree,
      state,
      funAll,
      funOption,
      handleSearch,
      handleChange,
      addNode,
      addCondition,
    };
  },
  methods: {
    async getData(id: any) {
      const res = await this.$axios.get(
        `/fsmEdge/v1/ruleExpression/getTreeById/${id}`,
      );
      const serverTree = res.data.rootTreeNode;
      this.treeObj.treeName = res.data.treeName;
      this.treeObj.treeCode = res.data.treeCode;
      this.tree[0] = this.getNode(serverTree);
    },
    // 递归处理加载数据
    getNode(treeNode: any) {
      const obj: any = { key: treeNode.treeNodeCode };
      if (treeNode.nodeType === 2) {
        obj.slots = { title: 'simple', switcherIcon: 'arrow' };
        obj.value = treeNode.value;
        if (treeNode.children && treeNode.children.length !== 0) {
          obj.children = [];
          treeNode.children.forEach((node: any) => {
            obj.children.push(this.getNode(node));
          });
        }
      } else {
        obj.slots = { title: 'multi', switcherIcon: 'arrow' };
        obj.data = [];
        treeNode.tupleList.forEach((element: any) => {
          const ele: any = {};
          if (element.tupleType === 2) {
            ele.value = element.value;
            ele.type = 'input';
          } else {
            ele.type = 'fun';
            ele.value = element.funcName;
            ele.show = element.viewStr;
            ele.param = element.tupleParamList;
          }
          obj.data.push(ele);
        });
      }
      return obj;
    },
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
    async handleOK() {
      this.funObj.value = this.state.fun.funName;
      this.funObj.param = this.state.fun.paramDefineList;
      const obj: any = {};
      obj.funcName = this.state.fun.funName;
      obj.tupleParamList = this.state.fun.paramDefineList;
      // 获取显示文本
      const res = await this.$axios.post(
        '/fsmEdge/v1/ruleExpression/toFuncTupleView',
        obj,
      );
      this.funObj.show = res.data.viewStr;
      this.dialogShow = false;
    },
    async save() {
      const obj: any = {
        enabled: true,
        treeName: this.treeObj.treeName,
        treeCode: this.treeObj.treeCode,
        rootTreeNode: this.getServerNode(this.tree[0]),
      };
      const res: any = await this.$axios.post(
        '/fsmEdge/v1/ruleExpression/save',
        obj,
      );
      if (res.code === 'M0000') {
        message.success('保存成功');
        this.$router.push('treeList');
      } else {
        message.success('服务异常');
      }
    },
    // 递归处理保存数据
    getServerNode(treeNode: any) {
      const res: any = {};
      if (treeNode.slots.title === 'simple') {
        res.nodeType = 2;
        res.value = treeNode.value;
        if (treeNode.children && treeNode.children.length !== 0) {
          res.children = [];
          treeNode.children.forEach((element: any) => {
            res.children.push(this.getServerNode(element));
          });
        }
      } else {
        res.nodeType = 1;
        res.tupleList = [];
        treeNode.data.forEach((element: any, index: number) => {
          const serverNode: any = {};
          serverNode.expressionNo = index + 1;
          if (element.type === 'fun') {
            serverNode.tupleType = 0;
            serverNode.funcName = element.value;
            serverNode.tupleParamList = element.param;
          } else {
            serverNode.tupleType = 2;
            serverNode.value = element.value;
          }
          res.tupleList.push(serverNode);
        });
      }
      return res;
    },
    funSelect(ele: any) {
      this.dialogShow = true;
      this.funObj = ele;
      if (ele.value) {
        this.state.fun.funName = ele.value;
        this.state.fun.paramDefineList = ele.param;
      } else {
        this.state.fun.funName = '';
        this.state.fun.paramDefineList = [];
      }
    },
    customRender() {
      const obj: any = {};
      // 条件
      obj.simple = (param: any) => {
        return (
          <div class='flex'>
            <a-select
              style='width: 120px'
              v-model={[param.dataRef.value, 'value']}
            >
              <a-select-option value='&&'>并且</a-select-option>
              <a-select-option value='||'>或者</a-select-option>
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
      // 联合条件
      obj.multi = (param: any) => {
        return (
          <div class='flex'>
            {/* 输入框 */}
            {param.data
              .filter((ele: any) => {
                return ele.type === 'input';
              })
              .map((ele: any) => {
                return (
                  <a-input
                    style='width: 200px'
                    v-model={[ele.value, 'value']}
                  />
                );
              })}
            {/* 函数 */}
            {param.data
              .filter((ele: any) => {
                return ele.type === 'fun';
              })
              .map((ele: any) => {
                return (
                  <a-input
                    show-search
                    placeholder='选择函数'
                    style='width: 200px'
                    v-model={[ele.show, 'value']}
                    onClick={() => {
                      this.funSelect(ele);
                    }}
                  ></a-input>
                );
              })}

            <a-button
              type='primary'
              onClick={() => {
                param.data.push({
                  type: 'fun',
                  value: '',
                  show: '',
                  param: [],
                });
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
      <div class='tree'>
        <div class='flex treeInfo'>
          <div class='flex1 flex ele'>
            <div class='name'>规则名称：</div>
            <div class='flex1'>
              <a-input v-model={[this.treeObj.treeName, 'value']}></a-input>
            </div>
          </div>
          <div class='flex1 flex ele'>
            <div class='name'>规则code：</div>
            <div class='flex1'>
              <a-input v-model={[this.treeObj.treeCode, 'value']}></a-input>
            </div>
          </div>
        </div>
        <a-tree
          treeData={this.tree}
          showLine={true}
          showIcon={false}
          defaultExpandAll={true}
          vSlots={this.customRender()}
        ></a-tree>
        <div class='buttons'>
          <a-button
            type='primary'
            onClick={() => {
              this.$router.push('treeList');
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
        <a-modal
          v-model={[this.dialogShow, 'visible']}
          title='选择函数'
          dialogClass='funSelect'
          onOk={() => {
            this.handleOK();
          }}
        >
          输入函数名或code：
          <a-select
            show-search
            v-model={[this.state.fun.funName, 'value']}
            placeholder='input search text'
            notFoundContent={null}
            filter-option={false}
            style='width: 200px'
            onChange={(val: string) => {
              this.handleChange(val);
            }}
            onSearch={(val: string) => {
              this.handleSearch(val);
            }}
          >
            {this.funOption.map((ele: any) => {
              return (
                <a-select-option key={ele.funcName}>
                  {ele.name}:{ele.funcName}
                </a-select-option>
              );
            })}
          </a-select>
          {this.state.fun.paramDefineList.map((ele: any) => {
            return (
              <div class='flex line'>
                <div class='name'>{ele.name}：</div>
                <a-input v-model={[ele.value, 'value']} />
              </div>
            );
          })}
        </a-modal>
      </div>
    );
  },
});
