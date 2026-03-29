(function() {
  document.querySelectorAll('.tab-btn').forEach(function(btn) {
    btn.addEventListener('click', function() {
      document.querySelectorAll('.tab-btn').forEach(function(b) { b.classList.remove('active'); });
      document.querySelectorAll('.tab-content').forEach(function(c) { c.classList.remove('active'); });
      btn.classList.add('active');
      document.getElementById('tab-' + btn.dataset.tab).classList.add('active');
    });
  });

  function log(outputId, message) {
    var box = document.getElementById(outputId);
    var entry = document.createElement('div');
    entry.className = 'entry';
    entry.textContent = message;
    box.appendChild(entry);
    box.scrollTop = box.scrollHeight;
  }
  function clearLog(outputId) { document.getElementById(outputId).innerHTML = ''; }

  // style.property
  function setColor() {
    var box = document.getElementById('demo-style-box');
    box.style.backgroundColor = '#2ecc71';
    box.style.color = '#fff';
    clearLog('output-style');
    log('output-style', 'set: backgroundColor = #2ecc71, color = #fff');
  }
  function setSize() {
    var box = document.getElementById('demo-style-box');
    box.style.width = '180px';
    box.style.height = '180px';
    clearLog('output-style');
    log('output-style', 'set: width = 180px, height = 180px');
  }
  function resetStyle() {
    var box = document.getElementById('demo-style-box');
    box.style.cssText = '';
    clearLog('output-style');
    log('output-style', 'reset: cssText cleared');
  }
  function applyCustomStyle() {
    var box = document.getElementById('demo-style-box');
    var bg = document.getElementById('input-bg').value;
    var fs = document.getElementById('input-fs').value;
    box.style.backgroundColor = bg;
    box.style.fontSize = fs;
    clearLog('output-style');
    log('output-style', 'set: backgroundColor = ' + bg + ', fontSize = ' + fs);
  }

  // cssText
  function setCssTextBatch() {
    var box = document.getElementById('demo-csstext-box');
    box.style.cssText = 'width: 200px; height: 200px; background: linear-gradient(135deg, #667eea, #764ba2); color: white; border-radius: 16px; display: flex; align-items: center; justify-content: center;';
    clearLog('output-csstext');
    log('output-csstext', 'batch set via cssText');
  }
  function getCssText() {
    var box = document.getElementById('demo-csstext-box');
    clearLog('output-csstext');
    log('output-csstext', 'current cssText:');
    log('output-csstext', box.style.cssText || '(empty)');
  }
  function resetStyle2() {
    var box = document.getElementById('demo-csstext-box');
    box.style.cssText = '';
    clearLog('output-csstext');
    log('output-csstext', 'reset');
  }
  function applyCssText() {
    var box = document.getElementById('demo-csstext-box');
    var text = document.getElementById('csstext-input').value;
    box.style.cssText = text;
    clearLog('output-csstext');
    log('output-csstext', 'applied cssText: ' + text.substring(0, 60));
  }

  // setProperty
  function setPropertyDemo() {
    var box = document.getElementById('demo-setproperty-box');
    box.style.setProperty('background-color', '#9b59b6');
    box.style.setProperty('color', '#fff');
    clearLog('output-setproperty');
    log('output-setproperty', 'setProperty: background-color = #9b59b6');
    document.getElementById('setproperty-info').textContent = 'Normal set -可以被覆盖';
  }
  function setPropertyImportant() {
    var box = document.getElementById('demo-setproperty-box');
    box.style.setProperty('opacity', '0.5', 'important');
    clearLog('output-setproperty');
    log('output-setproperty', 'setProperty with !important: opacity = 0.5');
    document.getElementById('setproperty-info').textContent = 'important - 最高优先级';
  }
  function resetStyle3() {
    var box = document.getElementById('demo-setproperty-box');
    box.style.cssText = '';
    clearLog('output-setproperty');
    document.getElementById('setproperty-info').textContent = 'Click buttons to compare';
  }
  function applySetProperty() {
    var box = document.getElementById('demo-setproperty-box');
    var name = document.getElementById('prop-name').value;
    var value = document.getElementById('prop-value').value;
    var important = document.getElementById('prop-important').checked;
    box.style.setProperty(name, value, important ? 'important' : '');
    clearLog('output-setproperty');
    log('output-setproperty', "setProperty('" + name + "', '" + value + "', '" + (important ? 'important' : '') + "')");
  }

  // getPropertyValue
  function getPropertyDemo() {
    var box = document.getElementById('demo-getproperty-box');
    clearLog('output-getproperty');
    log('output-getproperty', 'inline properties:');
    for (var i = 0; i < box.style.length; i++) {
      var prop = box.style.item(i);
      log('output-getproperty', prop + ': ' + box.style.getPropertyValue(prop));
    }
    if (box.style.length === 0) log('output-getproperty', '(no inline styles)');
  }
  function getAllProperties() {
    var box = document.getElementById('demo-getproperty-box');
    clearLog('output-getproperty');
    log('output-getproperty', 'for...of iteration:');
    for (const prop of box.style) {
      log('output-getproperty', prop + ': ' + box.style.getPropertyValue(prop));
    }
    log('output-getproperty', 'total: ' + box.style.length);
  }
  function queryProperty() {
    var box = document.getElementById('demo-getproperty-box');
    var prop = document.getElementById('query-prop').value;
    var val = box.style.getPropertyValue(prop);
    clearLog('output-getproperty');
    log('output-getproperty', "getPropertyValue('" + prop + "') = '" + val + "'");
  }
  function queryPropertyPreset(p) {
    document.getElementById('query-prop').value = p;
    queryProperty();
  }

  // removeProperty
  var pendingRemove = '';
  function removePropertyDemo() {
    var box = document.getElementById('demo-removeproperty-box');
    var val = box.style.removeProperty('opacity');
    clearLog('output-removeproperty');
    log('output-removeproperty', "removeProperty('opacity') returned: '" + val + "'");
  }
  function removePropertyBg() {
    var box = document.getElementById('demo-removeproperty-box');
    var val = box.style.removeProperty('background-color');
    clearLog('output-removeproperty');
    log('output-removeproperty', "removeProperty('background-color') returned: '" + val + "'");
  }
  function resetStyle4() {
    var box = document.getElementById('demo-removeproperty-box');
    box.style.cssText = '';
    pendingRemove = '';
    document.getElementById('pending-remove').textContent = 'none';
    clearLog('output-removeproperty');
  }
  function removePropSelect(prop) {
    pendingRemove = prop;
    document.getElementById('pending-remove').textContent = prop;
  }
  function applyRemoveProperty() {
    if (!pendingRemove) return;
    var box = document.getElementById('demo-removeproperty-box');
    var val = box.style.removeProperty(pendingRemove);
    clearLog('output-removeproperty');
    log('output-removeproperty', "removeProperty('" + pendingRemove + "') = '" + val + "'");
    pendingRemove = '';
    document.getElementById('pending-remove').textContent = 'none';
  }

  // getComputedStyle
  function getComputedDemo() {
    var box = document.getElementById('demo-computed-box');
    var computed = window.getComputedStyle(box);
    var grid = document.getElementById('computed-grid');
    document.getElementById('computed-results').style.display = 'block';
    grid.innerHTML = '';
    var props = ['width', 'height', 'backgroundColor', 'color', 'fontSize', 'borderRadius', 'padding', 'display'];
    props.forEach(function(p) {
      var item = document.createElement('div');
      item.className = 'computed-item';
      item.innerHTML = '<div class="label">' + p + '</div><div class="value">' + computed[p] + '</div>';
      grid.appendChild(item);
    });
    clearLog('output-computed');
    log('output-computed', 'computed style:');
    props.forEach(function(p) { log('output-computed', p + ': ' + computed[p]); });
  }
  function getPseudoElement() {
    var box = document.getElementById('demo-computed-box');
    var computed = window.getComputedStyle(box, '::before');
    clearLog('output-computed');
    log('output-computed', '::before pseudo element:');
    log('output-computed', 'display: ' + computed.display);
    log('output-computed', 'content: ' + computed.content);
  }

  // getBoundingClientRect
  function updateRectDisplay() {
    var box = document.getElementById('demo-rect-box');
    var rect = box.getBoundingClientRect();
    document.getElementById('rect-top').textContent = rect.top.toFixed(1);
    document.getElementById('rect-left').textContent = rect.left.toFixed(1);
    document.getElementById('rect-right').textContent = rect.right.toFixed(1);
    document.getElementById('rect-bottom').textContent = rect.bottom.toFixed(1);
    document.getElementById('rect-width').textContent = rect.width.toFixed(1);
    document.getElementById('rect-height').textContent = rect.height.toFixed(1);
  }
  function getBoundingDemo() {
    var box = document.getElementById('demo-rect-box');
    var rect = box.getBoundingClientRect();
    clearLog('output-rect');
    log('output-rect', 'getBoundingClientRect():');
    log('output-rect', 'top: ' + rect.top + ', left: ' + rect.left);
    log('output-rect', 'right: ' + rect.right + ', bottom: ' + rect.bottom);
    log('output-rect', 'width: ' + rect.width + ', height: ' + rect.height);
    updateRectDisplay();
  }
  function resetRect() {
    var box = document.getElementById('demo-rect-box');
    box.style.left = '20px';
    box.style.top = '20px';
    clearLog('output-rect');
    log('output-rect', 'position reset to 20px, 20px');
    updateRectDisplay();
  }
  var dragging = false;
  function startDrag() {
    var box = document.getElementById('demo-rect-box');
    var viewport = document.getElementById('rect-viewport');
    dragging = true;
    box.style.cursor = 'grabbing';
    clearLog('output-rect');
    log('output-rect', 'Drag enabled - drag the box');
    function onMove(e) {
      if (!dragging) return;
      var clientX = e.clientX || (e.touches && e.touches[0].clientX);
      var clientY = e.clientY || (e.touches && e.touches[0].clientY);
      var vpRect = viewport.getBoundingClientRect();
      var boxRect = box.getBoundingClientRect();
      var newLeft = clientX - vpRect.left - boxRect.width / 2;
      var newTop = clientY - vpRect.top - boxRect.height / 2;
      newLeft = Math.max(0, Math.min(newLeft, vpRect.width - boxRect.width));
      newTop = Math.max(0, Math.min(newTop, vpRect.height - boxRect.height));
      box.style.left = newLeft + 'px';
      box.style.top = newTop + 'px';
      updateRectDisplay();
    }
    function onUp() {
      dragging = false;
      box.style.cursor = 'move';
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
    }
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
  }
  updateRectDisplay();
})();
