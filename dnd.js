/* 
Создал Клевцов Олег.
Пожалуйста, не используйте этот код без моего разрешения!
oleg.klevtsov1972@gmail.com

05 june 2021
*/





initValues();
document.ondragstart = function() {  return false; }  /* запрещаем браузеру применять свой механизм перетаскивания окон для исключения дублирования */
createPortal();
window.addEventListener('mousemove', mousemove, false);
window.addEventListener('mouseup', mouseup, false);




/***************************************************************************************************/


/* эта функция снимает все выделения текста/объектов на странице  */
function clearSelection() {
  if (window.getSelection) { window.getSelection().removeAllRanges();} 
  else {document.selection.empty();}  // старый IE
}



function moveWindow() {
  let x = event.clientX;
  let y = event.clientY;
  let offsetx = event.pageX - event.clientX;
  let offsety = event.pageY - event.clientY;

  let moving_window = document.getElementById('ghost_window');
  if (moving_window) {
    let rect = moving_window.getBoundingClientRect();
    moving_window.style.left=px(rect.left + (x - window.current.old_clientX) + offsetx);
    moving_window.style.top=px(rect.top + (y - window.current.old_clientY) + offsety);
  } else {
    moving_window = document.getElementById(window.current.prefixMovingWindow + 'main');
    let rect = moving_window.getBoundingClientRect();
    drawSplitWindow(window.current.prefixMovingWindow, (rect.top + y - window.current.old_clientY + offsety), (rect.left + x - window.current.old_clientX + offsetx), rect.width, rect.height);
  }

  saveCurrentXY();
}



/* здесь проверяем, если при движении мыши есть флаг что нужно перемещать окно или его ресайзить, то делаем перемещение или ресайз */
function mousemove() {
  if (document.getElementById('ghost_window') || window.current.prefixMovingWindow) 
    if (window.current.resize_direction) resize(); else moveWindow();
}



/* отображаем на экране составное окно - сначала подложку main, потом невидимую шапку и границы для растягивания */
function drawSplitWindow(prefix_id, top_main, left_main, width_main, height_main) {

  let main = document.getElementById(prefix_id + 'main');
  let caption = document.getElementById(prefix_id + 'caption');
  let b1 = document.getElementById(prefix_id + 'b1');
  let b2 = document.getElementById(prefix_id + 'b2');
  let b3 = document.getElementById(prefix_id + 'b3');
  let b4 = document.getElementById(prefix_id + 'b4');
  let b5 = document.getElementById(prefix_id + 'b5');
  let b6 = document.getElementById(prefix_id + 'b6');
  let b7 = document.getElementById(prefix_id + 'b7');
  let b8 = document.getElementById(prefix_id + 'b8');

  main.style.top = px(top_main);
  main.style.left = px(left_main);
  main.style.width = px(width_main);
  main.style.height = px(height_main);
  caption.style.top = px(top_main + window.initial.resize_thick / 2);
  caption.style.left = px(left_main);
  caption.style.width = px(width_main);
  b1.style.top = px (top_main - window.initial.corner_thick / 2);
  b1.style.left = px (left_main - window.initial.corner_thick / 2);
  b2.style.top = px (top_main - window.initial.resize_thick / 2);
  b2.style.left = px (left_main + window.initial.corner_thick / 2);
  b2.style.width = px (width_main - window.initial.corner_thick);
  b3.style.top = px (top_main - window.initial.corner_thick / 2);
  b3.style.left = px (left_main + width_main - window.initial.corner_thick / 2);
  b4.style.top = px (top_main + window.initial.corner_thick / 2);
  b4.style.left = px (left_main + width_main - window.initial.resize_thick / 2);
  b4.style.height = px (height_main - window.initial.corner_thick);
  b5.style.top = px (top_main + height_main - window.initial.corner_thick / 2);
  b5.style.left = px (left_main + width_main - window.initial.corner_thick / 2);
  b6.style.top = px (top_main + height_main - window.initial.resize_thick / 2);
  b6.style.left = px (left_main + window.initial.corner_thick / 2);
  b6.style.width = px (width_main - window.initial.corner_thick);
  b7.style.top = px (top_main + height_main - window.initial.corner_thick / 2);
  b7.style.left = px (left_main - window.initial.corner_thick / 2);
  b8.style.top = px (top_main + window.initial.corner_thick / 2);
  b8.style.left = px (left_main - window.initial.resize_thick / 2);
  b8.style.height = px (height_main - window.initial.corner_thick);

  clearSelection();
}




