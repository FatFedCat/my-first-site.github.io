'use strict'
//---------------------------------------
/*
|| (ИЛИ)
||= (Оператор логического присваивания ИЛИ)
&& (И)
&&= (Оператор логического присваивания И)
! (НЕ)

alert - всплывающее окно в верху, с кнопкой "OK"
promt - всплывающее окно в верху с возможностью ввода 
confirm - всплывающее окно в верху, как alert только с возможонстью ответить "cansel" всегда возвращает bool тип
*/
//---------------------------------------



//---------------------------------------
// alert(`давайте сложим 2 числа`)
// let a = Number(prompt('введите 1 число:'))
// let b = Number(prompt('введите 2 число:'))

// alert(`ваш ответ ${a + b}`)
//---------------------------------------


//---------------------------------------
// let b = 1
// let result = 1
// let answer = true
// while(answer) {  
//     let a = +prompt('из какого числа вы хотите вычеслить факториал?')
//     if (a > 50){
//         alert('Число слишком большое')
//         continue
//     }else {
//         result = 1
//         b = 1
//         while(b <= a) {
//             result *= b
//             b++
//             console.log(result)
//         }
//     }
//     answer = confirm(`Ваш ответ ${result} \nХотите продолжить?`)
// }
//---------------------------------------
const makeKeyedObject = (baseKey, count) => {
	const obj = {};
	for (let i = 0; i < count; i++) {
		obj[baseKey + i] = i;
	}
	return obj;
}

const onClickByid = (id, handler) => {
	const el = Byid(id); //! если добавить ! перед el то мы получим boolean значение
	if (!el) return false;
	el.addEventListener('click', handler);
	return true;
}

const hasIndex = (arr, index) => {
	return index in arr;
}

const Byid = (id) => {
	return document.getElementById(id);
}

const calcTable = document.querySelector('.calc-table');

let expr = '';

if (calcTable) {
	calcTable.addEventListener('click', (e) => {
		const btn = e.target.closest('button');
		if (!btn) return;

		const action = btn.dataset.action;
		const val = btn.dataset.value;

		if (action) {
			switch (action) {
				case 'clear':
					expr = '';
					break;
				case 'backspace':
					expr = expr.slice(0, -1);
					break;
				default:
					// другие action пока игнорируем
					break;
			}
		} else if (val) {
			// цифры/операторы/точка приходят сюда через data-value
			expr += val;
		}

		console.log('expr:', expr);
		console.log('clicked:', {
			text: btn.textContent.trim(),
			value: val,
			action: action,
		});

	});
}




onClickByid('visit-banner', () => console.log('click'));

const obj = makeKeyedObject('key', 3);
console.log(obj);
console.log(obj['key2']);

console.log(hasIndex([1, 2, 3], 2));