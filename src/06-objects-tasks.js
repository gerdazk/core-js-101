/* ************************************************************************************************
 *                                                                                                *
 * Plese read the following tutorial before implementing tasks:                                   *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object        *
 *                                                                                                *
 ************************************************************************************************ */

/**
 * Returns the rectagle object with width and height parameters and getArea() method
 *
 * @param {number} width
 * @param {number} height
 * @return {Object}
 *
 * @example
 *    const r = new Rectangle(10,20);
 *    console.log(r.width);       // => 10
 *    console.log(r.height);      // => 20
 *    console.log(r.getArea());   // => 200
 */
function Rectangle(width, height) {
  this.width = width;
  this.height = height;
  this.getArea = () => this.width * this.height;
}

/**
 * Returns the JSON representation of specified object
 *
 * @param {object} obj
 * @return {string}
 *
 * @example
 *    [1,2,3]   =>  '[1,2,3]'
 *    { width: 10, height : 20 } => '{"height":10,"width":20}'
 */
function getJSON(obj) {
  return JSON.stringify(obj);
}

/**
 * Returns the object of specified type from JSON representation
 *
 * @param {Object} proto
 * @param {string} json
 * @return {object}
 *
 * @example
 *    const r = fromJSON(Circle.prototype, '{"radius":10}');
 *
 */
function fromJSON(proto, json) {
  const parsed = JSON.parse(json);
  const values = Object.values(parsed);
  return new proto.constructor(...values);
}

/**
 * Css selectors builder
 *
 * Each complex selector can consists of type, id, class, attribute, pseudo-class
 * and pseudo-element selectors:
 *
 *    element#id.class[attr]:pseudoClass::pseudoElement
 *              \----/\----/\----------/
 *              Can be several occurences
 *
 * All types of selectors can be combined using the combinators ' ','+','~','>' .
 *
 * The task is to design a single class, independent classes or classes hierarchy
 * and implement the functionality to build the css selectors using the provided cssSelectorBuilder.
 * Each selector should have the stringify() method to output the string repsentation
 * according to css specification.
 *
 * Provided cssSelectorBuilder should be used as facade only to create your own classes,
 * for example the first method of cssSelectorBuilder can be like this:
 *   element: function(value) {
 *       return new MySuperBaseElementSelector(...)...
 *   },
 *
 * The design of class(es) is totally up to you, but try to make it as simple,
 * clear and readable as possible.
 *
 * @example
 *
 *  const builder = cssSelectorBuilder;
 *
 *  builder.id('main').class('container').class('editable').stringify()
 *    => '#main.container.editable'
 *
 *  builder.element('a').attr('href$=".png"').pseudoClass('focus').stringify()
 *    => 'a[href$=".png"]:focus'
 *
 *  builder.combine(
 *      builder.element('div').id('main').class('container').class('draggable'),
 *      '+',
 *      builder.combine(
 *          builder.element('table').id('data'),
 *          '~',
 *           builder.combine(
 *               builder.element('tr').pseudoClass('nth-of-type(even)'),
 *               ' ',
 *               builder.element('td').pseudoClass('nth-of-type(even)')
 *           )
 *      )
 *  ).stringify()
 *    => 'div#main.container.draggable + table#data ~ tr:nth-of-type(even)   td:nth-of-type(even)'
 *
 *  For more examples see unit tests.
 */

const cssSelectorBuilder = {
  result: '',
  element2: null,
  id2: null,
  pseudoElement2: null,
  element(value) {
    this.error(1);
    if (this.element2) throw new Error('Element, id and pseudo-element should not occur more then one time inside the selector');
    const objBuilder = Object.create(cssSelectorBuilder);
    objBuilder.result = this.result + value;
    objBuilder.index = 1;
    objBuilder.element2 = value;
    return objBuilder;
  },

  id(value) {
    this.error(2);
    if (this.id2) throw new Error('Element, id and pseudo-element should not occur more then one time inside the selector');
    const objBuilder = Object.create(cssSelectorBuilder);
    objBuilder.result = `${this.result}#${value}`;
    objBuilder.id2 = value;
    objBuilder.index = 2;
    return objBuilder;
  },

  class(value) {
    this.error(3);
    const objBuilder = Object.create(cssSelectorBuilder);
    objBuilder.result = `${this.result}.${value}`;
    objBuilder.index = 3;
    return objBuilder;
  },

  attr(value) {
    this.error(4);
    const objBuilder = Object.create(cssSelectorBuilder);
    objBuilder.result = `${this.result}[${value}]`;
    objBuilder.index = 4;
    return objBuilder;
  },

  pseudoClass(value) {
    this.error(5);
    const objBuilder = Object.create(cssSelectorBuilder);
    objBuilder.result = `${this.result}:${value}`;
    objBuilder.index = 5;
    return objBuilder;
  },

  pseudoElement(value) {
    this.error(6);
    if (this.pseudoElement2) throw new Error('Element, id and pseudo-element should not occur more then one time inside the selector');
    const objBuilder = Object.create(cssSelectorBuilder);
    objBuilder.result = `${this.result}::${value}`;
    objBuilder.pseudoElement2 = value;
    objBuilder.index = 6;
    return objBuilder;
  },

  stringify() {
    return this.result;
  },

  combine(selector1, combinator, selector2) {
    const objBuilder = Object.create(cssSelectorBuilder);
    objBuilder.result = `${selector1.stringify()} ${combinator} ${selector2.stringify()}`;
    return objBuilder;
  },
  error(ind) {
    if (ind < this.index) {
      throw new Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
    }
  },
};

module.exports = {
  Rectangle,
  getJSON,
  fromJSON,
  cssSelectorBuilder,
};