/* изменяет размер и положение ТЕКУЩЕГО окна в зависимости от угла/стороны растягивания */
function resize() {

  let main = document.getElementById(window.current.prefixMovingWindow+'main');
  let rect = main.getBoundingClientRect();
  let top = rect.top;
  let left = rect.left;
  let width = rect.width;
  let height = rect.height;
  let delta_x = window.current.old_clientX - event.clientX;
  let delta_y = window.current.old_clientY - event.clientY;
  let offsetx = event.pageX - event.clientX;
  let offsety = event.pageY - event.clientY;

  switch (window.current.resize_direction) {
    case 'b1':
      if ((width + delta_x) > window.initial.min_window_width) {     
        left -= delta_x;
        width += delta_x;
      }
      if ((height + delta_y) > window.initial.min_window_height) {     
        top -= delta_y;
        height += delta_y;
      }
      break;
    case 'b2':
      if ((height + delta_y) > window.initial.min_window_height) {     
        top -= delta_y;
        height += delta_y;
      }
      break;
    case 'b3':
      if ((width - delta_x) > window.initial.min_window_width) {     
        width -= delta_x;
      }
      if ((height + delta_y) > window.initial.min_window_height) {     
        top -= delta_y;
        height += delta_y;
      }
      break;
    case 'b4':
      if ((width - delta_x) > window.initial.min_window_width) {     
        width -= delta_x;
      }
      break;
    case 'b5':
      if ((width - delta_x) > window.initial.min_window_width) {     
        width -= delta_x;
      }
      if ((height - delta_y) > window.initial.min_window_height) {     
        height -= delta_y;
      }
      break;
    case 'b6':
      if ((height - delta_y) > window.initial.min_window_height) {     
        height -= delta_y;
      }
      break;
    case 'b7':
      if ((width + delta_x) > window.initial.min_window_width) {     
        left -= delta_x;
        width += delta_x;
      }
      if ((height - delta_y) > window.initial.min_window_height) {     
        height -= delta_y;
      }
      break;
    case 'b8':
      if ((width + delta_x) > window.initial.min_window_width) {
        width += delta_x;
        left -= delta_x;
      }
      break;
  }

  drawSplitWindow(window.current.prefixMovingWindow, (top+offsety), (left+offsetx), width, height);

  saveCurrentXY();
}



/* просто присваивает указанный З-индекс главному окну, а индекс+1 - всем остальным сателитам главного */
function assignZindex(prefix, index) {
  document.getElementById(prefix + 'main').style.zIndex = index;
  document.getElementById(prefix + 'caption').style.zIndex = index + 1;
  document.getElementById(prefix + 'b1').style.zIndex = index + 1;
  document.getElementById(prefix + 'b2').style.zIndex = index + 1;
  document.getElementById(prefix + 'b3').style.zIndex = index + 1;
  document.getElementById(prefix + 'b4').style.zIndex = index + 1;
  document.getElementById(prefix + 'b5').style.zIndex = index + 1;
  document.getElementById(prefix + 'b6').style.zIndex = index + 1;
  document.getElementById(prefix + 'b7').style.zIndex = index + 1;
  document.getElementById(prefix + 'b8').style.zIndex = index + 1;
}


