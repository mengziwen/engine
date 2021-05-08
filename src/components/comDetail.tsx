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
      ruleOption: [],
      funAll: [],
      resData: {
        value: '',
        valueType: '',
        name: '',
        paramList: [],
        funcName: '',
        resField: '', // 函数返回字段
        triggerType: '', // 触发器相关
        startTime: '',
        period: '',
        actionCodeList: [] as any[],
        eventCodeList: [] as any[],
        onDataItems: [] as any[], // 触发器结束
        rulesCode: '',
      },
    });
    const { proxy }: any = getCurrentInstance();
    const resetObj = (obj: any) => {
      for (const key in obj) {
        if (key.indexOf('List') >= 0 || key.indexOf('Items') >= 0) {
          obj[key] = [];
        } else {
          obj[key] = '';
        }
      }
    };
    watch(props, () => {
      resetObj(state.resData);
      state.resData = { ...state.resData, ...props.com.data.data };
    });
    onMounted(() => {
      resetObj(state.resData);
      state.resData = { ...state.resData, ...props.com.data.data };

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
      state.resData.triggerType = state.resData.triggerType || '2';
      const renderElement = () => {
        let dom: undefined | JSX.Element;
        if (state.resData.triggerType === '2') {
          dom = (
            <div class='triggerItem'>
              <div class='flex'>
                <div class='name'>首次延时(秒)：</div>
                <div class='flex1'>
                  <a-input
                    v-model={[state.resData.startTime, 'value']}
                  ></a-input>
                </div>
              </div>
              <div class='flex'>
                <div class='name'>周期(秒)：</div>
                <div class='flex1'>
                  <a-input v-model={[state.resData.period, 'value']}></a-input>
                </div>
              </div>
            </div>
          );
        } else if (state.resData.triggerType === '1') {
          dom = (
            <div>
              {state.resData.onDataItems.map((ele: any, index: number) => {
                return (
                  <div class='triggerItem'>
                    <div class=' flex ele'>
                      <div class='name'></div>
                      <div class='name'>设备编号(tc)：</div>
                      <div class='flex1'>
                        <a-input v-model={[ele.tc, 'value']}></a-input>
                      </div>
                    </div>
                    <div class=' flex ele'>
                      <div class='name'>属性编码(mc)：</div>
                      <div class='flex1'>
                        <a-input v-model={[ele.mc, 'value']}></a-input>
                      </div>
                      <div>
                        <a-button
                          type='danger'
                          onClick={() => {
                            state.resData.onDataItems.splice(index, 1);
                          }}
                        >
                          删除
                        </a-button>
                      </div>
                    </div>
                  </div>
                );
              })}
              <a-button
                class='buttons'
                onClick={() => {
                  state.resData.onDataItems.push({});
                }}
              >
                添加
              </a-button>
            </div>
          );
        } else if (state.resData.triggerType === '3') {
          dom = (
            <div>
              {state.resData.actionCodeList.map((ele: any, index: number) => {
                return (
                  <div class='triggerItem'>
                    <div class=' flex ele'>
                      <div class='name'>动作：</div>
                      <div class='flex1'>
                        <a-input
                          v-model={[
                            state.resData.actionCodeList[index],
                            'value',
                          ]}
                        ></a-input>
                      </div>
                      <div>
                        <a-button
                          type='danger'
                          onClick={() => {
                            state.resData.actionCodeList.splice(index, 1);
                          }}
                        >
                          删除
                        </a-button>
                      </div>
                    </div>
                  </div>
                );
              })}
              <a-button
                class='buttons'
                onClick={() => {
                  state.resData.actionCodeList.push('');
                }}
              >
                添加
              </a-button>
            </div>
          );
        } else if (state.resData.triggerType === '4') {
          dom = (
            <div>
              {state.resData.eventCodeList.map((ele: any, index: number) => {
                return (
                  <div class='triggerItem'>
                    <div class=' flex ele'>
                      <div class='name'>事件：</div>
                      <div class='flex1'>
                        <a-input
                          v-model={[
                            state.resData.eventCodeList[index],
                            'value',
                          ]}
                        ></a-input>
                      </div>
                      <div>
                        <a-button
                          type='danger'
                          onClick={() => {
                            state.resData.eventCodeList.splice(index, 1);
                          }}
                        >
                          删除
                        </a-button>
                      </div>
                    </div>
                  </div>
                );
              })}
              <a-button
                class='buttons'
                onClick={() => {
                  state.resData.eventCodeList.push('');
                }}
              >
                添加
              </a-button>
            </div>
          );
        }
        return dom;
      };
      return (
        <div>
          <div>
            类型：
            <a-radio-group v-model={[state.resData.triggerType, 'value']}>
              <a-radio-button value='2'>时间</a-radio-button>
              <a-radio-button value='4'>事件</a-radio-button>
              <a-radio-button value='3'>动作</a-radio-button>
              <a-radio-button value='1'>信号</a-radio-button>
            </a-radio-group>
          </div>
          {renderElement()}
        </div>
      );
    };
    const handleRuleSearch = async (val: string) => {
      const par: any = { searchTag: val };
      const res = await proxy.$axios.post('/fsmEdge/v1/componentGraph/search', {
        recordType: 0,
        pageNum: 1,
        pageSize: 1000,
        ...par,
      });
      state.ruleOption = res.data.list;
    };
    const handleRuleChange = (val: string) => {
      state.ruleOption.forEach((element: any) => {
        if (element.recordCode === val) {
          state.resData.name = element.name;
          state.resData.rulesCode = element.recordCode;
        }
      });
    };
    const renderRules = () => {
      return (
        <div>
          输入规则名称：
          <a-select
            show-search
            v-model={[state.resData.rulesCode, 'value']}
            placeholder='input search text'
            notFoundContent={null}
            filter-option={false}
            style='width: 200px'
            onChange={(val: string) => {
              handleRuleChange(val);
            }}
            onSearch={(val: string) => {
              handleRuleSearch(val);
            }}
          >
            {state.ruleOption.map((ele: any) => {
              return (
                <a-select-option key={ele.recordCode}>
                  {ele.name}:{ele.recordCode}
                </a-select-option>
              );
            })}
          </a-select>
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
        case 'RULES':
          dom = renderRules();
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
