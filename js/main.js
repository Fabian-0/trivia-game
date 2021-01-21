'use strict';

import Users from './classes/Users.js';
import UI from './classes/UI.js';
import Questions from './classes/Questions.js';

export default  class Requests {
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