import { defineComponent } from 'vue';

export default defineComponent({
  render() {
    return (
      <div class='index flex'>
        <div class='menu' style='flex:0 0 300px'>
          <a-menu
            mode='inline'
            onClick={(e: any) => {
              this.$router.push(e.key);
            }}
          >
            <a-sub-menu key='sub4' title='函数管理'>
              <a-menu-item key='functionList'>函数配置</a-menu-item>
            </a-sub-menu>
            <a-sub-menu key='sub1' title='规则管理'>
              <a-menu-item key='treeList'>规则配置</a-menu-item>
            </a-sub-menu>
            <a-sub-menu key='sub2' title='决策管理'>
              <a-menu-item key='actionList'>决策配置</a-menu-item>
            </a-sub-menu>
            <a-sub-menu key='sub3' title='结果查看'>
              <a-menu-item key='logList'>运行日志</a-menu-item>
            </a-sub-menu>
          </a-menu>
        </div>
        <div class='flex5'>
          <routerView />
        </div>
      </div>
    );
  },
});
