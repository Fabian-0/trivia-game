import UI from './UI.js';

export default class Questions {
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
		btnConsult.addEventListener('submit', ()=>{
			let score =0;
			let results = [];
			for (let i = 0; i < response.length; i++) {
				let element = document.querySelector('input[name="answer'+ i +'"]:checked').value;
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