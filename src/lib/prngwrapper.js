/***********************************************************************************************************************

	lib/prngwrapper.js

	Copyright © 2013–2021 Thomas Michael Edwards <thomasmedwards@gmail.com>. All rights reserved.
	Use of this source code is governed by a BSD 2-clause "Simplified" License, which may be found in the LICENSE file.

***********************************************************************************************************************/

var PRNGWrapper = (() => { // eslint-disable-line no-unused-vars, no-var
	'use strict';

	/*******************************************************************************************************************
		PRNGWrapper Class.
	*******************************************************************************************************************/
	class PRNGWrapper {
		constructor(seed, options) {
			/* eslint-disable new-cap */
			/* Jimmy: CHANGES: Create the Math.seedrandom initialisation to use the state object. */
			const prngObj = new Math.seedrandom(seed, options);
			Object.defineProperties(this, {
				_prng: {
					value: prngObj
				},
				state: {
					value: prngObj.state
				},
				random: {
					value() {
						return this._prng();
					}
				}
			});
			/* eslint-enable new-cap */
		}

		static marshal(prng) {
			/* Jimmy: CHANGES: Modify warning message so that it instead checks for only the new state property.
				Old: if (!prng || !prng.hasOwnProperty('seed') || !prng.hasOwnProperty('pull')) { */
			if (!prng || !prng.hasOwnProperty('state')) {
				throw new Error('PRNG is missing required data');
			}

			/* Jimmy: CHANGES: Only return the state of the PRNG object.
				Old: seed : prng.seed,
					 pull : prng.pull */
			return {
				prng: prng.state()
			};
		}

		static unmarshal(prngObj) {
			/* Jimmy: CHANGES: Modify warning message so that it instead checks for only the new state property.
					Old: if (!prngObj || !prngObj.hasOwnProperty('seed') || !prngObj.hasOwnProperty('pull')) {
							 throw new Error('PRNG object is missing required data'); */
			if (!prngObj || !prngObj.hasOwnProperty('state')) {
				throw new Error('PRNG object is missing required state data');
			}

			/*
				Create a new PRNG using the original seed and pull values from it until it
				has reached the original pull count.
			*/
			/* Jimmy: CHANGES: Create new PRNGWrapper with the state object of the old PRNG object.
					Old: const prng = new PRNGWrapper(prngObj.seed, false);
						 for (let i = prngObj.pull; i > 0; --i) {
							 prng.random();
						 } */
			const prng = new PRNGWrapper('', { state: prngObj.state });

			return prng;
		}
	}


	/*******************************************************************************************************************
		Module Exports.
	*******************************************************************************************************************/
	return PRNGWrapper;
})();
