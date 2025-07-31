// CSS 盒模型演示脚本
document.addEventListener('DOMContentLoaded', function() {
    console.log('盒模型演示已加载');
    
    // 获取两个盒子元素
    const contentBox = document.querySelector('.content-box');
    const borderBox = document.querySelector('.border-box');
    
    // 显示盒子的尺寸信息
    function showBoxInfo(element, name) {
        const rect = element.getBoundingClientRect();
        const computedStyle = window.getComputedStyle(element);
        
        console.log(`${name} 盒子信息:`);
        console.log(`- 总宽度: ${rect.width}px`);
        console.log(`- 总高度: ${rect.height}px`);
        console.log(`- 内边距: ${computedStyle.padding}`);
        console.log(`- 边框: ${computedStyle.borderWidth}`);
        console.log(`- box-sizing: ${computedStyle.boxSizing}`);
    }
    
    // 显示两个盒子的信息
    showBoxInfo(contentBox, '标准盒模型');
    showBoxInfo(borderBox, 'IE 盒模型');
    
    // 添加点击事件来显示详细信息
    contentBox.addEventListener('click', function() {
        alert('标准盒模型 (content-box)\n总宽度 = 内容宽度 + 内边距 + 边框');
    });
    
    borderBox.addEventListener('click', function() {
        alert('IE 盒模型 (border-box)\n总宽度 = 设定的宽度\n内边距和边框包含在宽度内');
    });
}); 