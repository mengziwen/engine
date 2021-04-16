import { defineComponent, reactive, ref } from 'vue';
import { Graph, Shape, Addon } from '@antv/x6';
import fac from '@/util/component';

import '@/assets/less/action.less';

export default defineComponent({
  data() {
    return {
      graph: undefined as any,
      stencil: undefined as any,
      action: {
        name: '',
        des: '',
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
        container: document.getElementById('graph')!,
        background: { color: '#C4E1FF' },
        connecting: {
          snap: true,
          allowBlank: false,
          allowLoop: false,
          highlight: true,
          connector: 'rounded',
          connectionPoint: 'boundary',
          router: {
            name: 'er',
            args: {
              direction: 'H', // 上下用V
            },
          },
          createEdge() {
            return new Shape.Edge({
              attrs: {
                line: {
                  stroke: '#a0a0a0',
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
      this.graph.on('edge:mouseenter', ({ edge }: any) => {
        edge.addTools([
          'source-arrowhead',
          'target-arrowhead',
          {
            name: 'button-remove',
            args: {
              distance: -30,
            },
          },
        ]);
      });

      this.graph.on('edge:mouseleave', ({ edge }: any) => {
        edge.removeTools();
      });
      this.graph.addNode(fac.getRect(100, 100));
      this.graph.addNode(fac.getRectRadius(300, 100));
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
  },
  render() {
    return (
      <div class='action'>
        <div class='flex info'>
          <div class='flex1 flex ele'>
            <div class='name'>动作名称：</div>
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
      </div>
    );
  },
});