/* меняет з-индексы окон - текущему присваивает максимальный, всем, кто был выше него - умень шает на 10 (это один шаг) */
function shuffleZindex() {
  let prefix = false;
  let index = false;
  let calculate_max_index = window.initial.max_windows_count * 10;
  let old_index = document.getElementById(window.current.prefixMovingWindow + 'main').style.zIndex;
  if (old_index != calculate_max_index) {  /* меняем индексы только, если у текущего окна не максимальный - один раз за движение данного окна */
    assignZindex(window.current.prefixMovingWindow, calculate_max_index);
    for (var i = 0; i <= window.initial.max_windows_count; i++) {
      prefix = window.initial.prefix_window_id + i;
      if (document.getElementById(prefix + 'main')) {
        index = document.getElementById(prefix + 'main').style.zIndex;
        if (index >= old_index) assignZindex(prefix, (index - 10));
      }  
    }
  }
}




/* если нажали на шапку окна, то устанавливаем флаг ПРОИСХОДИТ ДВИЖЕНИЕ */
function mousedownCaption() {
  let id = event.currentTarget;
  window.current.prefixMovingWindow = id.id.slice(0, id.id.length - 7);
  document.getElementById(window.current.prefixMovingWindow + 'main').style.boxShadow = window.initial.box_shadow;
  shuffleZindex();
  saveCurrentXY();
}


/* если нажали на углы/грани, то устанавливаем и флаг ПРОИСХОДИТ ДВИЖЕНИЕ и флаг СТОРОНА РАСТЯГИВАНИЯ */
function mousedownResize() {
  let id = event.currentTarget;
  window.current.prefixMovingWindow = id.id.slice(0, id.id.length - 2);
  window.current.resize_direction = id.id.slice(-2);
  document.getElementById(window.current.prefixMovingWindow + 'main').style.boxShadow = window.initial.box_shadow;
  shuffleZindex();
  saveCurrentXY();
}



/* генериуем свободный префикс для id окон - проверяем если он свободен. Генерируем исходя из максимального количества разрешенніх окон */
function generateNewIdPrefix() {
  let prefix = '';
  do {
    prefix = window.initial.prefix_window_id + Math.round(Math.random() * (window.initial.max_windows_count));
  } while (document.getElementById(prefix + 'caption'));
  return prefix;
}




/* просто запоминаем текущие координаты в память */
function saveCurrentXY() {
  window.current.old_clientX = event.clientX;
  window.current.old_clientY = event.clientY;
}


/* под порталом формируем временно окно - демонстрация пользователю, что нажатие подготовило выпуск нового окна */
function createGhostWindow() {
  let ghost_window = document.createElement('div');
  ghost_window.id='ghost_window';
  ghost_window.style.position='absolute';
  ghost_window.style.left=px(event.pageX - window.initial.ghost_window_shift_X);
  ghost_window.style.top=px(event.pageY - window.initial.ghost_window_shift_Y);
  ghost_window.style.width=px(window.initial.new_window_width);
  ghost_window.style.height=px(window.initial.new_window_height);
  ghost_window.style.backgroundColor = 'transparent';
  ghost_window.style.zIndex = -999;
  ghost_window.style.outline = window.initial.ghost_outline;
  document.body.append(ghost_window);
  saveCurrentXY();
}




