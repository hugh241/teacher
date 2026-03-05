// directives/numberOnly.js
export default {
  inserted(el) {
    const handleInput = (event) => {
      const value = event.target.value;
      if (!/^\d*$/.test(value)) {
        event.target.value = value.replace(/\D/g, '');
        // 手动触发 input 事件以更新 v-model
        event.target.dispatchEvent(new Event('input'));
      }
    };

    // 监听 input 事件
    el.addEventListener('input', handleInput);

    // 监听 paste 事件
    el.addEventListener('paste', (event) => {
      const clipboardData = event.clipboardData || window.clipboardData;
      const pastedData = clipboardData.getData('Text');
      if (!/^\d*$/.test(pastedData)) {
        event.preventDefault();
        const newValue = el.value + pastedData.replace(/\D/g, '');
        el.value = newValue;
        // 手动触发 input 事件以更新 v-model
        el.dispatchEvent(new Event('input'));
      }
    });
  },
  // 当绑定元素的父组件更新时
  update(el) {
    if (typeof el.value === 'string') {
      const value = el.value;
      if (!/^\d*$/.test(value)) {
        el.value = value.replace(/\D/g, '');
      }
    } else {
      el.value = ''; // 如果 el.value 不是字符串，则设置为空字符串
    }
  }
};
