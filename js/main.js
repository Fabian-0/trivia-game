'use strict';

class Users {
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

class UI {
	static printUserData(){
		const user = localStorage.getItem('Account');
		const storageUser = JSON.parse(user);
		UI.printScore(storageUser.score);
		UI.printUser(storageUser.name);
	}
	static printUser(user) {
		const divUser = document.getElementById('printUser');
		divUser.textContent = user;
	}
	static printScore(score){
		const insertScore = document.getElementById('userScore');
		insertScore.textContent = 'Score '+score;
	}
	getInputs() {
		this.category = document.getElementById('categoryValues');
		this.number = document.getElementById('numberValues');
		this.type = document.getElementById('typeValues');
		this.difficulty = document.getElementById('dificultyValues');
		return this;
	}
	static printForm(){
		const dataInputs = new UI; 
		const saveValues = dataInputs.getInputs();
		let categoriesArray;
		const categoriesFetch = Requests.getCategories()
			.then(data => {
				for (let index = 0; index < data.trivia_categories.length; index++) {
					const optionInsert = document.createElement('option');
					const nameValue = data.trivia_categories[index].name;
					optionInsert.textContent = nameValue;
					optionInsert.setAttribute('value', 'category-'+data.trivia_categories[index].id);
					saveValues.category.appendChild(optionInsert);		
				}
			})
			.catch('error');
		return categoriesArray;
	}
	static printQuestions(response){
		const insertQuest = document.getElementById('addQuestionResponse');
		let html = '';
		response.forEach((element,index) => {
		 html+= `<div class="question-card">
				<p class="question-properties">${element.category + ' | ' +element.difficulty + ' | ' +element.type}</p>
				<h4 class="question-title">${element.question}</h4>
				<form class="form-answers">
					${UI.questionTemplateValidate(element.type, element.incorrect_answers,element.correct_answer,index)}

				</form>
			</div>`;
		});
		html += `<input type="submit" value="Result" class="form-answers-btn" id="form-answers-submit">`;
		insertQuest.innerHTML = html;
		Questions.questionsOnClick(response);
	};
	static questionTemplateValidate(questType, arrayAnswers, correct_answer,index){
		let answersTemplate = ``;
		if(questType == 'multiple' && arrayAnswers.length) {
			arrayAnswers.splice(Math.round((Math.random()*(arrayAnswers.length))),0, 1);
			for(let i = 0; i < arrayAnswers.length; i++){
				if(arrayAnswers[i] == 1){
					answersTemplate += `<label for="answer-${(index)}-${i}" class="question-answer">${correct_answer}</label>
					<input value="${arrayAnswers[i]}" type="radio" name="answer${(index)}" id="answer-${(index)}-${i}" class="question-answers">`;
				}else{
					answersTemplate += `<label for="answer-${(index)}-${i}" class="question-answer">${arrayAnswers[i]}</label>
															<input value="${arrayAnswers[i]}" type="radio" name="answer${(index)}" id="answer-${(index)}-${i}" class="question-answers">`;
				}
			}
			return answersTemplate;
		}else if(questType == 'boolean') {
			answersTemplate += `<label for="answer-${(index)}-1" class="question-answer">True</label>
													<input value="True" type="radio" name="answer${(index)}" id="answer-${(index)}-1" class="question-answers">
													<label for="answer-${(index)}-2" class="question-answer">False</label>
													<input value="False" type="radio" name="answer${(index)}" id="answer-${(index)}-2" class="question-answers">`;
			return answersTemplate;
		}
	}
	static printResults(results, response,score){
		const insertQuest = document.getElementById('addQuestionResponse');
		let htmlAddFirst = ``;
		let htmlAddSecond = ``;
		for (let i = 0; i < results.length; i++) {
			htmlAddSecond	+= `<p class="questions-results-data answer-correct">${(i+1)+' - '+response[i].correct_answer}</i></p>`
			if(results[i] == response[i].correct_answer) {
				htmlAddFirst += `<p class="questions-results-data answer-selected">${(i+1)} - &nbsp ${results[i]} &nbsp <i class="far fa-check-circle"></i></p>`
			}else{
				htmlAddFirst += `<p class="questions-results-data answer-selected">${(i+1)} - &nbsp ${results[i]} &nbsp <i class="far fa-times-circle"></i></p>`
			}
		}
		let htmlTemplate = `<div class="questions-results row">
							<h2 class="questions-results-title col-lg-12 col-lg-12 col-sm-12"><i class="fas fa-star"></i>&nbsp Results &nbsp<i class="fas fa-star"></i></h2>
							<div class="questions-results-incorrect-answers-content col-lg-6 col-lg-6 col-sm-12">
								<p class="questions-results-data answer-selected">Your Answers &nbsp</p>
								${htmlAddFirst}
							</div>
							<div class="questions-results-correct-cont col-lg-6 col-lg-6 col-sm-12">
								<p class="questions-results-data answer-correct">Correct Answers</p>
								${htmlAddSecond}
							</div>
							<h2 class="questions-results-score col-lg-6 col-lg-6 col-sm-12">TOTAL SCORE ${score}</h2>
						</div>`;
		insertQuest.innerHTML = htmlTemplate;
	}
	static catchError(){
		let fragment = document.createDocumentFragment();
		let htmlDiv = document.createElement('div');
		htmlDiv.classList.add('error-database');
		htmlDiv.setAttribute('id','close-error-fetch');
		let htmlP = document.createElement('p');
		htmlP.classList.add('error-database-alert');
		htmlP.textContent = 'There are not so many questions in the database with the desired filters';
		htmlDiv.append(htmlP);
		fragment.append(htmlDiv);
		document.body.append(fragment);
		setTimeout(() => {
			document.getElementById('close-error-fetch').remove();
		}, 1250);
	}
	static sessionError(){
		let fragment = document.createDocumentFragment();
		let htmlDiv = document.createElement('div');
		htmlDiv.classList.add('error-database');
		htmlDiv.setAttribute('id','close-error-fetch');
		let htmlP = document.createElement('p');
		htmlP.classList.add('error-database-alert');
		htmlP.textContent = 'Email or Password incorrects';
		htmlDiv.append(htmlP);
		fragment.append(htmlDiv);
		document.body.append(fragment);
		setTimeout(() => {
			document.getElementById('close-error-fetch').remove();
		}, 1250);
	}
}

class Questions {
	static getQuestions(){
		return new Promise((resolve, reject)=> {
			const getValues = new UI;
			const saveValues = getValues.getInputs();
			const categoryValue = saveValues.category.value.split('-')[1];
			let url = `https://opentdb.com/api.php?amount=${saveValues.number.value}${(saveValues.category.value != 'anyCategoryValue') ? `&category=`+categoryValue : ''}${(saveValues.difficulty.value != 'anyDifficultyValue') ? `&difficulty=`+saveValues.difficulty.value : ''}${(saveValues.type.value != 'anyType') ? `&type=`+saveValues.type.value : ''}`;
			fetch(url)
			.then(response => response.json())
			.then(response => {
				if(response.results.length){
					return resolve(response);
				}else{
					return reject();
				}
			});
		});
	}
	static getQuestionsSubmit(){
		return new Promise((resolve,reject)=>{
			const btnSubmit = document.getElementById('getQuestionsSubmit');
			btnSubmit.parentElement.addEventListener('submit', (e)=>{
				e.preventDefault();
			})
			btnSubmit.addEventListener('click',()=>{
				Questions.getQuestions()
					.then(response=>{
						UI.printQuestions(response.results);
						resolve(response);
					},()=>{
						if(document.getElementById('numberValues').value){
							UI.catchError();
						}
					});
			});
		});
	}
	static questionsOnClick(response){
		const btnConsult = document.getElementById('form-answers-submit');
		btnConsult.addEventListener('click', ()=>{
			let score =0;
			let results = [];
			for (let i = 0; i < response.length; i++) {
				let element = document.querySelector('input[name="answer'+ i +'"]:checked');
				(element == null) ? element ='Not answered' : element = element.value;
				console.log('0');
				if(element == 1) {
					results.push(response[i].correct_answer);
					score+=100;
				}else{
					results.push(element);
				}
			}
			UI.printResults(results, response, score);
			let updateScore = JSON.parse(localStorage.getItem('Account'));
			updateScore.score += score;
			localStorage.setItem('Account', JSON.stringify(updateScore));
			UI.printScore(updateScore.score);
			return score;
		});
	}
}

class CardsSessions {
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

class Requests {
	static getCategories(){
		return new Promise((resolve, reject)=> {
			fetch(('https://opentdb.com/api_category.php'))
			.then(response => response.json())
			.then(response => {
				if(response.trivia_categories.length){
					return resolve(response);
				}else{
					return reject();
				}
			});
		});
	}
}

Users.sessionValidate();
UI.printForm();
Questions.getQuestionsSubmit();