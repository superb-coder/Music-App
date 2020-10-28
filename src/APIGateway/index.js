/**
 * APIGatewayFetch
 */
export default class APIGatewayFetch {
	constructor() {}
	/**
	 * Featch query method
	 * @param promise function
	 */
	fetch({ body, method = "POST", headers = { Host: "api-gateway.youngapp.co", "Content-Type": "application/json" } }) {
		return new Promise((resolve, reject) => {
			fetch("https://api-gateway.youngapp.co/jaiye-api-intranet", {
				method,
				headers: {
					Authorization: `Bearer key=f0eae307-5b58-40b5-8e5c-70a87f87f489 domain=localhost:3000`,
					...headers,
				},
				body,
			})
				.then((response) => {
					if (response.status >= 400) {
						reject(response.json());
						return;
					}

					return response.json();
				})
				.then((result) => {
					if (result != "undefined" && result && result.errors) {
						return reject(result.errors);
					}

					return resolve(result.data);
				})
				.catch((err) => {
					return reject(err);
				});
		});
	}

	devFetch({ body, method = "POST", headers = { Host: "api-gateway.youngapp.co", "Content-Type": "application/json" } }) {
		return new Promise((resolve, reject) => {
			fetch("https://api-gateway.youngapp.co/jaiye-api-intranet", {
				method,
				headers: {
					Authorization: `Bearer key=f0eae307-5b58-40b5-8e5c-70a87f87f489 domain=localhost:3000`,
					...headers,
				},
				body,
			})
				.then((response) => {
					if (response.status >= 400) {
						reject(response.json());
						return;
					}

					return response.json();
				})
				.then((result) => {
					if (result != "undefined" && result && result.errors) {
						return reject(result.errors);
					}

					return resolve(result.data);
				})
				.catch((err) => {
					return reject(err);
				});
		});
	}
	/**
	 * create method
	 * @param  {String}   type Type of operation to be performed (findOne, findAll, create, etc.)
	 * @param  {String}   model model name to perform the operation in
	 * @param  {Object}   where Value for matching the row(s) to be selected
	 * @param  {Object}   values Values for the new record
	 * @param  {string[]} projection Columns to be returned for findOne and findAll (optional)
	 * @return {Promise}
	 */
	create({ model, values, projection }) {
		return new Promise((resolve, reject) => {
			this.fetch({
				method: "POST",
				header: {},
				body: JSON.stringify({
					query: {
						type: "create",
						model,
						projection,
						values,
					},
				}),
			})
				.then((data) => {
					resolve(data);
				})
				.catch((e) => {
					resolve(e);
				});
		});
	}
	/**
	 * count method
	 * @param  {String}   type Type of operation to be performed (findOne, findAll, create, etc.)
	 * @param  {String}   model model name to perform the operation in
	 * @param  {Object}   where Value for matching the row(s) to be selected
	 * @param  {Object}   values Values for the new record
	 * @param  {string[]} projection Columns to be returned for findOne and findAll (optional)
	 * @return {Promise}
	 */
	update({ model, values, projection, where }) {
		return new Promise((resolve, reject) => {
			this.fetch({
				body: JSON.stringify({
					query: {
						type: "update",
						values,
						projection,
						model,
						where,
					},
				}),
			})
				.then((data) => {
					resolve(data);
				})
				.catch((e) => {
					resolve(e);
				});
		});
	}
	/**
	 * delete method
	 * @param  {String}   type Type of operation to be performed (findOne, findAll, create, etc.)
	 * @param  {String}   model model name to perform the operation in
	 * @param  {Object}   where Value for matching the row(s) to be selected
	 * @return {Promise}
	 */
	delete({ model, where }) {
		return this.fetch({
			body: JSON.stringify({
				query: {
					type: "delete",
					model,
					where,
				},
			}),
		});
	}
	findAllGraph({ model, where, per }) {
		return new Promise((resolve, reject) => {
			this.devFetch({
				body: JSON.stringify({
					query: {
						type: "findAll",
						model,
						where,
						per: per,
					},
				}),
			})
				.then((data) => {
					resolve(data);
				})
				.catch((e) => {
					resolve(e);
				});
		});
	}

