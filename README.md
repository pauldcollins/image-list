# ReactJS image list with filtering

React project playing with displaying an image list and filtering results.

This foundation for this comes from the excellent seed from Shidhin here: https://github.com/shidhincr/react-jest-gulp-jspm-seed 

The seed uses Jest for unit testing, Gulp for building and JSPM as the browser package manager.

**Note:** We use System.js ( comes with JSPM ) for module loading.

## Install

Clone this repo and run npm install
```
git clone git@github.com:pauldcollins/image-list.git

cd image-list

npm install
```

## Usage 

There are two main gulp tasks. Run both tasks in two different terminal tabs, so that you can test while running code.

**Develop**

```js 
gulp develop
```

This task will open the browser ( using BrowserSync ) and load the `index.html`. It will then wait for any changes in the scripts folder, and reload the browser.

**Test**

```js 
gulp test
```

This task runs the unit tests using `jest`. It will also wait for any changes in the `__tests__` or `scripts` folder to re-run the tests.