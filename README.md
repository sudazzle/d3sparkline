Sparkline with tooltip based on d3 library.
## Install
npm install d3sparkline --save
## How to use it?
Without Animation
```
let options = {
  containerElement: '#containerElement',
  width: 120,
  height: 25,
  arraySize: 40,
  data: [1,3,6,7,8,9,0,3,6,13,45,67,89,34,1,3,6,7,8,9,0,3,6,13,45,67,89,34,80,34,45,34,45,65,76,67,12,34,56,34]
}

new Sparkline(options);
```
With Animation
```
let options = {
  containerElement: '#test',
  width: 120,
  height: 25,
  arraySize: 40,
}

const sparkline = new Sparkline(options);
setInterval(() => {
  sparkline.updateLine(Math.floor((Math.random() * 100) + 1));
}, 1000);
```

