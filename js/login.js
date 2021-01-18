'use strict';

class Users {
	constructor(name, email, password,score){
		this.name = name;
		this.email = email;
		this.password = password;
		this.score = score;
	}
	static	createGuest(){
		return new Users('Guest', '', '', 0);
	}
	// score = 0;
}

class UI {
	static printUser(){
		const user = localStorage.getItem('user');
		const divUser = document.getElementById('printUser');
		const scoreUser = document.getElementById('userScore');
		const storageUser = JSON.parse(localStorage.getItem('user'));
	 let templateName = `<li class="header-cont-link"><a href="" class="header-link b-right">${storageUser.name}</a></li>`;
		divUser.innerHTML = templateName;
		scoreUser.textContent = 'Score ' + storageUser.score;
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
		console.log(response.length);
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
			arrayAnswers.splice(Math.round((Math.random()*(arrayAnswers.length))),0,correct_answer);
			for(let i = 0; i < arrayAnswers.length; i++){
				console.log(questType);
				answersTemplate += `<label for="answer-${(index)}-${i}" class="question-answer">${arrayAnswers[i]}</label>
														<input value="${arrayAnswers[i]}" type="radio" name="answer${(index)}" id="answer-${(index)}-${i}" class="question-answers">`;
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
					});
			});
		});
	}
	static questionsOnClick(response){
		const btnConsult = document.getElementById('form-answers-submit');
		btnConsult.addEventListener('click', ()=>{
			let score =0;
			for (let i = 0; i < response.length; i++) {
				const element = document.querySelector('input[name="answer'+ i+'"]:checked').value;
				if(element == response[i].correct_answer) {
					score+=100;
				}
			}
			return score;
		});
	}
}

class CardsSessions {
	constructor(id){
		this.id = document.getElementById(id);
		this.parentId = this.id.parentNode;
	}
	closeEvent(){
		this.id.addEventListener('click',()=>{
			this.parentId.parentNode.remove();
			return  Users.createGuest();
		});
	}
	static sessionValidate(){
		if(window.localStorage.length == 0){
			localStorage.setItem('user', JSON.stringify(Users.createGuest()));
			UI.printUser()
			return true;
		}else {
			UI.printUser()
			return localStorage.getItem('user');
		}
	}
}

let cardSession = new CardsSessions('closeSessionCard');
let closeSession = new Promise((resolve,reject)=>{
	let promiseClose = cardSession.closeEvent();
	if(promiseClose === 'undefined'){
		reject('error');
	}else {
		console.log(promiseClose)
		resolve();
	}
});

UI.printForm();
Questions.getQuestionsSubmit();
// cardSession.closeAlert();
// const close = document.getElementById('closeSessionCard');