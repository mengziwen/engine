import { defineComponent } from 'vue';

export default defineComponent({
  render() {
    return (
      <div class='index flex'>
        <div class='flex1'>
          <a-menu
            mode='inline'
            onClick={(e: any) => {
              this.$router.push(e.key);
            }}
          >
            <a-sub-menu key='sub1' title='规则树'>
              <a-menu-item key='tree'>新建规则</a-menu-item>
              <a-menu-item key='2'>规则管理</a-menu-item>
            </a-sub-menu>
            <a-sub-menu key='sub2' title='动作树'>
              <a-menu-item key='5'>新建动作</a-menu-item>
              <a-menu-item key='6'>动作管理</a-menu-item>
            </a-sub-menu>
            <a-sub-menu key='sub4' title='方法管理'>
              <a-menu-item key='function'>新建方法</a-menu-item>
              <a-menu-item key='10'>方法管理</a-menu-item>
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
