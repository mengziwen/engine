import { defineComponent } from 'vue';
import ace from 'ace-builds';
import 'ace-builds/webpack-resolver';
import 'ace-builds/src-noconflict/theme-xcode'; // 默认设置的主题
import 'ace-builds/src-noconflict/mode-groovy'; // 默认设置的语言模式

import '@/assets/less/function.less';

export default defineComponent({
  data() {
    return {
      aceEditor: undefined as any,
      themePath: 'ace/theme/xcode', // 不导入 webpack-resolver，该模块路径会报错
      modePath: 'ace/mode/groovy', // 同上
      codeValue: '',
    };
  },
  mounted() {
    this.aceEditor = ace.edit(this.$refs.ace as Element, {
      maxLines: 20, // 最大行数，超过会自动出现滚动条
      minLines: 10, // 最小行数，还未到最大行数时，编辑器会自动伸缩大小
      fontSize: 12, // 编辑器内字体大小
      theme: this.themePath, // 默认设置的主题
      mode: this.modePath, // 默认设置的语言模式
      tabSize: 4, // 制表符设置为 4 个空格大小
      highlightActiveLine: false,
      value: this.codeValue,
    });
  },
  render() {
    return (
      <div>
        <div class='ace-editor' ref='ace'></div>
      </div>
    );
  },
});