	findTopPlatforms({ model, where, topBy }) {
		return new Promise((resolve, reject) => {
			this.devFetch({
				body: JSON.stringify({
					query: {
						type: "findAll",
						model,
						where,
						topBy: topBy,
						days: 0,
					},
				}),
			})
				.then((data) => {
					resolve(data);
				})
				.catch((e) => {
					resolve(null);
				});
		});
	}

	findPayments({ model, where, groupBy }) {
		return new Promise((resolve, reject) => {
			this.devFetch({
				body: JSON.stringify({
					query: {
						type: "findAll",
						model,
						where,
						groupBy: groupBy,
					},
				}),
			})
				.then((data) => {
					resolve(data);
				})
				.catch((e) => {
					resolve(null);
				});
		});
	}

	findUser({ model, where }) {
		return new Promise((resolve, reject) => {
			this.devFetch({
				body: JSON.stringify({
					query: {
						type: "findOne",
						model,
						where,
					},
				}),
			})
				.then((data) => {
					resolve(data);
				})
				.catch((e) => {
					resolve(null);
				});
		});
	}

	/**
	 * findAll method
	 * @param  {String}   type Type of operation to be performed (findOne, findAll, create, etc.)
	 * @param  {String}   model model name to perform the operation in
	 * @param  {Object}   where Value for matching the row(s) to be selected
	 * @param  {string[]} projection Columns to be returned for findOne and findAll (optional)
	 * @return {Promise}
	 */
	findAll({ model, projection, where, include, orderWay, orderBy, limit }, isDev = false) {
		if (isDev) {
			return new Promise((resolve, reject) => {
				this.devFetch({
					body: JSON.stringify({
						query: {
							type: "findAll",
							model,
							include,
							where,
							orderBy,
							orderWay,
							limit,
							projection,
							per: "week",
						},
					}),
				})
					.then((data) => {
						resolve(data);
					})
					.catch((e) => {
						resolve(e);
					});
			});
		} else {
			return new Promise((resolve, reject) => {
				this.fetch({
					body: JSON.stringify({
						query: {
							type: "findAll",
							model,
							include,
							where,
							orderBy,
							orderWay,
							limit,
							projection,
						},
					}),
				})
					.then((data) => {
						resolve(data);
					})
					.catch((e) => {
						resolve(e);
					});
			});
		}
	}
	/**
	 * findOne method
	 * @param  {String}   type Type of operation to be performed (findOne, findAll, create, etc.)
	 * @param  {String}   model model name to perform the operation in
	 * @param  {Object}   where Value for matching the row(s) to be selected
	 * @param  {string[]} projection Columns to be returned for findOne and findAll (optional)
	 * @return {Promise}
	 */
	findOne({ model, projection, where, include }) {
		return new Promise((resolve, reject) => {
			this.fetch({
				body: JSON.stringify({
					query: {
						type: "findOne",
						model,
						include,
						where,
						projection,
					},
				}),
			})
				.then((data) => {
					resolve(data);
				})
				.catch((e) => {
					resolve(null);
				});
		});
	}
	/**
	 * count method
	 * @param  {String}   type Type of operation to be performed (findOne, findAll, create, etc.)
	 * @param  {String}   model model name to perform the operation in
	 * @param  {Object}   where Value for matching the row(s) to be selected
	 * @return {Promise}
	 */
	count({ model, where }) {
		return new Promise((resolve, reject) => {
			this.fetch({
				body: JSON.stringify({
					query: {
						type: "count",
						model,
						where,
					},
				}),
			})
				.then((data) => {
					resolve(data);
				})
				.catch((e) => {
					resolve(e);
				});
		});
	}

	fetchSimilarArtists() {
		return new Promise((resolve, reject) => {});
	}
}
