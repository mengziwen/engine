import { defineComponent, reactive, onMounted, getCurrentInstance } from 'vue';

export default defineComponent({
  props: ['com'],
  setup(props: any, context) {
    const resData: any = {};
    const state = reactive({
      fun: { name: '', id: '', paramDefineList: [], funName: '' },
      funOption: [],
      funAll: [],
    });
    onMounted(() => {
      const { proxy }: any = getCurrentInstance();
      proxy.$axios
        .get('/fsmEdge/v1/define/getAllMethodDefinition')
        .then((res: any) => {
          state.funAll = res.data;
        });
    });

    const handleSearch = (val: string) => {
      const arr = state.funAll.filter((ele: any) => {
        return (
          (ele.name && ele.name.indexOf(val) >= 0) ||
          ele.funcName.indexOf(val) >= 0
        );
      });
      state.funOption = arr;
    };
    const handleChange = (val: string) => {
      state.funAll.forEach((element: any) => {
        if (element.funcName === val) {
          state.fun = element;
          state.fun.funName = element.funcName;
        }
      });
      const arr = state.funAll.filter((ele: any) => {
        return (
          (ele.name && ele.name.indexOf(val) >= 0) ||
          ele.funcName.indexOf(val) >= 0
        );
      });
      state.funOption = arr;
    };
    const handleOk = () => {
      context.emit('ok', resData);
    };
    const renderFun = () => {
      return (
        <div>
          输入函数名或code：
          <a-select
            show-search
            v-model={[state.fun.funName, 'value']}
            placeholder='input search text'
            notFoundContent={null}
            filter-option={false}
            style='width: 200px'
            onChange={(val: string) => {
              handleChange(val);
            }}
            onSearch={(val: string) => {
              handleSearch(val);
            }}
          >
            {state.funOption.map((ele: any) => {
              return (
                <a-select-option key={ele.funcName}>
                  {ele.name}:{ele.funcName}
                </a-select-option>
              );
            })}
          </a-select>
          {state.fun.paramDefineList.map((ele: any) => {
            return (
              <div class='flex line'>
                <div class='name'>{ele.name}：</div>
                <a-input v-model={[ele.value, 'value']} />
              </div>
            );
          })}
        </div>
      );
    };
    const renderConstant = () => {
      return (
        <div>
          <div>
            常量值：
            <a-input v-model={resData.value} />
          </div>
          <div>
            常量类型：
            <a-input v-model={resData.type} />
          </div>
        </div>
      );
    };
    return {
      renderFun,
      renderConstant,
      handleOk,
      state,
    };
  },
  render() {
    let dom: JSX.Element = '';
    switch (this.com.data.data.type) {
      case 'fun':
        dom = this.renderFun();
        break;
      case 'CONSTANT':
        dom = this.renderConstant();
        break;
      default:
        dom = '';
    }
    return (
      <div>
        {dom}
        <div>
          <div class='buttons'>
            <a-button
              type='primary'
              onClick={() => {
                this.handleOk();
              }}
            >
              确定
            </a-button>
          </div>
        </div>
      </div>
    );
  },
});
