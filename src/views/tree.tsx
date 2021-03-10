import { defineComponent } from 'vue';

export default defineComponent({
  data() {
    return {
      tree: [
        {
          title: 'parent 1',
          key: '0-0',
          slots: { title: 'node' },
          children: [
            {
              title: 'parent 1-1',
              key: '0-0-1',
              slots: { title: 'node' },
            },
            {
              key: '0-0-2',
              data: { value: '324' },
              slots: { title: 'node' },
            },
          ],
        },
      ],
    };
  },
  methods: {
    customRender() {
      const obj: any = {};
      obj.node = (param: any) => {
        console.log(param);
        return (
          <div class='flex'>
            <a-select style='width: 120px'>
              <a-select-option value='lucy'>Lucy</a-select-option>
            </a-select>
            <a-button type='primary'>添加</a-button>
          </div>
        );
      };
      return obj;
    },
  },
  render() {
    return (
      <div class='index'>
        <a-tree tree-data={this.tree} vSlots={this.customRender()}></a-tree>
      </div>
    );
  },
});
