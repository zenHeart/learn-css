# CSS 灞傚彔涓婁笅鏂囦笌灞傚彔椤哄簭

## 闂鑳屾櫙

涓轰粈涔堣缃簡 `z-index` 浠嶇劧琚叾浠栧厓绱犻伄鎸★紵杩欐槸 CSS 灞傚彔锛圫tacking锛夋満鍒剁殑鏍稿績闂銆?
## 灞傚彔涓婁笅鏂囷紙Stacking Context锛?
### 浠€涔堟槸灞傚彔涓婁笅鏂?
灞傚彔涓婁笅鏂囨槸涓€涓笁缁存蹇碉紝浠ｈ〃鍏冪礌鍦?HTML 鏂囨。骞抽潰涔嬪鐨勭涓夌淮搴︼紙z 杞达級涓婄殑鍫嗗彔椤哄簭銆?
### 鍒涘缓灞傚彔涓婁笅鏂囩殑鏉′欢

浠ヤ笅 CSS 灞炴€т細鍒涘缓鏂扮殑灞傚彔涓婁笅鏂囷細

| 灞炴€?| 绀轰緥鍊?|
|-----|-------|
| `position: fixed` / `sticky` | 浠绘剰鍊?|
| `position: relative/absolute` + `z-index` | 闈?`auto` |
| `z-index` | 闈?`auto` |
| `opacity` | < 1 |
| `transform` | 闈?`none` |
| `filter` | 闈?`none` |
| `perspective` | 闈?`none` |
| `isolation` | `isolate` |
| `mix-blend-mode` | 闈?`normal` |
| `clip-path` / `mask` | 闈?`none` |
| `contain` | `layout`/`paint`/`strict`/`content` |

```css
/* 杩欎簺閮戒細鍒涘缓灞傚彔涓婁笅鏂?*/
.parent {
  opacity: 0.99;      /* 鉁?*/
  transform: scale(1); /* 鉁?*/
  z-index: 1;          /* 鉁擄紙褰?position 涓?relative/absolute锛?/
  position: relative;  /* 鉁擄紙涓?z-index 缁勫悎锛?/
}
```

## 灞傚彔椤哄簭锛圫tacking Order锛?
### 浠庝綆鍒伴珮鐨勫畬鏁磋鍒?
| 灞傜骇 | 璇存槑 |
|-----|------|
| 1 | 灞傚彔涓婁笅鏂?background 鍜?border |
| 2 | 璐?z-index 鐨勫瓙灞傚彔涓婁笅鏂囷紙浠庡皬鍒板ぇ锛墊
| 3 | 鍧楃骇鐩掞紙block-level boxes锛墊
| 4 | 娴姩鐩掞紙float boxes锛墊
| 5 | 琛屽唴鐩掞紙inline boxes锛墊
| 6 | z-index: 0 鐨勫瓙灞傚彔涓婁笅鏂?|
| 7 | 姝?z-index 鐨勫瓙灞傚彔涓婁笅鏂囷紙浠庡皬鍒板ぇ锛墊

### 鍥剧ず

```
                鈹屸攢鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹?  z-index: +N   鈹? 姝?z-index     鈹? 鈫?鏈€楂樺眰
                鈹溾攢鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹?  z-index: 0   鈹? z-index: 0     鈹?                鈹溾攢鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹?  鍧楃骇/琛屽唴鐩?  鈹? block/inline  鈹?                鈹溾攢鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹?  璐?z-index    鈹? 璐?z-index     鈹? 鈫?鏈€浣庡眰
                鈹斺攢鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹?```

## z-index 鍦ㄥ眰鍙犱笂涓嬫枃涓殑姣旇緝

### 鍏抽敭瑙勫垯

**z-index 鍙湪鍚屼竴涓眰鍙犱笂涓嬫枃鍐呮瘮杈冦€備笉鍚屽眰鍙犱笂涓嬫枃涔嬮棿锛岀埗鍏冪礌鐨勫眰鍙犻『搴忓喅瀹氫簡瀛愬厓绱犵殑灞傚彔椤哄簭銆?*

