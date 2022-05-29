'use strict';

// todo: MouseEvent TouchEvent wrapper
const { touchBegan, touchMoved, touchEnded } = {
  touchBegan: typeof document.ontouchstart !== 'undefined' ? 'touchstart' : 'mousedown',
  touchMoved: typeof document.ontouchmove !== 'undefined' ? 'touchmove' : 'mousemove',
  touchEnded: typeof document.ontouchend !== 'undefined' ? 'touchend' : 'mouseup',
};


class MyWorkletNode extends AudioWorkletNode {
  constructor(context) {
    super(context, 'my-worklet-processor');
  }
}




/* audio */
const bufsize = 1024;
const audioctx = new AudioContext();
const scrproc = audioctx.createScriptProcessor(bufsize);
      scrproc.onaudioprocess = Process;
      scrproc.connect(audioctx.destination);
let osc = null;
let play = 0;


function Process(ev) {
  const buf0 = ev.outputBuffer.getChannelData(0);
  const buf1 = ev.outputBuffer.getChannelData(1);
  for (let i = 0; i < bufsize; ++i) {
    buf0[i] = buf1[i] = (Math.random() - 0.5) * play;
  }
}


/* setup document element */
const mainTitleHeader = document.createElement('h2');
      mainTitleHeader.textContent = 'Script Processor';

const buttonDiv = document.createElement('div');
      buttonDiv.style.width = '100%';
const playButton = createButton('play');
      playButton.addEventListener(touchBegan, () => {
        if(osc === null) {
          osc = new OscillatorNode(audioctx);
          osc.start();
        }
        play = 1;
      });
const stopButton = createButton('stop');
      stopButton.addEventListener(touchBegan, () => {
        play = 0;
      });


/* appendChild document element */
const nodeArray = [mainTitleHeader, buttonDiv, [playButton, stopButton]];

setAppendChild(nodeArray);


function setAppendChild(nodes, parentNode=document.body) {
  let preNode = parentNode;
  nodes.forEach(node => {
    (Array.isArray(node)) ? setAppendChild(node, preNode) : parentNode.appendChild(node);
    preNode = node;
  });
}


function capitalize(str) {
  if (typeof str !== 'string' || !str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};


/* create document element funcs */
function createButton(idName, textValue=null) {
  const element = document.createElement('button');
        element.style.width = '100%';
        element.style.height = '4rem';
        element.type = 'button';
        element.id = idName;
        element.textContent = (textValue) ? textValue :  capitalize(idName);
  return element;
}
