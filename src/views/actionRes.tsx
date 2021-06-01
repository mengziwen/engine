import {
  createTextVNode,
  createVNode,
  defineComponent,
  reactive,
  ref,
} from 'vue';
import { Graph, Shape, Addon } from '@antv/x6';
import { message } from 'ant-design-vue';
import fac from '@/util/component';
import FUNCTION from '@/components/graphCom/FUNCTION';
import CONSTANT from '@/components/graphCom/CONSTANT';
import OPERATOR from '@/components/graphCom/OPERATOR';
import TRIGGER from '@/components/graphCom/TRIGGER';
import RULES from '@/components/graphCom/RULES';
import LOGIC from '@/components/graphCom/LOGIC';
import SELECTOR from '@/components/graphCom/SELECTOR';
import SELECTORLine from '@/components/graphCom/SELECTORLine';

import '@/assets/less/action.less';

const coms: any = {
  FUNCTION,
  CONSTANT,
  OPERATOR,
  TRIGGER,
  RULES,
  LOGIC,
  SELECTOR,
  SELECTORLine,
};
export default defineComponent({
  components: {},
  data() {
    return {
      recordType: 0 as any, // 0规则 1决策
      graph: undefined as any,
      stencil: undefined as any,
      action: {
        name: '',
        recordCode: '',
        moduleCode: '',
        des: '',
      },
      diaVisible: false,
      selectedObj: undefined as any,
      diaObj: {
        name: '',
      } as any,
    };
  },
  mounted() {
    this.initGraph();
    this.getData();
  },
  methods: {
    async getData() {
      const res = await this.$axios.get(
        `/fsmEdge/v1/componentGraph/logDetails/${this.$route.query.id}/${this.$route.query.createTime}`,
      );
      res.data[0].cells.forEach((ele: any) => {
        // 暂时只有函数
        if (ele.shape !== 'edge') {
          for (let i = 1; i < res.data[1].nodeList.length; i += 1) {
            const item = res.data[1].nodeList[i];
            if (ele.id === item.interfaceId) {
              let borderColor = 'grey';
              let resContent = '';
              switch (item.nodeStatus) {
                case 0:
                  resContent = item.resContent;
                  borderColor = 'green';
                  break;
                case 1:
                  resContent = item.errorMsg;
                  borderColor = 'red';
                  break;
                default:
                  borderColor = 'blue';
              }
              ele.attrs.body.stroke = borderColor;
              ele.attrs.body.strokeWidth = 2;
              ele.size = { width: 200, height: 150 };
              ele.attrs.label.text = item.viewStr;
              if (item.argContent) {
                delete item.argContent['@type'];
              }

              ele.attrs.argContent = {
                text: JSON.stringify(item.argContent || ''),
                refY: 0.2,
              };
              ele.attrs.resContent = {
                text: JSON.stringify(resContent),
                refY: 0.7,
              };
            }
          }
        }
      });
      this.graph.fromJSON(res.data[0].cells);
      [, this.action] = res.data;
    },
    initGraph() {
      this.graph = new Graph({
        grid: true,
        // 对齐线
        snapline: true,
        // 节点缩放
        resizing: true,
        container: document.getElementById('graph')!,
        background: { color: '#ffffff' },
        // 禁止出画布
        translating: {
          restrict: true,
        },
        keyboard: true,
        clipboard: true,
        history: true,
        interacting: false,
        selecting: {
          enabled: true,
          className: 'x6-widget-selection-selected',
          showNodeSelectionBox: true,
        },
        connecting: {
          snap: true,
          allowBlank: false,
          allowLoop: false,
          highlight: true,
          connector: 'normal',
          connectionPoint: 'boundary',
          router: 'manhattan',
          createEdge(arg) {
            return new Shape.Edge({
              attrs: {
                line: {
                  // stroke: '#a0a0a0',
                  strokeWidth: 1,
                  targetMarker: {
                    name: 'classic',
                    size: 7,
                  },
                },
              },
            });
          },
          validateConnection(arg) {
            return true;
          },
        },
      });
      this.stencil = new Addon.Stencil({
        target: this.graph,
        title: '组件',
        stencilGraphWidth: 280,
        stencilGraphHeight: 800 - 32,
      });
      const stencilContainer = document.querySelector('#module');
      stencilContainer!.appendChild(this.stencil.container);
      this.stencil.load([
        fac.getRectRadius(),
        fac.getRhombus(),
        fac.getRect(),
        fac.getTrapezoid(),
        fac.getEllipse(),
        fac.getCircle(),
        fac.getSquare(),
        fac.getTriangle(),
      ]);
    },
  },
  render(h: any) {
    return (
      <div class='action'>
        <div class='flex info'>
          <div class='flex1 flex ele'>
            <div class='name'>名称：</div>
            <div class='flex1'>
              <a-input v-model={[this.action.name, 'value']}></a-input>
            </div>
          </div>
          <div class='flex1 flex ele'>
            <div class='name'>code：</div>
            <div class='flex1'>
              <a-input v-model={[this.action.recordCode, 'value']}></a-input>
            </div>
          </div>
          <div class='flex1 flex ele'>
            <div class='name'>模块：</div>
            <div class='flex1'>
              <a-input v-model={[this.action.moduleCode, 'value']}></a-input>
            </div>
          </div>
          <div class='flex1 flex ele'>
            <div class='name'>描述：</div>
            <div class='flex1'>
              <a-input v-model={[this.action.des, 'value']}></a-input>
            </div>
          </div>
        </div>
        <div class='flex drag'>
          <div id='module'></div>
          <div id='graph'></div>
        </div>
        <div class='buttons'>
          <a-button
            type='primary'
            onClick={() => {
              this.$router.push('logList');
            }}
          >
            返回
          </a-button>
        </div>
      </div>
    );
  },
});
