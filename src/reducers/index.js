import { combineReducers } from 'redux';
import isAuthReducer from './reducer_isAuth';
import authMessageReducer from './reducer_authMessage';
import showLoginReducer from './reducer_showLogin';
import userInfoReducer from './reducer_userInfo';
import addAdminDisplayReducer from './reducer_addAdminDisplay';
import createDisplayReducer from './reducer_createDisplay';
import expenseDatabaseReducer from './reducer_expenseDatabase';
import modalReducer from './reducer_modal';
import errorMessageReducer from './reducer_errorMessage';

const rootReducer = combineReducers({
	isAuth: isAuthReducer,
	authMessage: authMessageReducer,
	showLogin: showLoginReducer,
	userInfo: userInfoReducer,
	addAdminDisplay: addAdminDisplayReducer,
	createDisplay: createDisplayReducer,
	expenseDatabase: expenseDatabaseReducer,
	modal: modalReducer,
	errorMessage: errorMessageReducer
});

export default rootReducer;