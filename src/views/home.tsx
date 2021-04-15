import { defineComponent } from 'vue';

export default defineComponent({
  render() {
    return (
      <div class='index flex'>
        <div class='menu' style='flex-basis:300px'>
          <a-menu
            mode='inline'
            onClick={(e: any) => {
              this.$router.push(e.key);
            }}
          >
            <a-sub-menu key='sub4' title='方法管理'>
              <a-menu-item key='functionList'>方法管理</a-menu-item>
            </a-sub-menu>
            <a-sub-menu key='sub1' title='规则树'>
              <a-menu-item key='treeList'>规则管理</a-menu-item>
            </a-sub-menu>
            <a-sub-menu key='sub2' title='动作树'>
              <a-menu-item key='action'>新建动作</a-menu-item>
              <a-menu-item key='6'>动作管理</a-menu-item>
            </a-sub-menu>
            <a-menu-item key='7'>日志</a-menu-item>
          </a-menu>
        </div>
        <div class='flex5'>
          <routerView />
        </div>
      </div>
    );
  },
});
