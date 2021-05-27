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
    this.recordType = this.$route.query.recordType;
    if (this.$route.query.id) {
      this.getData();
    }
  },
  methods: {
    async getData() {
      const res = await this.$axios.get(
        `/fsmEdge/v1/componentGraph/getById/${this.$route.query.id}`,
      );
      res.data[0].cells.forEach((ele: any) => {
        if (ele.shape !== 'edge') {
          for (let i = 1; i < res.data[1].nodeList.length; i += 1) {
            const item = res.data[1].nodeList[i];
            if (ele.id === item.interfaceId) {
              ele.attrs.label.text += item.resValue || '';
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
      this.graphEvent();
      this.stencil = new Addon.Stencil({
        target: this.graph,
        title: '组件',
        stencilGraphWidth: 280,
        stencilGraphHeight: 600 - 32,
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
    graphEvent() {
      this.graph.bindKey('del', (e: KeyboardEvent) => {
        const cells = this.graph.getSelectedCells();
        this.graph.removeCells(cells);
      });
      this.graph.bindKey('ctrl+c', (e: KeyboardEvent) => {
        const cells = this.graph.getSelectedCells();
        this.graph.copy(cells);
      });
      this.graph.bindKey('ctrl+v', (e: KeyboardEvent) => {
        this.graph.paste();
      });
      this.graph.bindKey('ctrl+z', (e: KeyboardEvent) => {
        this.graph.undo();
      });
      this.graph.bindKey('ctrl+y', (e: KeyboardEvent) => {
        this.graph.redo();
      });
      this.graph.on('node:dblclick', (arg: any) => {
        this.selectedObj = arg.node;
        this.diaObj = { ...this.selectedObj.store };
        this.diaVisible = true;
      });
      this.graph.on('edge:click', (arg: any) => {
        this.selectedObj = arg.edge;
        this.diaObj = { ...this.selectedObj.store };
        const id = this.diaObj.data.source.cell;
        const node = this.graph.getCellById(id);
        if (node.store.data.data.nodeType === 'SELECTOR') {
          this.selectedObj.setData({ nodeType: 'SELECTORLine' });
          this.diaVisible = true;
        }
      });
      this.graph.on('edge:mouseenter', ({ edge }: any) => {
        edge.addTools([
          'source-arrowhead',
          'target-arrowhead',
          {
            name: 'button-remove',
            args: {
              distance: -50,
            },
          },
        ]);
      });
      this.graph.on('edge:mouseleave', ({ edge }: any) => {
        edge.removeTools();
      });
    },

    async setDiaVal(data: any) {
      const selected = this.selectedObj.store.data;
      selected.data = {
        nodeType: data.nodeType,
        ...selected.data,
        ...data,
      };
      if (selected.data.nodeType.indexOf('Line') >= 0) {
        this.selectedObj.setLabels(data.value);
      } else {
        const param = {
          interfaceId: selected.id,
          nodeCode: selected.id,
          rulesComponent: selected.data,
        };

        const res: any = await this.$axios.post(
          '/fsmEdge/v1/componentGraph/toView',
          param,
        );
        this.selectedObj.attr('label/text', res.data.viewStr?.substr(0, 6));
      }

      this.diaVisible = false;
    },

    async save() {
      const cells = this.graph.toJSON();
      const nodes = cells.cells.filter((ele: any) => {
        return ele.shape !== 'edge';
      });
      const lines = cells.cells.filter((ele: any) => {
        return ele.shape === 'edge';
      });
      const par = {
        ...this.action,
        enabled: true,
        graphInfo: cells,
        recordType: this.recordType,
        nodeList: [] as any[],
      };
      nodes.forEach((node: any) => {
        const resNode = {
          interfaceId: node.id,
          nodeCode: node.id,
          rulesComponent: { ...node.data },
          nextInterfaceIdSet: [] as any[],
        };
        // 查看是否有连接线
        lines.forEach((line: any) => {
          if (node.id === line.source.cell) {
            resNode.nextInterfaceIdSet.push(line.target.cell);
            if (line.data?.nodeType === 'SELECTORLine') {
              if (line.labels[0] === 'true') {
                resNode.rulesComponent.selectorParamList[0].trueInterfaceId =
                  line.target.cell;
              } else if (line.labels[0] === 'false') {
                resNode.rulesComponent.selectorParamList[0].falseInterfaceId =
                  line.target.cell;
              } else {
                message.error('判断走向需要指定值，请继续编辑');
              }
            }
          }
        });
        par.nodeList.push(resNode);
      });
      const res: any = await this.$axios.post(
        '/fsmEdge/v1/componentGraph/save',
        par,
      );
      if (res.code === 'M0000') {
        message.success('保存成功');
        if (this.recordType === '1') {
          this.$router.push('/actionList');
        } else {
          this.$router.push('/treeList');
        }
      } else {
        message.success('保存失败');
      }
    },
    renderDia(h: any) {
      let customComName = '';
      if (this.diaObj.data) {
        customComName = this.diaObj.data.data?.nodeType;
      }
      const customCom = customComName
        ? coms[customComName]
        : createTextVNode('');
      return (
        <a-drawer
          class='comDra'
          title='详细信息'
          placement='right'
          width='350px'
          v-model={[this.diaVisible, 'visible']}
        >
          <div>
            {this.diaObj.data ? (
              <customCom
                com={this.diaObj}
                onOk={(res: any) => {
                  this.setDiaVal(res);
                }}
              />
            ) : (
              ''
            )}
          </div>
        </a-drawer>
      );
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
              this.save();
            }}
          >
            保存
          </a-button>
        </div>
        {this.renderDia(h)}
      </div>
    );
  },
});
