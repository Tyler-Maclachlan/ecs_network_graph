let prefix = '',
  _addEventListener: string,
  onWheel,
  support: string;

if (window.addEventListener) {
  _addEventListener = 'addEventListener';
} else {
  _addEventListener = 'attachEvent';
  prefix = 'on';
}

support =
  'onwheel' in document.createElement('div')
    ? 'wheel'
    : (document as any).onmousewheel !== undefined
    ? 'mousewheel'
    : 'DOMMouseScroll';

export function addWheelListener(
  elem: HTMLElement,
  callback: any,
  useCapture: boolean
) {
  _addWheelListener(elem, support, callback, useCapture);

  if (support == 'DOMMouseScroll') {
    _addWheelListener(elem, 'MozMousePixelScroll', callback, useCapture);
  }
}

function _addWheelListener(
  elem: HTMLElement,
  eventName: string,
  callback: any,
  useCapture: boolean
) {
  (elem as any)[_addEventListener](
    prefix + eventName,
    support == 'wheel'
      ? callback
      : function(originalEvent: Event) {
          !originalEvent && (originalEvent = window.event);

          let event = {
            originalEvent: originalEvent,
            target: originalEvent.target || originalEvent.srcElement,
            type: 'wheel',
            deltaMode: originalEvent.type === 'MozMousePixelScroll' ? 0 : 1,
            deltaX: 0,
            deltaY: 0,
            preventDefault: function() {
              originalEvent.preventDefault
                ? originalEvent.preventDefault()
                : (originalEvent.returnValue = false);
            }
          };

          if (support === 'mousewheel') {
            event.deltaY = (-1 / 40) * (originalEvent as any).wheelDelta;
            (originalEvent as any).wheelDeltaX &&
              (event.deltaX = (-1 / 40) * (originalEvent as any).wheelDeltaX);
          } else {
            event.deltaY = (originalEvent as any).detail;
          }

          return callback(event);
        },
    useCapture || false
  );
}