```html
<!-- 绀轰緥锛氫负浠€涔?z-index: 999 浠嶇劧琚伄鎸?-->
<div class="outer-1" style="z-index: 1">
  <div class="inner-1" style="z-index: 999">A</div>
</div>
<div class="outer-2" style="z-index: 0">
  <div class="inner-2" style="z-index: 1">B</div>
</div>
```

**缁撴灉**锛欰锛坺-index: 999锛変細琚?B锛坺-index: 1锛夐伄鎸★紝鍥犱负 A 鐨勭埗鍏冪礌 `outer-1` 鐨勫眰鍙犻『搴忔槸 1锛堣儗鏅眰锛夛紝鑰?B 鐨勭埗鍏冪礌 `outer-2` 鐨勫眰鍙犻『搴忔槸 0锛堝潡绾у眰锛夈€?
### 瑙ｅ喅鏂规

```css
/* 鏂规 1锛氭彁鍗囩埗鍏冪礌鐨?z-index */
.outer-1 {
  position: relative;
  z-index: 2; /* 蹇呴』姣?outer-2 楂?*/
}
.inner-1 {
  z-index: 999;
}

/* 鏂规 2锛氬皢瀛愬厓绱犳斁鍒版牴灞傚彔涓婁笅鏂?*/
body {
  position: relative;
  z-index: 1;
}
```

## 甯歌灞傚彔闂

### 闂 1锛氳缃簡 z-index 浠嶇劧琚伄鎸?
```html
<div class="modal" style="z-index: 1000">
  <button>鐐瑰嚮鎴?/button>
</div>
<div class="dropdown" style="z-index: 500">
  <!-- 琚?modal 閬尅 -->
</div>
```

**鍘熷洜**锛歚modal` 鍜?`dropdown` 鍙兘澶勪簬涓嶅悓鐨勫眰鍙犱笂涓嬫枃銆?
**瑙ｅ喅**锛氱‘淇濆畠浠湪鍚屼竴涓眰鍙犱笂涓嬫枃锛屾垨鎻愬崌鐖跺厓绱犵殑 z-index銆?
### 闂 2锛歱osition: relative + z-index 闂

```css
/* 杩欑鎯呭喌浼氬垱寤哄眰鍙犱笂涓嬫枃 */
.a {
  position: relative;
  z-index: 1;
}

/* z-index: auto 涓嶄細鍒涘缓鏂扮殑灞傚彔涓婁笅鏂?*/
.b {
  position: relative;
  z-index: auto;
}
```

### 闂 3锛歰pacity 涓?z-index

```css
/* opacity < 1 浼氬垱寤哄眰鍙犱笂涓嬫枃 */
.parent {
  opacity: 0.99; /* 鍒涘缓鏂扮殑灞傚彔涓婁笅鏂?*/
  position: relative;
}

.child {
  z-index: 9999; /* 鍙湪杩欎釜灞傚彔涓婁笅鏂囧唴鏈夋晥 */
}
```

## flexbox/grid 涓殑 z-index

鍦?flex 鎴?grid 瀹瑰櫒涓紝瀛愬厓绱犵殑 `z-index` 涔熶細鍒涘缓灞傚彔涓婁笅鏂囷細

```css
.container {
  display: flex;
}

.item-1 {
  z-index: 1; /* 鍒涘缓灞傚彔涓婁笅鏂?*/
  position: relative;
}

.item-2 {
  z-index: 0;
}

