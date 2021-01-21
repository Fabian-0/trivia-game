import Questions from './Questions.js';
import Requests from '../main.js';

export default  class UI {
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
		let htmlAdd = ``;
		response.forEach((element,index) => {
		 htmlAdd+= `<div class="question-card">
									<p class="question-properties">${element.category + ' | ' +element.difficulty + ' | ' +element.type}</p>
									<h4 class="question-title">${element.question}</h4>
										${UI.questionTemplateValidate(element.type, element.incorrect_answers,element.correct_answer,index)}
								</div>`;
		});
		let htmlTemplate = `<form action="" class="form-answers" id="form-answers-submit">
													${htmlAdd}
													<input type="submit" value="Result" class="form-answers-btn">
												</form>`;
		insertQuest.innerHTML = htmlTemplate;
		Questions.questionsOnClick(response);
	};
	static questionTemplateValidate(questType, arrayAnswers, correct_answer,index){
		let answersTemplate = ``;
		if(questType == 'multiple' && arrayAnswers.length) {
			arrayAnswers.splice(Math.round((Math.random()*(arrayAnswers.length))),0, 1);
			for(let i = 0; i < arrayAnswers.length; i++){
				if(arrayAnswers[i] == 1){
					answersTemplate += `<label for="answer-${(index)}-${i}" class="question-answer">${correct_answer}</label>
					<input value="${arrayAnswers[i]}" type="radio" name="answer${(index)}" id="answer-${(index)}-${i}" class="question-answers" required>`;
				}else{
					answersTemplate += `<label for="answer-${(index)}-${i}" class="question-answer">${arrayAnswers[i]}</label>
															<input value="${arrayAnswers[i]}" type="radio" name="answer${(index)}" id="answer-${(index)}-${i}" class="question-answers" required>`;
				}
			}
			return answersTemplate;
		}else if(questType == 'boolean') {
			if(correct_answer == 'True'){
				answersTemplate += `<label for="answer-${(index)}-1" class="question-answer">True</label>
														<input value="1" type="radio" name="answer${(index)}" id="answer-${(index)}-1" class="question-answers" required>
														<label for="answer-${(index)}-2" class="question-answer">False</label>
														<input value="False" type="radio" name="answer${(index)}" id="answer-${(index)}-2" class="question-answers" required>`;
				return answersTemplate;
			} else {
				answersTemplate += `<label for="answer-${(index)}-1" class="question-answer">True</label>
									<input value="True" type="radio" name="answer${(index)}" id="answer-${(index)}-1" class="question-answers" required>
									<label for="answer-${(index)}-2" class="question-answer">False</label>
									<input value="1" type="radio" name="answer${(index)}" id="answer-${(index)}-2" class="question-answers" required>`;
				return answersTemplate;
			}
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