function createNewWindow () {
  window.current.prefixMovingWindow = generateNewIdPrefix();
  let left = event.pageX - window.initial.ghost_window_shift_X;
  let top = event.pageY - window.initial.ghost_window_shift_Y;

  let new_main = document.createElement('div');
  new_main.id = window.current.prefixMovingWindow + 'main';
  new_main.style.background = 'url("https://dniprorada.gov.ua/upload/content/o_1e6mojm4doq71jikubbq5l1aah.png") repeat-x #afeeee';
  new_main.style.position = 'absolute';
  new_main.style.outline = window.initial.main_outline;
  new_main.style.boxShadow = window.initial.box_shadow;
  document.body.append(new_main);

  let new_caption = document.createElement('div');
  new_caption.id = window.current.prefixMovingWindow + 'caption';
  new_caption.style.backgroundColor =window.testing.caption_color;
  new_caption.style.color = 'white';
  new_caption.style.position = 'absolute';
  new_caption.style.cursor = 'move';
  new_caption.style.height = px(window.initial.caption_height);
  document.body.append(new_caption);
  new_caption.addEventListener('mousedown', mousedownCaption, false); 

  let new_b1 = document.createElement('div');
  new_b1.id = window.current.prefixMovingWindow + 'b1';
  new_b1.style.backgroundColor = window.testing.corner_color;
  new_b1.style.position = 'absolute';
  new_b1.style.width = px (window.initial.corner_thick);
  new_b1.style.height = px (window.initial.corner_thick);
  new_b1.style.cursor = 'nw-resize';
  document.body.append(new_b1);
  new_b1.addEventListener('mousedown', mousedownResize, false); 

  let new_b2 = document.createElement('div');
  new_b2.id = window.current.prefixMovingWindow + 'b2';
  new_b2.style.backgroundColor = window.testing.resize_color;
  new_b2.style.position = 'absolute';
  new_b2.style.cursor = 'n-resize';
  new_b2.style.height = px (window.initial.resize_thick);
  document.body.append(new_b2);
  new_b2.addEventListener('mousedown', mousedownResize, false); 

  let new_b3 = document.createElement('div');
  new_b3.id = window.current.prefixMovingWindow + 'b3';
  new_b3.style.backgroundColor = window.testing.corner_color;
  new_b3.style.position = 'absolute';
  new_b3.style.width = px (window.initial.corner_thick);
  new_b3.style.height = px (window.initial.corner_thick);
  new_b3.style.cursor = 'ne-resize';
  document.body.append(new_b3);
  new_b3.addEventListener('mousedown', mousedownResize, false); 

  let new_b4 = document.createElement('div');
  new_b4.id = window.current.prefixMovingWindow + 'b4';
  new_b4.style.backgroundColor = window.testing.resize_color;
  new_b4.style.position = 'absolute';
  new_b4.style.cursor = 'e-resize';
  new_b4.style.width = px (window.initial.resize_thick);
  document.body.append(new_b4);
  new_b4.addEventListener('mousedown', mousedownResize, false); 

  let new_b5 = document.createElement('div');
  new_b5.id = window.current.prefixMovingWindow + 'b5';
  new_b5.style.backgroundColor = window.testing.corner_color;
  new_b5.style.position = 'absolute';
  new_b5.style.width = px (window.initial.corner_thick);
  new_b5.style.height = px (window.initial.corner_thick);
  new_b5.style.cursor = 'se-resize';
  document.body.append(new_b5);
  new_b5.addEventListener('mousedown', mousedownResize, false); 

  let new_b6 = document.createElement('div');
  new_b6.id = window.current.prefixMovingWindow + 'b6';
  new_b6.style.backgroundColor = window.testing.resize_color;
  new_b6.style.position = 'absolute';
  new_b6.style.cursor = 's-resize';
  new_b6.style.height = px (window.initial.resize_thick);
  document.body.append(new_b6);
  new_b6.addEventListener('mousedown', mousedownResize, false); 

  let new_b7 = document.createElement('div');
  new_b7.id = window.current.prefixMovingWindow + 'b7';
  new_b7.style.backgroundColor = window.testing.corner_color;
  new_b7.style.position = 'absolute';
  new_b7.style.width = px (window.initial.corner_thick);
  new_b7.style.height = px (window.initial.corner_thick);
  new_b7.style.cursor = 'sw-resize';
  document.body.append(new_b7);
  new_b7.addEventListener('mousedown', mousedownResize, false); 

  let new_b8 = document.createElement('div');
  new_b8.id = window.current.prefixMovingWindow + 'b8';
  new_b8.style.backgroundColor = window.testing.resize_color;
  new_b8.style.position = 'absolute';
  new_b8.style.cursor = 'w-resize';
  new_b8.style.width = px (window.initial.resize_thick);
  document.body.append(new_b8);
  new_b8.addEventListener('mousedown', mousedownResize, false); 

  drawSplitWindow(window.current.prefixMovingWindow, top, left, window.initial.new_window_width, window.initial.new_window_height); 
  shuffleZindex();

  saveCurrentXY();

  window.current.count_stack_windows--;
  document.getElementById('portal').innerHTML = window.current.count_stack_windows;
}




