import Users from './Users.js';
import UI from './UI.js';

export default class CardsSessions {
	static printRegister() {
		const insert = document.getElementById('sessionAlert');
		const html = `<form action="" class="form-session" onsubmit="event.preventDefault()">
										<h3 class="session-title">Register</h3>
										<input required class="session-input" type="text" name="name" id="nameRegister" placeholder="user">
										<input required class="session-input" type="email" name="email" id="emailRegister"placeholder="email">
										<input required class="session-input" type="password" name="password" id="passwordRegister" placeholder="password">
										<button class="session-login" id="accountRegister">Register</button>
									</form>;`;
		insert.innerHTML = html;
	}
	static printCardSession() {
		const html = `	<div class="session-alert" id="sessionAlert">
						<form action="" class="form-session" onsubmit="event.preventDefault()">
							<p class="form-close" id="closeSessionCard">x</p>
							<h3 class="session-title">Login</h3>
							<input required class="session-input" type="email" name="email" id="userEmail"placeholder="Email">
							<input required class="session-input" type="password" name="password" id="userPassword" placeholder="Password">
							<button class="session-login" id="accountLogin">Login</button>
							<a href="" onclick="event.preventDefault()" class="create-user" id="create-count-id">Don't have an account?</a>
							<a href="" onclick="event.preventDefault()" class="create-user" id="create-guest-id">Login as guest</a>
						</form>
					</div>`;
		document.body.insertAdjacentHTML("beforeend",html);
	}
	closeEvent(){
		const closeButton = document.getElementById('closeSessionCard');
		const closeHref = document.getElementById('create-guest-id');
		const loginButton = document.getElementById('accountLogin');
		const registerEvent = document.getElementById('create-count-id');
		const cardClose = closeButton.parentNode.parentNode;
		closeButton.addEventListener('click',()=>{
			cardClose.remove();
			Users.createGuestSession();
			UI.printUserData();
			return true;
		});
		closeHref.addEventListener('click',()=>{
			cardClose.remove();
			Users.createGuestSession();
			UI.printUserData();
			return true;
		});
		loginButton.addEventListener('click', ()=>{
			const	emailUser = document.getElementById('userEmail');
			const passwordUser = document.getElementById('userPassword');
			if(emailUser.value == '' | emailUser.value == '' | passwordUser.value == '') return;
			const userStorage = JSON.parse(localStorage.getItem('Account'));
			if(userStorage == null) {
				UI.sessionError();
				return
			};
			if(emailUser.value == userStorage.name | emailUser.value == userStorage.email && passwordUser.value == userStorage.password) {
				cardClose.remove();
				UI.printUserData();
			}else {
				UI.sessionError();
			}
		});
		registerEvent.addEventListener('click',()=>{
			CardsSessions.printRegister();
			Users.registerUser()
				.then((data)=>{
					UI.printUserData();
					cardClose.remove();
				});
		});
	}
}