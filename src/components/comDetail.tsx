import {
  defineComponent,
  reactive,
  onMounted,
  getCurrentInstance,
  watch,
} from 'vue';

export default defineComponent({
  props: ['com'],
  setup(props: any, context) {
    const state = reactive({
      fun: {},
      funOption: [],
      funAll: [],
      resData: {
        value: '',
        valueType: '',
        name: '',
        paramList: [],
        funcName: '',
        resField: '',
      },
    });
    const resetObj = (obj: any) => {
      for (const key in obj) {
        obj[key] = '';
      }
    };
    watch(props, () => {
      resetObj(state.resData);
      state.resData = { ...state.resData, ...props.com.data.data };
    });
    onMounted(() => {
      resetObj(state.resData);
      state.resData = { ...state.resData, ...props.com.data.data };
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
          state.resData.name = element.name;
          state.resData.funcName = element.funcName;
          state.resData.paramList = element.paramDefineList || [];
          state.resData.paramList.forEach((par: any) => {
            par.paramCode = par.defineCode;
          });
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
      context.emit('ok', state.resData);
    };
    const renderFun = () => {
      return (
        <div>
          输入函数名或code：
          <a-select
            show-search
            v-model={[state.resData.funcName, 'value']}
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
          {state.resData.paramList.map((ele: any) => {
            return (
              <div class='flex line'>
                <div class='name'>{ele.name}：</div>
                <div class='flex1'>
                  <a-input v-model={[ele.value, 'value']} />
                </div>
              </div>
            );
          })}
          <div class='flex line'>
            <div class='name'>返回字段：</div>
            <div class='flex1'>
              <a-input v-model={[state.resData.resField, 'value']} />
            </div>
          </div>
          <div class='flex line'>
            <div class='name'>返回类型：</div>
            <div class='flex1'>
              <a-input v-model={[state.resData.valueType, 'value']} />
            </div>
          </div>
        </div>
      );
    };
    const renderConstant = () => {
      return (
        <div>
          <div>
            常量值：
            <a-input v-model={[state.resData.value, 'value']} />
          </div>
          <div>
            常量类型：
            <a-input v-model={[state.resData.valueType, 'value']} />
          </div>
        </div>
      );
    };
    const renderOperator = () => {
      return (
        <div>
          <div>
            运算符：
            <a-input v-model={[state.resData.value, 'value']} />
          </div>
        </div>
      );
    };
    const renderTrigger = () => {
      return (
        <div>
          <div>
            类型：
            <a-input v-model={[state.resData.value, 'value']} />
          </div>
        </div>
      );
    };

    const renderDetail = () => {
      let dom: JSX.Element = '';
      switch (props.com.data.data.nodeType) {
        case 'FUNCTION':
          dom = renderFun();
          break;
        case 'CONSTANT':
          dom = renderConstant();
          break;
        case 'OPERATOR':
          dom = renderOperator();
          break;
        case 'TRIGGER':
          dom = renderTrigger();
          break;
        default:
          dom = '';
      }
      return dom;
    };
    return () => (
      <div>
        {renderDetail()}
        <div>
          <div class='buttons'>
            <a-button
              type='primary'
              onClick={() => {
                handleOk();
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