/* просто меняем цввет портала ели над ним мышь */
function mouseoverPortal () {
  document.getElementById('portal').style.backgroundColor = window.initial.portal_bgcolor_mouseover;
}



/* если мышь вышла за пределы портала, но было инициировано создание нового окна, то создаем его */
function mouseoutPortal () {
  document.getElementById('portal').style.backgroundColor = window.initial.portal_bgcolor;
  if (document.getElementById('ghost_window')) {
    reduceEventsArea();
    createNewWindow();
    document.getElementById('ghost_window').remove();
  }
}





/* если на зоне портала нажали мышку, и если есть запас окон для выдачи, то создаем окно-призрак и позволяем вытягивать его */
function mousedownPortal () {
  if (window.current.count_stack_windows > 0) {
    createGhostWindow();
    expandEventsArea();
  }
  else document.getElementById('portal').style.color = 'red';
}




/* удаляет составное окно - само окно, обработчики нажатий кнопки и невидимые ДИВы для ресайзинга */
function deleteSplitWindow(prefix) {
  let caption = document.getElementById(prefix+'caption');
  let b1 = document.getElementById(prefix+'b1');
  let b2 = document.getElementById(prefix+'b2');
  let b3 = document.getElementById(prefix+'b3');
  let b4 = document.getElementById(prefix+'b4');
  let b5 = document.getElementById(prefix+'b5');
  let b6 = document.getElementById(prefix+'b6');
  let b7 = document.getElementById(prefix+'b7');
  let b8 = document.getElementById(prefix+'b8');

  caption.removeEventListener('mousedown', mousedownCaption, false);
  b1.removeEventListener('mousedown', mousedownResize, false);
  b2.removeEventListener('mousedown', mousedownResize, false);
  b3.removeEventListener('mousedown', mousedownResize, false);
  b4.removeEventListener('mousedown', mousedownResize, false);
  b5.removeEventListener('mousedown', mousedownResize, false);
  b6.removeEventListener('mousedown', mousedownResize, false);
  b7.removeEventListener('mousedown', mousedownResize, false);
  b8.removeEventListener('mousedown', mousedownResize, false);

  document.getElementById(prefix+'main').remove();
  caption.remove();
  b1.remove();
  b2.remove();
  b3.remove();
  b4.remove();
  b5.remove();
  b6.remove();
  b7.remove();
  b8.remove();

  window.current.count_stack_windows++;
  document.getElementById('portal').innerHTML = window.current.count_stack_windows;
}



/* если отпустили кнопку мыши в любом месте экрана, то отменяем все действия - растягивание, перемещение и т.д.) */
function mouseup () {
  let rect = document.getElementById('portal').getBoundingClientRect();
  if (window.current.prefixMovingWindow && !window.current.resize_direction)   /* если отпущена кнопка над порталом и ИДЕТ перемещение окна без ресайзинга, то удаляем окно */
    if (event.clientX >= rect.left)
      if ((rect.left + rect.width) >= event.clientX)
        if (event.clientY >= rect.top)
          if ((rect.top + rect.height) >= event.clientY) deleteSplitWindow(window.current.prefixMovingWindow);
  if (window.current.prefixMovingWindow) document.getElementById(window.current.prefixMovingWindow + 'main').style.boxShadow = 'none';
  window.current.prefixMovingWindow = false;
  window.current.resize_direction = false;

  document.getElementById('portal').style.removeProperty('color');
  if (document.getElementById('ghost_window')) document.getElementById('ghost_window').remove();  /* удаляем окно-призрак */
  reduceEventsArea();
}


                                            	


/* растягиваем зону сработок над порталом настолько, насколько окно-привидение шире портала - это нужно, чтобы уход мышки был когда все окно покинет портал */
function expandEventsArea() {
  let portal_events_area = document.getElementById('portal_events_area');
  portal_events_area.style.right = px(-window.initial.ghost_window_shift_X);
  portal_events_area.style.top = px(-window.initial.new_window_height + window.initial.ghost_window_shift_Y);  
  portal_events_area.style.width = px(window.initial.portal_width + window.initial.new_window_width);
  portal_events_area.style.height = px(window.initial.portal_height + window.initial.new_window_height);
}



