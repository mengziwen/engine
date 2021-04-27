import { defineComponent, reactive, ref } from 'vue';
import { Graph, Shape, Addon } from '@antv/x6';
import fac from '@/util/component';
import comDetail from '@/components/comDetail';

import '@/assets/less/action.less';

export default defineComponent({
  components: {
    comDetail,
  },
  data() {
    return {
      graph: undefined as any,
      stencil: undefined as any,
      action: {
        name: '',
        des: '',
      },
      diaVisible: false,
      selectedObj: undefined as any,
      diaObj: {
        name: '',
      },
    };
  },
  mounted() {
    this.initGraph();
  },
  methods: {
    initGraph() {
      this.graph = new Graph({
        grid: true,
        snapline: true,
        container: document.getElementById('graph')!,
        background: { color: '#C4E1FF' },
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
          connector: 'rounded',
          connectionPoint: 'boundary',
          router: 'metro',
          createEdge() {
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
        },
      });
      this.graphEvent();
      this.graph.addNode(fac.getSquare(100, 100));
      this.graph.addNode(fac.getCircle(300, 100));
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
        this.selectedObj = arg.node.store;
        this.diaObj = { ...this.diaObj, ...this.selectedObj };
        this.diaVisible = true;
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
    setDiaVal(res: any) {
      this.selectedObj.data = res;
      this.selectedObj.attr('label/text', this.diaObj.name);
      this.diaVisible = false;
    },
    save() {
      const str = this.graph.toJSON();
      console.log(str);
    },
    renderDia() {
      return (
        <a-drawer
          class='comDra'
          title='详细信息'
          placement='right'
          v-model={[this.diaVisible, 'visible']}
        >
          <div>
            <comDetail
              com={this.diaObj}
              onOk={(res: any) => {
                this.setDiaVal(res);
              }}
            />
          </div>
        </a-drawer>
      );
    },
  },
  render() {
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
        {this.renderDia()}
      </div>
    );
  },
});
