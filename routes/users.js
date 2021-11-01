const express = require('express');
const router = express.Router();
const User = require('../models/usermodel');

//.............................Render form to create a user using GET request.......................................
router.get('/register', (req, res, next) => {
	return res.render('user_register');
});

//.............................Render a form to create a user using POST request......................................
router.post('/register', (req, res, next) => {
	let personInfo = req.body;

	if (!personInfo.email || !personInfo.username || !personInfo.password || !personInfo.passwordConf) {
		//one of the mentioned fields is missing
		res.send();
	} 
	else {
		if (personInfo.password == personInfo.passwordConf) { 
			//check if entered password matches confirm password
			User.findOne({ email: personInfo.email }, (err, data) => {
				if (!data) { 
					//if no similar email has been found in the database, this section sets a unique id for user
					let id;
					User.findOne({}, (err, data) => {
						//here we find the unique id for the most recent record and increment it by one to set id of new user
						if (data) {
							id = data.unique_id + 1;
						} 
						else {
							id = 1;
						}

						let newPerson = new User({
							unique_id: id,
							email: personInfo.email,
							username: personInfo.username,
							password: personInfo.password,
							passwordConf: personInfo.passwordConf
						});

						newPerson.save((err, Person) => {
							if (err)
								console.log(err);
							else
								console.log('Success');
						});
					}).sort({ _id: -1 }).limit(1);
					res.send({ "Success": "You are registered. Please log in to continue." });
					res.redirect('/users/login')
				}
				else {
					res.send({ "Success": "Email is already used." });
				}
			});
		} 
		else {
			res.send({ "Success": "password is not matched" });
		}
	}
});

//.............................Render a form to log in using GET request...............................................
router.get('/login', (req, res, next) => {
	return res.render('user_login');
});

//.............................Render a form to log in using POST request...............................................
router.post('/login', (req, res, next) => {
	User.findOne({ email: req.body.email }, (err, data) => {
		if (data) {

			if (data.password == req.body.password) {
				req.session.userId = data.unique_id;
				//res.send({ "Success": "Success!" });
				res.redirect('/blogs');
				console.log(req.session);
				//redirect member to certain page
			} 
			else {
				res.send({ "Success": "Wrong password!" });
			}
		} 
		else {
			res.send({ "Success": "This Email Is not regestered!" });
		}
	});
});

//.............................Check profile using GET request.......................................................
router.get('/profile', (req, res, next) => {
	User.findOne({ unique_id: req.session.userId }, (err, data) => {
		if (!data) {
			res.redirect('/signup');
		} 
		else {
			return res.render('user_profile', { "name": data.username, "email": data.email });
		}
	});
});

//.............................Render a form to log out using GET request............................................
router.get('/logout', (req, res, next) => {
	if (req.session) {
		// delete session object
		req.session.destroy((err) => {
			if (err) {
				return next(err);
			} 
			else {
				return res.redirect('/');
			}
		});
	}
});

//..........................Render a form to update password using GET request.......................................
router.get('/forgetpass', (req, res, next) => {
	res.render("forget");
});

//..........................Render a form to update password using GET request.......................................
router.post('/forgetpass', (req, res, next) => {
	User.findOne({ email: req.body.email }, (err, data) => {
		if (!data) {
			res.send({ "Success": "This Email Is not regestered!" });
		} 
		else {
			if (req.body.password == req.body.passwordConf) {
				data.password = req.body.password;
				data.passwordConf = req.body.passwordConf;

				data.save((err, Person) => {
					if (err)
						console.log(err);
					else
						console.log('Success');
					res.send({ "Success": "Password changed!" });
				});
			} 
			else {
				res.send({ "Success": "Password does not matched! Both Password should be same." });
			}
		}
	});

});

module.exports = router;