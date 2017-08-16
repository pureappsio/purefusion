// Main route
Router.route('/courses', {
    name: 'coursesStudent',
    waitOn: function() {
        return [Meteor.subscribe('userProducts'), Meteor.subscribe('userMetas')];
    },
    data: function() {

        console.log('Routing');

        if (Session.get('preview')) {

            if (Session.get('preview') == true) {
                this.render('courses');
            } else {
                this.render('login');
            }

        } else {

            if (this.ready()) {

                if (!Meteor.userId()) {

                    this.render('visitorPage');

                } else {

                    this.render('courses');

                }

            } else {
                this.render('loading');
            }

        }

    }
});

// Courses
Router.route('/courses/:_id', function() {
    this.render('courseDetails', {
        data: function() {
            return Products.findOne({ _id: this.params._id });
        }
    });
});

// Modules
Router.route('/modules/:_id', function() {
    this.render('moduleDetails', {
        data: function() {
            return Modules.findOne({ _id: this.params._id });
        }
    });
});

// Modules
Router.route('/lessons/:_id', function() {
    this.render('lessonDetails', {
        data: function() {
            return Lessons.findOne({ _id: this.params._id });
        }
    });
});

// Signup
Router.route('/users/signup', {
    name: 'studentSignup',
    data: function() {
        this.render('studentSignup');
    }
});

// Login
Router.route('/users/login', {
    name: 'studentLogin',
    data: function() {
        this.render('studentLogin');
    }
});