/* 鍗充娇 item-2 鐨?z-index 鏇翠綆锛宨tem-1 浠嶇劧鍦ㄤ笂闈?*/
```

## contain 灞炴€у灞傚彔鐨勫奖鍝?
`contain` 灞炴€у彲浠ラ檺鍒跺竷灞€鍜屾覆鏌撹寖鍥达細

```css
.element {
  contain: layout paint;
  /* 鎴?strict / content */
}
```

### contain 鐨勫€?
| 鍊?| 璇存槑 |
|---|------|
| `layout` | 闄愬埗甯冨眬璁＄畻 |
| `paint` | 闄愬埗缁樺埗 |
| `strict` | layout + paint |
| `content` | layout + paint锛堜絾涓嶅奖鍝嶇埗鍏冪礌锛墊

## JavaScript 鍒ゆ柇瀹為檯灞傚彔椤哄簭

```javascript
function getStackingOrder(element) {
  const stacks = [];
  let current = element;

  while (current) {
    const style = window.getComputedStyle(current);
    const zIndex = style.zIndex;
    const position = style.position;

    // 妫€鏌ユ槸鍚﹀垱寤哄眰鍙犱笂涓嬫枃
    const createsStackingContext =
      style.opacity < 1 ||
      style.transform !== 'none' ||
      style.filter !== 'none' ||
      (position !== 'static' && zIndex !== 'auto');

    stacks.push({
      element: current,
      zIndex: zIndex,
      position: position,
      createsStackingContext: createsStackingContext
    });

    current = current.parentElement;
  }

  return stacks;
}
```

## 鏈€浣冲疄璺?
1. **鏄庣‘浣跨敤 position**锛氶渶瑕佹帶鍒跺眰鍙犳椂锛屼娇鐢?`position: relative/absolute/fixed/sticky`
2. **璋ㄦ厧浣跨敤 z-index**锛歾-index 鍊艰繃澶т細瀵艰嚧灞傜骇绠＄悊鍥伴毦
3. **閬垮厤杩囧害宓屽灞傚彔涓婁笅鏂?*锛氭繁灞傚祵濂椾細浣?z-index 姣旇緝澶嶆潅鍖?4. **浼樺厛鎻愬崌鐖跺厓绱?*锛氬鏋滃瓙鍏冪礌闇€瑕佽鐩栧彟涓€涓厓绱狅紝鑰冭檻鎻愬崌鐖跺厓绱犵殑 z-index
5. **浣跨敤 CSS 鍙橀噺绠＄悊 z-index**锛氶伩鍏嶉殢鏈烘暟鍊?
```css
:root {
  --z-dropdown: 100;
  --z-sticky: 200;
  --z-modal: 1000;
  --z-tooltip: 2000;
}
```

## 鎬荤粨

| 闂 | 鍘熷洜 | 瑙ｅ喅 |
|-----|------|-----|
| z-index 鏃犳晥 | 鍏冪礌鍦ㄤ笉鍚岀殑灞傚彔涓婁笅鏂?| 鎻愬崌鐖跺厓绱犵殑 z-index |
| 琚埗鍏冪礌閬尅 | 鐖跺厓绱犲眰鍙犻『搴忚緝浣?| 璋冩暣鐖跺厓绱?z-index |
| opacity 褰卞搷灞傚彔 | opacity < 1 鍒涘缓鏂板眰鍙犱笂涓嬫枃 | 閬垮厤涓嶅繀瑕佺殑 opacity |
| flex 瀛愬厓绱?z-index 鏃犳晥 | flex 瀹瑰櫒鍒涘缓灞傚彔涓婁笅鏂?| 浣跨敤鍗曠嫭鐨?z-index 鍊?|

## 鍙傝€冭祫鏂?
- [MDN - Stacking Context](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Positioning/Understanding_z_index/The_stacking_context)
- [MDN - z-index](https://developer.mozilla.org/en-US/docs/Web/CSS/z-index)
- [CSS Spec - Appendix E. Elaborate description of Stacking Contexts](https://www.w3.org/TR/CSS21/zindex.html)
- [whatforced.com - CSS z-index](https://www.whatstyle.net/articles/27/z-index_and_the_stacking_context)
