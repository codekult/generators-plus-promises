/**
 * Generators + Promises
 * Simple example implementation
 */

/* DOM elements */
var btn = document.getElementById('btn'),
    code = document.getElementById('code');
    code = document.getElementById('code');

/* Hide away the async work… */
function run(genFunc, pro) {
    var objGen = typeof genFunc === 'function' ? genFunc() : genFunc,
        pro = pro || objGen.next().value;

    if (pro && (typeof pro.then) === 'function') {
        pro.then(function (res) {
            run(objGen, objGen.next(res).value);
        });
    }
}

/* …So the implementation looks clean and synchronous like: */
function *printPaymentMethods() {
    'use strict';

    code.classList.remove('hide');
    code.classList.add('loading');

    let allPaymentMethodsDetails = [],
        allPaymentMethodsData = JSON.parse(yield request('https://api.mercadolibre.com/sites/MLA/payment_methods'));

    for (let paymentMethod of allPaymentMethodsData) {
        let id = paymentMethod.id,
            paymentMethodData = yield request(`https://api.mercadolibre.com/sites/MLA/payment_methods/${id}`);

        allPaymentMethodsDetails.push(paymentMethodData)
    }

    console.log(allPaymentMethodsDetails);
    code.classList.remove('loading');
    code.innerHTML = allPaymentMethodsDetails;
}

btn.onclick = function () {
    console.log('Running *printPaymentMethods…');
    run(printPaymentMethods);
};


/**
 * Compare the previous implementation with ES7 `async` functions:
 * async function logResponse(url) {
 *     var reData = await request(url);
 *     console.log(reData);
 * }
 */

/**
 * For a more sophisticated and complete approach see the following implementations:
 * - https://github.com/kriskowal/q/blob/db9220d714b16b96a05e9a037fa44ce581715e41/q.js#L500
 * - https://github.com/getify/You-Dont-Know-JS/blob/master/async%20&%20performance/ch4.md#promise-aware-generator-runner
 */
