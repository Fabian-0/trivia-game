import CardsSessions from './CardsSessions.js';
import UI from './UI.js';

export default class Users {
	constructor(name, email, password,score){
		this.name = name;
		this.email = email;
		this.password = password;
		this.score = score;
	}
	static createNewUser(name, email, password) {
		const user = new Users(name, email, password, 0);
		localStorage.setItem('Account',JSON.stringify(user));
		sessionStorage.setItem('Account',JSON.stringify(user));
		return user;
	}
	static	createGuestSession(){
		const guest = new Users('Guest', '','', 0);
		localStorage.setItem('Account',JSON.stringify(guest));
		sessionStorage.setItem('Account','Guest')
		return guest;
	}
	static sessionValidate(){
		if(localStorage.getItem('Account')){
			const getAccount = JSON.parse(localStorage.getItem('Account'));
			if(getAccount.name == 'Guest' || sessionStorage.length){
				sessionStorage.setItem('Account',localStorage.getItem('Account'));
				UI.printUserData();
				return
			}else {
				let cardSession = new CardsSessions();
				CardsSessions.printCardSession();
				cardSession.closeEvent();
				return;
			}
		}else {
			let cardSession = new CardsSessions();
			CardsSessions.printCardSession();
			cardSession.closeEvent();
			return;
		}
	}
	static registerUser(){
		return new Promise((resolve, reject) => {
			const registerUser = document.getElementById('accountRegister');
			registerUser.addEventListener('click',()=>{
				const	nameUser = document.getElementById('nameRegister');
				const	emailUser = document.getElementById('emailRegister');
				const passwordUser = document.getElementById('passwordRegister');
				if(nameUser.value == '' | emailUser.value == '' | passwordUser.value == '') return (reject);
				Users.createNewUser(nameUser.value, emailUser.value, passwordUser.value);
				resolve();
			});
		});
	}
}