import { initializeApp } from 'firebase/app';
import { getAuth, User } from 'firebase/auth';

const config = {
	apiKey: "AIzaSyB9x2exL311W4fxZFLExZk0mLn6IcKqa2Q",
	authDomain: "development-6860e.firebaseapp.com",
	projectId: "development-6860e",
	storageBucket: "development-6860e.appspot.com",
	messagingSenderId: "571546627177",
	appId: "1:571546627177:web:d7d103da3016a2d71a46f8"
};

const app = initializeApp(config);

export const auth = getAuth(app);
export type firebaseUser = User;
export { config }; 
