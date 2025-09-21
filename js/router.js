// تعريف المسارات
const routes = {
    'home': {
        template: 'pages/home.html',
        script: 'js/home.js',
        init: initHomePage
    },
    'publish': {
        template: 'pages/publish.html',
        script: 'js/publish.js',
        init: initPublishPage,
        auth: true
    },
    'login': {
        template: 'pages/login.html',
        script: 'js/login.js',
        init: initLoginPage
    },
    'register': {
        template: 'pages/register.html',
        script: 'js/register.js',
        init: initRegisterPage
    },
    'profile': {
        template: 'pages/profile.html',
        script: 'js/profile.js',
        init: initProfilePage,
        auth: true
    }
};
