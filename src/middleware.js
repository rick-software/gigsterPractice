import * as actions from './actions';
import axios from 'axios';

export function customedMiddleware(store) {
	return next => action => {
		if(action.type === 'SIGNUP') {
			axios.post('/api/signup', {
				username: action.username,
				password: action.password
			})
				.then(res => {
					if (res.status === 200) {
						store.dispatch(actions.authSucceed(res.data.username, res.data.isAdmin));
					} else {
						store.dispatch(actions.authFail(res.data));
					}
				})
				.catch(error => console.log(error));
		}

		if (action.type === 'LOGIN') {
			axios.post('/api/login', {
				username: action.username,
				password: action.password
			})
				.then(res => {
					if (res.status === 200) {
						store.dispatch(actions.authSucceed(res.data.username, res.data.isAdmin));
					} else {
						store.dispatch(actions.authFail(res.data));
					}
				})
				.catch(error => console.log(error));
		}

		if (action.type === 'SAVEEXPENSE') {
			axios.post('/api/saveexpense', {
				username: action.username,
				datetime: action.datetime,
				cost: action.cost,
				description: action.description
			})
				.then(res => {
				})
				.catch(error => console.log(error));
		}

		return next(action);
	};
}

export default function(store) {
}