/* сжимаем зону сработок над порталом до размера самого портала */
function reduceEventsArea() {
  let portal_events_area = document.getElementById('portal_events_area');
  portal_events_area.style.top=px(0);
  portal_events_area.style.right=px(0);
  portal_events_area.style.width=px(window.initial.portal_width);
  portal_events_area.style.height=px(window.initial.portal_height);
}





function px(number) { /* функция віполняет рутинную, но частую операцию - добавляет к числу сокращение "пиксели" для подстановки в код позиционирования */
  return '' + number + 'px';
}



/* создаем зону портала и поверх него невидимую зону сработ ок при наведении на портал */
function createPortal() {

  let portal = document.createElement('div');
  portal.id='portal';
  portal.style.position='absolute';
  portal.style.top=px(0);
  portal.style.right=px(0);
  portal.style.width=px(window.initial.portal_width);
  portal.style.height=px(window.initial.portal_height);
  portal.style.backgroundColor = window.initial.portal_bgcolor;
  portal.style.opacity = window.initial.portal_opacity;
  portal.style.textAlign ='center';
  portal.style.font ='bold 18px Arial,Sans-Serif';
  portal.innerHTML = window.current.count_stack_windows;
  document.body.append(portal);

  /* прямо над DIV портала создаем такой же по размеру DIV, но прозрачный невидимый, он нужен для кликов на нем событий, чтобы эту область кликов можно было в процессе работы расширять */
  let portal_events_area = document.createElement('div');
  portal_events_area.id='portal_events_area';
  portal_events_area.style.position='absolute';
  portal_events_area.style.top=px(0);
  portal_events_area.style.right=px(0);
  portal_events_area.style.width=px(window.initial.portal_width);
  portal_events_area.style.height=px(window.initial.portal_height);
  portal_events_area.style.backgroundColor = 'transparent';
  portal_events_area.title = 'Вытягивайте мышью из этого портала НОВОЕ ОКНО или удаляйте в портал ненужное';
  document.body.append(portal_events_area);

  /* задаем все функции, реагирующие на сработки над порталом */
  /* добавляем изменения цветов при наведении мыши и нажатии */
  portal_events_area.addEventListener('mouseover', mouseoverPortal, false); 
  portal_events_area.addEventListener('mouseout', mouseoutPortal, false); 
  portal_events_area.addEventListener('mousedown', mousedownPortal, false); 
}





/* просто заполняем все исходные переменные */
function initValues() {
  /* В этом абзаце создадим ячейки памяти для хранения начальных настроек. В дальнейшем эти настройки можно брать из админки */
  window.initial = {
  portal_width: 55,
  portal_height: 55,
  portal_bgcolor: 'gray',
  portal_bgcolor_mouseover: 'silver',
  portal_opacity: 0.5,
  new_window_width: 100,
  new_window_height: 77,
  min_window_width: 57,
  min_window_height: 57,
  ghost_window_shift_X: 30,
  ghost_window_shift_Y: 10,
  corner_thick: 22,
  resize_thick: 12,
  caption_height: 21,
  prefix_window_id: 'window',
  ghost_outline: '3px dotted gray',
  main_outline: '1px solid black',
  box_shadow: '0.4em 0.4em 5px rgba(122,122,122,0.5)',
  max_windows_count: 6
  }

  /* В этом абзаце мы создадим и инициализируем ячейки памяти под хранение текущих данных, оперативных, таких как текущие координаты и т.п. */
  window.current = {
  count_stack_windows: window.initial.max_windows_count,
  old_clientX: 0,
  old_clientY: 0,
  prefixMovingWindow: false,
  resize_direction: false
  }

  window.testing = {
  caption_color: 'transparent',
  corner_color: 'transparent',
  resize_color: 'transparent'
  }
}
