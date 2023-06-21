//All ready!. Page &  Cordova loaded.
//Todo listo!. Página & Cordova cargados.

const serverUrl = 'http://18.119.119.39:3000'

let userName = "tester"
let title = ""
let rate = ""
let review = ""

function deviceReady() {

	//Your code here **********
	//Su código aquí **********

try{
	fetch(`${serverUrl}/titlesPosterDB`).then(response => response.json())
	.then(data => {
		const movieList = document.getElementById('movieList');
  
	  // Iterar sobre los objetos del JSON y generar los elementos de la lista
	  	data.forEach(item => {
		const movieLi = document.createElement('li');
		
		// Crear un elemento de imagen para mostrar el poster
		const img = document.createElement('img');
		img.src = item.posterURL;
		movieLi.appendChild(img);
  
		// Crear un elemento de título para mostrar el título
		const movieName = document.createElement('h3');
		movieName.textContent = item.title;
		movieLi.appendChild(movieName);

		movieLi.addEventListener('click', async function() {
			const nombrePelicula = item.title; // Reemplaza con el nombre de la película que deseas consultar
			title = item.title;

			fetch(`${serverUrl}/searchMovie`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ title: nombrePelicula })
			})
			.then(response => response.json())
			.then(data => {
				
				const posterBig = document.getElementById('mainPoster');
				posterBig.src = data.movie.poster;
				const mainTitle = document.getElementById('mainTitle');
				mainTitle.textContent = data.movie.title;
				const trailer = document.getElementById('mainTrailer');
				trailer.href = data.movie.trailer;
				const desc = document.getElementById('mainDescription');
				desc.textContent = data.movie.description;

				const estrellas = document.querySelectorAll('.rating .star');
				// Itera sobre cada estrella y las marca según el rating
				estrellas.forEach((estrella, indice) => {

					if (indice < Math.round(parseInt(data.averageRate))) { //TEMPORAL rating DEBERIA SER EL data.rating para que sea real
					estrella.classList.add('resaltada');
					} else {
					estrella.classList.remove('resaltada');
					}
				});

				const reviewList = document.getElementById('reviews');

				data.userReviews.forEach(review => {
					const reviewLi = document.createElement('li');

					const nameUser = document.createElement('h4');
					nameUser.textContent = review.userName
					nameUser.textContent += ': '
					nameUser.textContent += review.rate;
					reviewLi.appendChild(nameUser);
					
					const reviewText = document.createElement('div');
					reviewText.textContent = review.review;
					reviewLi.appendChild(reviewText);

					reviewList.appendChild(reviewLi);
				})

				rate = parseInt(document.getElementById('userStars').value);
				review = document.getElementById('review-area').value;

				mui.viewport.showPage('pageMovie','SLIDE_RIGHT');

			}).catch(error => alert("Error al buscar la pelicula: " + error));

		  });
  
		movieList.appendChild(movieLi);
    });
  })
  .catch(error => alert("Error al realizar la consulta general: " + error));
	

	const rankingList = document.getElementById('movieListTop');

	fetch(`${serverUrl}/rankingShow`)
	.then(response => response.json())
	.then(data => {
		
		data.forEach(movie => {
		
		const listItem = document.createElement('li');

		const posterImage = document.createElement('img');
		posterImage.src = movie.poster;

		const movieTitle = document.createElement('h3');
		movieTitle.textContent = movie.title;
		movieTitle.textContent += ': '
		movieTitle.textContent += parseFloat(movie.averageRating);

		listItem.appendChild(posterImage);
		listItem.appendChild(movieTitle);

		rankingList.appendChild(listItem);
		});
	});


	//Hide splash
	//Ocultar el splash
	if (navigator.splashscreen) {
		navigator.splashscreen.hide();
	}

	installEvents();

	}catch(error){
		error => alert("Error al realizar llamada a sv: " + error);
	}
}

function installEvents() {

	$('#login').click(
		async function() {
			userName = document.getElementById('signInName').value;
			const password = document.getElementById('signInPass').value;

			const response = await fetch(`${serverUrl}/login`, {
			  method: 'POST',
			  headers: {
				'Content-Type': 'application/json'
			  },
			  body: JSON.stringify({ userName, password})
			});
	  
			if (response.status == 200){
				alert('Bienvenido ' + userName);
				mui.viewport.showPage('pageMain','SLIDE_LEFT');
			} else if(response.status == 400) {
				alert('El nombre o contraseña son incorrectos');
			} else if (response.status == 500){
				alert('Hubo un problema al iniciar sesion, intente más tarde');
			}
			
			return false
		}
	);

	$('.logo-bar').click(
		async function() {
			mui.viewport.showPage('pageTop10','SLIDE_RIGHT');
			return false;
		}
	);

	$('#registro').click(function() {
		mui.viewport.showPage('pageSignUp','SLIDE_RIGHT');
		return false;
	});

	$('#retorno').click(function() {
		mui.viewport.showPage('pageStart','SLIDE_LEFT');
		return false;
	});

	$('.user-icon').click(
		async function () {
	  
			fetch(`${serverUrl}/userReview`, {
			  method: 'POST',
			  headers: {
				'Content-Type': 'application/json'
			  },
			  body: JSON.stringify({ userName })
			})
			.then(response => response.json())
			.then(reviews => {
			  const reviewList = document.getElementById('userReviews');
			  reviewList.innerHTML = "";
	  
			  if (reviews.length === 0) {
				reviewList.innerHTML = 'No se encontraron reseñas para el usuario.';
			  } else {
				
				reviews.forEach(review => {
					const reviewLi = document.createElement('li');

					const nameMovie = document.createElement('h4');
					nameMovie.textContent = review.title
					nameMovie.textContent += ': '
					nameMovie.textContent += review.rate;
					reviewLi.appendChild(nameMovie);
					
					const reviewText = document.createElement('div');
					reviewText.textContent = review.review;
					reviewLi.appendChild(reviewText);

					reviewList.appendChild(reviewLi);
				})
			  }
			})
			mui.viewport.showPage('pageUser','SLIDE_LEFT');
			return false;
		  }
	);

	$('#sendReview').click(
		async function() {
			
			rate = parseInt(document.getElementById('userStars').value);
			review = document.getElementById('review-area').value;
			const response = await fetch(`${serverUrl}/makeReview`, {
			  method: 'POST',
			  headers: {
				'Content-Type': 'application/json'
			  },
			  body: JSON.stringify({ userName, title, review, rate })
			});
	  
			if (response.status == 200) {
			  alert('La reseña se envio con exito');
			} else {
			  alert('Error:' + response.status);
			}
		  }
	);

	$('#createUser').click(
		async function() {
			userName = document.getElementById('signName').value;
			const email = document.getElementById('signMail').value;
			const password = document.getElementById('signPass').value;

			if(userName == '' || email == '' || password == ''){
				alert('Uno o más campos están vacios')
				return false
			}

			const response = await fetch(`${serverUrl}/signUp`, {
			  method: 'POST',
			  headers: {
				'Content-Type': 'application/json'
			  },
			  body: JSON.stringify({ userName, password, email })
			});
	  
			if (response.status == 200){
				alert('Usuario resgistrado correctamente');
				mui.viewport.showPage('pageStart','SLIDE_LEFT');
			} else if(response.status == 400) {
				alert('Ya existe un usuario con esos datos');
			} else if (response.status == 500){
				alert('Error al registrar el usuario, intente más tarde');
			}
			
			return false
		}
	)

}